<template>
  <div class="flex items-center gap-2 group">
    <pimped-checkbox v-model="task.is_complete" theme="green" />

    <el-skeleton v-if="updatingTitle" animated>
      <template #template>
        <el-skeleton-item variant="h3" style="width: 70%" />
      </template>
    </el-skeleton>

    <input
      v-else
      :id="`taskTitleInput${task.id}`"
      v-model="task.title"
      type="text"
      class="block w-full outline-none border-0 focus:ring-0"
      placeholder="Task title"
      @keypress.enter="emit('add')"
    />

    <el-dropdown>
      <span
        class="cursor-pointer transition-opacity duration-100 opacity-0 group-hover:opacity-100"
      >
        <el-icon :size="20"><MagicStick /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-if="task.title" @click="rephrase"
            >Rephrase title</el-dropdown-item
          >
          <el-dropdown-item v-if="task.description" @click="generateTitle"
            >Generate title from description</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <span
      class="cursor-pointer transition-opacity duration-100 opacity-0 group-hover:opacity-100 pt-1"
      @click="emit('open', modelValue)"
    >
      <el-icon :size="20"><Right /></el-icon>
    </span>
  </div>
</template>

<script setup lang="ts">
import { MagicStick, Right } from "@element-plus/icons-vue";
import PimpedCheckbox from "@/components/ui/PimpedCheckbox.vue";
import { post, url } from "@/helpers/http";
import { inject, ref, type ModelRef } from "vue";

const emit = defineEmits(["add", "open"]);

const task = defineModel<Task>() as ModelRef<Task>;

const updateTask = inject<(task: Task) => void>("updateTask")!;

const updatingTitle = ref(false);

async function rephrase() {
  updatingTitle.value = true;
  try {
    const { result }: { result: string } = await post(url("llm/rephrase"), {
      text: task.value.title,
    });
    task.value.title = result;
    updateTask(task.value);
  } catch (error) {
    console.error(error);
  } finally {
    updatingTitle.value = false;
  }
}

async function generateTitle() {
  updatingTitle.value = true;
  try {
    const { result }: { result: string } = await post(
      url("llm/generate-title"),
      {
        description: task.value.description,
      },
    );
    task.value.title = result;
    updateTask(task.value);
  } catch (error) {
    console.error(error);
  } finally {
    updatingTitle.value = false;
  }
}

</script>
