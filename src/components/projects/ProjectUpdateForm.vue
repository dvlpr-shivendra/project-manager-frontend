<template>
  <el-dialog
    v-model="dialogVisible"
    title="Update project"
    width="40%"
    :before-close="handleClose"
  >
    <el-form
      label-position="top"
      label-width="100px"
      v-model="data"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="Name">
        <el-input v-model="data.name" required />
      </el-form-item>

      <el-form-item label="Description">
        <el-input
          v-model="data.description"
          :rows="2"
          type="textarea"
          required
        />
      </el-form-item>

      <div class="flex justify-end">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" native-type="submit">Update</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, type Ref } from "vue";

const props = defineProps<{
  project: Project;
  modelValue: boolean;
}>();

const emit = defineEmits(["submit", "update:modelValue"]);

const dialogVisible = ref(props.modelValue);
const data: Ref<ProjectForm> = ref({ ...props.project });

watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val;
    if (val)
      data.value = {
        name: props.project.name,
        description: props.project.description,
      };
  },
);

watch(dialogVisible, (val) => emit("update:modelValue", val));

function handleClose() {
  dialogVisible.value = false;
}

function handleSubmit() {
  emit("submit", data.value);
  handleClose();
}
</script>
