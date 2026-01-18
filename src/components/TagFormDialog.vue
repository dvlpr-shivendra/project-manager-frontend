<template>
  <el-dialog v-model="visible" :title="isEditing ? 'Edit Tag' : 'Create Tag'" width="500px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="Text Color" prop="color">
        <div class="flex gap-2 w-full">
          <el-color-picker v-model="form.color" />
          <el-input v-model="form.color" />
        </div>
      </el-form-item>

      <el-form-item label="Background Color" prop="background_color">
        <div class="flex gap-2 w-full">
          <el-color-picker v-model="form.background_color" />
          <el-input v-model="form.background_color" />
        </div>
      </el-form-item>

      <el-form-item label="Preview">
        <el-tag :color="form.background_color" :style="{ color: form.color }">
          {{ form.name || 'Preview' }}
        </el-tag>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">Cancel</el-button>
      <el-button type="primary" :loading="saving" @click="submit">
        {{ isEditing ? 'Update' : 'Create' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { tagService, type TagInput } from '@/services/tagService';

const props = defineProps<{
  modelValue: boolean;
  tag?: Tag | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'saved', tag: Tag): void;
}>();

const visible = ref(props.modelValue);
watch(() => props.modelValue, v => (visible.value = v));
watch(visible, v => emit('update:modelValue', v));

const isEditing = ref(false);
const saving = ref(false);

const formRef = ref<FormInstance>();

const form = reactive<TagInput>({
  name: '',
  color: '#000000',
  background_color: '#FFFFFF',
});

const reset = () => {
  form.name = '';
  form.color = '#000000';
  form.background_color = '#FFFFFF';
};

watch(
  () => props.tag,
  tag => {
    if (tag?.id) {
      isEditing.value = true;
      form.name = tag.name;
      form.color = tag.color;
      form.background_color = tag.background_color;
    } else {
      reset();
      form.name = tag?.name || ""
      isEditing.value = false;
    }
  },
  { immediate: true }
);

const rules: FormRules = {
  name: [{ required: true, message: 'Required', trigger: 'blur' }],
  color: [{ pattern: /^#[0-9A-Fa-f]{6}$/, message: 'Hex only', trigger: 'blur' }],
  background_color: [{ pattern: /^#[0-9A-Fa-f]{6}$/, message: 'Hex only', trigger: 'blur' }],
};

const submit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async valid => {
    if (!valid) return;

    saving.value = true;
    try {
      let result: Tag;

      if (isEditing.value && props.tag) {
        result = await tagService.update(props.tag.id, form);
        ElMessage.success('Tag updated');
      } else {
        result = await tagService.create(form);
        ElMessage.success('Tag created');
      }

      emit('saved', result);
      visible.value = false;
    } catch (e: any) {
      ElMessage.error(e.message || 'Save failed');
    } finally {
      saving.value = false;
    }
  });
};
</script>
