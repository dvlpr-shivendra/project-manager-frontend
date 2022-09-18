<template>
  <div class="shadow h-screen">
    <div class="w-full flex justify-between items-center border px-4 py-2">
      <div>
        <el-tooltip class="box-item" effect="dark" :content="'Mark ' + (task.is_complete ? 'Incomplete' : 'Complete')"
          placement="bottom">
          <el-button @click="markComplete" :type="task.is_complete ? 'danger' : 'success'"
            :icon="task.is_complete ? Remove : Check" circle></el-button>
        </el-tooltip>

        <timer v-if="!task.is_complete" :task="task" />

      </div>

      <div class="flex items-center">
        <el-dropdown class="mr-2">
          <el-button :text="true">
            <MoreFilled class="text-black w-4 h-4" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="remove">Delete</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-tooltip class="box-item" effect="dark" content="Close" placement="bottom">
          <el-button :text="true" @click="emit('close')">
            <Close class="w-4 h-4 text-black" />
          </el-button>
        </el-tooltip>
      </div>

    </div>

    <el-form v-model="task" label-position="top" class="pb-4 px-4 pt-2">
      <input type="text" class="mb-4 w-full min-h-min max-h-max text-2xl rounded focus:outline-0"
        v-model="task.title" placeholder="Task title" :title="task.title" />

      <el-form-item label="Deadline">
        <el-date-picker style="width: 100%;" placeholder="Click to set deadline" v-model="task.deadline" type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>

      <user-select label="Assign to" :user="task.assignee" @change="assignTo" class="w-full" />

      <TagsList :tags="task.tags" @remove="removeTag" @add="addTag" />

      <el-form-item label="Description">
        <Editor v-model="task.description" />
      </el-form-item>

      <attachments :action="url(`tasks/${task.id}/attachments`)" :attachments="task.attachments" @add="addAttachment"
        @remove="removeAttachment" />

      <followers :followers="task.followers" @add="addFollower" @remove="removeFollower" />

      <comments :endPoint="`tasks/${task.id}/comments`" />

    </el-form>
  </div>
</template>

<script lang="ts" setup>

import UserSelect from "@/components/ui/UserSelect.vue";
import { destroy, post, put, url } from "@/helpers/http";
import { onMounted, onUpdated, ref, watch, type Ref } from "vue";

import { Remove, Check, MoreFilled, Close } from '@element-plus/icons-vue'

import { debounce } from "lodash";

import Timer from './Timer.vue'
import TagsList from './TagsList.vue'
import { useRouter } from "vue-router";
import { useTasks } from "@/stores/tasks";
import Editor from '@/components/ui/editor/Editor.vue'
import { ElMessage, ElMessageBox } from "element-plus";
import Followers from "@/components/ui/Followers.vue";
import Attachments from "@/components/ui/Attachments.vue";
import Comments from "@/components/ui/Comments.vue";

const props = defineProps<{
  task: Task
}>()

const tasks = useTasks()
const router = useRouter()

const emit = defineEmits(['close'])

/**
 * This is a workaround for the task update and should be fixed when better solution is known. Task update was not triggering once the props.task was changing
 */
let unwatch = () => { }

onMounted(() => {
  unwatch()
  unwatch = watch(props.task, debounce(updateTask, 750))
})

onUpdated(() => {
  unwatch()
  unwatch = watch(props.task, debounce(updateTask, 750))
})

function updateTask() {
  put(url(`tasks/${props.task.id}`), props.task)
    .then(() => {
      ElMessage({
        message: 'Task updated successfully.',
        type: 'success',
        grouping: true,
      })
    })
    .catch(e => {
      if (e.message) {
        ElMessage({
          message: e.message,
          type: 'error'
        })
      } else {
        ElMessage({
          message: 'Task could not be updated.',
          type: 'error',
        })
      }
    })
}

function assignTo(user: User) {
  props.task.assignee = user
  props.task.assignee_id = user.id
}

const markingComplete: Ref<boolean> = ref(false)

function markComplete() {
  markingComplete.value = true
  props.task.is_complete = !props.task.is_complete
  put(url(`tasks/${props.task.id}`), props.task)
    .catch(e => {
      props.task.is_complete = !props.task.is_complete
      console.log(e)
    })
    .finally(() => markingComplete.value = false)
}

function remove() {

  ElMessageBox.confirm('Are you sure to delete this task?')
    .then(() => {
      tasks.remove(props.task.id)

      router.replace({
        query: {
          ...router.currentRoute.value.query,
          task: null,
        }
      })
    })
    .catch(() => {
      // catch error
    })
}

function addTag(tag: Tag) {
  post(url(`tasks/${props.task.id}/tags/${tag.id}`))
    .then(() => props.task.tags.push(tag))
    .catch(e => console.log(e))
}

function removeTag(tagId: number) {
  destroy(url(`tasks/${props.task.id}/tags/${tagId}`))
    .then(() => {
      const index = props.task.tags.findIndex(tag => tag.id === tagId)
      props.task.tags.splice(index, 1)
    })
}

function addAttachment(attachment: Attachment) {
  props.task.attachments.push(attachment)
}

function removeAttachment(attachmentId: number) {
  destroy(url(`tasks/${props.task.id}/attachments/${attachmentId}`))
    .then(() => {
      const index = props.task.attachments.findIndex(attachment => attachment.id === attachmentId)
      props.task.attachments.splice(index, 1)
    })
}

function addFollower(user: User) {
  post(url(`tasks/${props.task.id}/followers/${user.id}`))
    .then(() => props.task.followers.push(user))
    .catch(e => console.log(e)) 
}

function removeFollower(followerId: number) {
  destroy(url(`tasks/${props.task.id}/followers/${followerId}`))
    .then(() => {
      const index = props.task.followers.findIndex(follower => follower.id === followerId)
      props.task.followers.splice(index, 1)
    })
}
</script>