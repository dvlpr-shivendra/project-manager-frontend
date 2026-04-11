<template>
  <div class="flex flex-col h-full bg-white dark:bg-gray-900">
    <div
      class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0 gap-3"
    >
      <div class="flex gap-2">
        <button @click="emit('close')">
          <back />
        </button>
        <button
          v-if="can('update-task')"
          @click="markComplete"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-200 cursor-pointer"
          :class="
            task.is_complete
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-900'
          "
        >
          <svg
            v-if="task.is_complete"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M9 12l2 2 4-4m5 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
          {{ task.is_complete ? "Completed" : "Mark complete" }}
        </button>
        <div v-else class="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold" :class="task.is_complete ? 'text-emerald-600' : 'text-gray-500'">
           <svg
            v-if="task.is_complete"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M9 12l2 2 4-4m5 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ task.is_complete ? "Completed" : "Incomplete" }}
        </div>
      </div>
      <div v-if="can('delete-task')" class="flex items-center gap-1">
        <el-dropdown trigger="click" placement="bottom-end">
          <button
            class="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <MoreFilled style="width: 14px; height: 14px" />
          </button>
          <template #dropdown
            ><el-dropdown-menu
              ><el-dropdown-item @click="remove" style="color: #ef4444"
                >Delete task</el-dropdown-item
              ></el-dropdown-menu
            ></template
          >
        </el-dropdown>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-1">
      <input
        v-if="can('update-task')"
        type="text"
        v-model="task.title"
        placeholder="Task title"
        class="w-full font-['Syne'] font-bold text-xl text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700 mb-4 leading-snug"
      />
      <h1 v-else class="w-full font-['Syne'] font-bold text-xl text-gray-900 dark:text-white mb-4 leading-snug">{{ task.title }}</h1>
      <el-form label-position="top" class="flex flex-col gap-1">
        <el-form-item label="Deadline"
          ><el-date-picker
            :disabled="!can('update-task')"
            style="width: 100%"
            placeholder="Set a deadline"
            v-model="task.deadline"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
        /></el-form-item>
        <user-select
          v-if="can('update-task')"
          label="Assignee"
          :user="task.assignee"
          @change="assignTo"
          class="w-full"
        />
        <div v-else class="flex flex-col gap-2 mb-4">
          <span class="text-[13px] text-gray-400 font-medium">Assignee</span>
          <div class="flex items-center gap-2">
            <el-avatar :size="24" :src="`https://ui-avatars.com/api/?name=${task.assignee?.name || 'U'}&background=6366f1&color=fff`" />
            <span class="text-[13px] text-gray-700 dark:text-gray-300">{{ task.assignee?.name || 'Unassigned' }}</span>
          </div>
        </div>
        <el-form-item label="Description">
          <Editor v-model="task.description" :read-only="!can('update-task')" />
        </el-form-item>
        <div class="flex flex-col gap-2 mt-1">
          <attachments
            :action="url(`tasks/${task.id}/attachments`)"
            :taskId="task.id"
            :attachments="task.attachments"
            :disabled="!can('update-task')"
            @add="addAttachment"
            @remove="removeAttachment"
          />
          <followers
            :followers="task.followers"
            :disabled="!can('update-task')"
            @add="addFollower"
            @remove="removeFollower"
          />
          <comments :endPoint="`tasks/${task.id}/comments`" />
        </div>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Back from "@/components/ui/Back.vue";
import UserSelect from "@/components/ui/UserSelect.vue";
import { destroy, post, put, url } from "@/helpers/http";
import { inject, onMounted, onUpdated, ref, watch, type Ref } from "vue";
import { MoreFilled } from "@element-plus/icons-vue";
import { debounce } from "lodash";
import { useRouter } from "vue-router";
import { useTasks } from "@/stores/tasks";
import Editor from "@/components/ui/editor/Editor.vue";
import { ElMessageBox } from "element-plus";
import Followers from "@/components/ui/Followers.vue";
import Attachments from "@/components/ui/Attachments.vue";
import Comments from "@/components/ui/Comments.vue";
import { useCan } from "@/composables/useCan";

const props = defineProps<{ task: Task }>();
const tasks = useTasks();
const router = useRouter();
const emit = defineEmits(["close"]);
const updateTask = inject<(task: Task) => void>("updateTask")!;
const { can } = useCan();

let unwatch = () => {};

onMounted(() => {
  unwatch();
  if (can('update-task')) {
    unwatch = watch(props.task, debounce(updateTask, 750));
  }
});

function assignTo(user: User) {
  props.task.assignee = user;
  props.task.assignee_id = user.id;
}

const markingComplete: Ref<boolean> = ref(false);

function markComplete() {
  markingComplete.value = true;
  props.task.is_complete = !props.task.is_complete;
  put(url(`tasks/${props.task.id}`), props.task)
    .catch(() => {
      props.task.is_complete = !props.task.is_complete;
    })
    .finally(() => (markingComplete.value = false));
}

function remove() {
  ElMessageBox.confirm("Delete this task permanently?", "Delete task", {
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      tasks.remove(props.task.id);
      router.replace({
        query: { ...router.currentRoute.value.query, task: null },
      });
    })
    .catch(() => {});
}
function addAttachment(a: Attachment) {
  props.task.attachments.push(a);
}

function removeAttachment(id: number) {
  destroy(url(`tasks/${props.task.id}/attachments/${id}`)).then(() => {
    props.task.attachments.splice(
      props.task.attachments.findIndex((a) => a.id === id),
      1,
    );
  });
}
function addFollower(user: User) {
  post(url(`tasks/${props.task.id}/followers/${user.id}`)).then(() =>
    props.task.followers.push(user),
  );
}

function removeFollower(id: number) {
  destroy(url(`tasks/${props.task.id}/followers/${id}`)).then(() => {
    props.task.followers.splice(
      props.task.followers.findIndex((f) => f.id === id),
      1,
    );
  });
}
</script>
