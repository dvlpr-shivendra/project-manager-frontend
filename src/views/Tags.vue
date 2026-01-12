<template>
  <div>
    <pimped-heading>Tag Management</pimped-heading>

    <pimped-button label="Add" class="mb-6" @click="openCreateDialog" />

    <!-- Tags Table -->
    <pimped-card>
      <el-table
        v-loading="loading"
        :data="tags"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column prop="name" label="Name" min-width="200">
          <template #default="{ row }">
            <el-tag
              :color="row.background_color"
              :style="{ color: row.color, borderColor: row.color }"
            >
              {{ row.name }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="Text Color" width="150">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <div
                class="w-6 h-6 rounded border"
                :style="{ backgroundColor: row.color }"
              />
              <span class="text-sm">{{ row.color }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="Background Color" width="180">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <div
                class="w-6 h-6 rounded border"
                :style="{ backgroundColor: row.background_color }"
              />
              <span class="text-sm">{{ row.background_color }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="Actions" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="openEditDialog(row)"
              link
            >
              Edit
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
              link
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </pimped-card>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? 'Edit Tag' : 'Create Tag'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        label-position="left"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter tag name" />
        </el-form-item>
        
        <el-form-item label="Text Color" prop="color">
          <div class="flex gap-2 w-full">
            <el-color-picker v-model="form.color" />
            <el-input v-model="form.color" placeholder="#000000" />
          </div>
        </el-form-item>
        
        <el-form-item label="Background Color" prop="background_color">
          <div class="flex gap-2 w-full">
            <el-color-picker v-model="form.background_color" />
            <el-input v-model="form.background_color" placeholder="#FFFFFF" />
          </div>
        </el-form-item>
        
        <el-form-item label="Preview">
          <el-tag
            :color="form.background_color"
            :style="{ color: form.color, borderColor: form.color }"
            size="large"
          >
            {{ form.name || 'Preview' }}
          </el-tag>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          :loading="saving"
          @click="handleSubmit"
        >
          {{ isEditing ? 'Update' : 'Create' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { tagService, type Tag, type TagInput } from '@/services/tagService';
import PimpedHeading from '@/components/ui/PimpedHeading.vue';
import PimpedButton from '@/components/ui/PimpedButton.vue';
import PimpedCard from '@/components/ui/PimpedCard.vue';

const tags = ref<Tag[]>([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);
const formRef = ref<FormInstance>();

const form = reactive<TagInput>({
  name: '',
  color: '#000000',
  background_color: '#FFFFFF',
});

const rules: FormRules = {
  name: [
    { required: true, message: 'Please enter tag name', trigger: 'blur' },
    { min: 1, max: 255, message: 'Length should be 1 to 255', trigger: 'blur' },
  ],
  color: [
    { required: true, message: 'Please select text color', trigger: 'blur' },
    { pattern: /^#[0-9A-Fa-f]{6}$/, message: 'Please enter valid hex color', trigger: 'blur' },
  ],
  background_color: [
    { required: true, message: 'Please select background color', trigger: 'blur' },
    { pattern: /^#[0-9A-Fa-f]{6}$/, message: 'Please enter valid hex color', trigger: 'blur' },
  ],
};

const loadTags = async () => {
  loading.value = true;
  try {
    tags.value = await tagService.getAll();
  } catch (error: any) {
    ElMessage.error(error.message || 'Failed to load tags');
  } finally {
    loading.value = false;
  }
};

const openCreateDialog = () => {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
  dialogVisible.value = true;
};

const openEditDialog = (tag: Tag) => {
  isEditing.value = true;
  editingId.value = tag.id;
  form.name = tag.name;
  form.color = tag.color;
  form.background_color = tag.background_color;
  dialogVisible.value = true;
};

const resetForm = () => {
  form.name = '';
  form.color = '#000000';
  form.background_color = '#FFFFFF';
  formRef.value?.clearValidate();
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    
    saving.value = true;
    try {
      if (isEditing.value && editingId.value) {
        await tagService.update(editingId.value, form);
        ElMessage.success('Tag updated successfully');
      } else {
        await tagService.create(form);
        ElMessage.success('Tag created successfully');
      }
      
      dialogVisible.value = false;
      await loadTags();
      resetForm();
    } catch (error: any) {
      const message = error.message || error.errors?.name?.[0] || 'Failed to save tag';
      ElMessage.error(message);
    } finally {
      saving.value = false;
    }
  });
};

const handleDelete = async (tag: Tag) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete the tag "${tag.name}"?`,
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );
    
    await tagService.delete(tag.id);
    ElMessage.success('Tag deleted successfully');
    await loadTags();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || 'Failed to delete tag');
    }
  }
};

onMounted(() => {
  loadTags();
});
</script>
