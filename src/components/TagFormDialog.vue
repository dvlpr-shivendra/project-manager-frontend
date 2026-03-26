<template>
  <el-dialog v-model="visible" :title="isEditing ? 'Edit Tag' : 'Create Tag'" width="460px" align-center>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item label="Tag name" prop="name">
        <el-input v-model="form.name" placeholder="e.g. Bug, Feature, Urgent" />
      </el-form-item>
      <div class="grid grid-cols-2 gap-4">
        <el-form-item label="Text color" prop="color">
          <div class="flex items-center gap-2 w-full"><el-color-picker v-model="form.color" /><el-input v-model="form.color" placeholder="#ffffff" class="flex-1" /></div>
        </el-form-item>
        <el-form-item label="Background color" prop="background_color">
          <div class="flex items-center gap-2 w-full"><el-color-picker v-model="form.background_color" /><el-input v-model="form.background_color" placeholder="#6366f1" class="flex-1" /></div>
        </el-form-item>
      </div>
      <el-form-item label="Preview">
        <div class="flex items-center px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full">
          <span class="px-2.5 py-1 rounded text-[12px] font-bold tracking-wide" :style="{ color: form.color, backgroundColor: form.background_color }">{{ form.name || 'Preview' }}</span>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" @click="submit">{{ isEditing ? 'Save changes' : 'Create tag' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { tagService, type TagInput } from '@/services/tagService';
const props = defineProps<{ modelValue: boolean; tag?: Tag | null }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'saved', tag: Tag): void }>();
const visible = ref(props.modelValue);
watch(() => props.modelValue, v => (visible.value = v));
watch(visible, v => emit('update:modelValue', v));
const isEditing = ref(false); const saving = ref(false); const formRef = ref<FormInstance>();
const form = reactive<TagInput>({ name: '', color: '#ffffff', background_color: '#6366f1' });
const reset = () => { form.name = ''; form.color = '#ffffff'; form.background_color = '#6366f1'; };
watch(() => props.tag, tag => { if (tag?.id) { isEditing.value = true; form.name = tag.name; form.color = tag.color; form.background_color = tag.background_color; } else { reset(); form.name = tag?.name || ''; isEditing.value = false; } }, { immediate: true });
const rules: FormRules = { name: [{ required: true, message: 'Required', trigger: 'blur' }], color: [{ pattern: /^#[0-9A-Fa-f]{6}$/, message: 'Use hex e.g. #ff0000', trigger: 'blur' }], background_color: [{ pattern: /^#[0-9A-Fa-f]{6}$/, message: 'Use hex e.g. #6366f1', trigger: 'blur' }] };
const submit = async () => { if (!formRef.value) return; await formRef.value.validate(async valid => { if (!valid) return; saving.value = true; try { let result: Tag; if (isEditing.value && props.tag) { result = await tagService.update(props.tag.id, form); ElMessage.success('Tag updated'); } else { result = await tagService.create(form); ElMessage.success('Tag created'); } emit('saved', result); visible.value = false; } catch (e: any) { ElMessage.error(e.message || 'Save failed'); } finally { saving.value = false; } }); };
</script>
