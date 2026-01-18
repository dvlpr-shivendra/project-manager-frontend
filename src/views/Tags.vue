<template>
  <div>
    <pimped-heading>Tag Management</pimped-heading>

    <pimped-button label="Add" class="mb-6" @click="openCreateDialog" />

    <pimped-card>
      <el-table v-loading="loading" :data="tags" style="width: 100%" stripe>
        <el-table-column prop="name" label="Name" min-width="200">
          <template #default="{ row }">
            <el-tag :color="row.background_color" :style="{ color: row.color, borderColor: row.color }">
              {{ row.name }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Text Color" width="150">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded border" :style="{ backgroundColor: row.color }" />
              <span class="text-sm">{{ row.color }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Background Color" width="180">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded border" :style="{ backgroundColor: row.background_color }" />
              <span class="text-sm">{{ row.background_color }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="openEditDialog(row)" link>Edit</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)" link>Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </pimped-card>

    <TagFormDialog
      v-model="dialogVisible"
      :tag="editingTag"
      @saved="onSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { tagService } from '@/services/tagService';
import PimpedHeading from '@/components/ui/PimpedHeading.vue';
import PimpedButton from '@/components/ui/PimpedButton.vue';
import PimpedCard from '@/components/ui/PimpedCard.vue';
import TagFormDialog from '@/components/TagFormDialog.vue';

const tags = ref<Tag[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const editingTag = ref<Tag | null>(null);

const loadTags = async () => {
  loading.value = true;
  try {
    tags.value = await tagService.getAll();
  } catch (e: any) {
    ElMessage.error(e.message || 'Failed to load tags');
  } finally {
    loading.value = false;
  }
};

const openCreateDialog = () => {
  editingTag.value = null;
  dialogVisible.value = true;
};

const openEditDialog = (tag: Tag) => {
  editingTag.value = tag;
  dialogVisible.value = true;
};

const onSaved = (tag: Tag) => {
  const i = tags.value.findIndex(t => t.id === tag.id);
  if (i === -1) tags.value.unshift(tag);
  else tags.value[i] = tag;
};

const handleDelete = async (tag: Tag) => {
  try {
    await ElMessageBox.confirm(`Delete "${tag.name}"?`, 'Warning', {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    });

    await tagService.delete(tag.id);
    tags.value = tags.value.filter(t => t.id !== tag.id);
    ElMessage.success('Tag deleted');
  } catch (e: any) {
    if (e !== 'cancel') ElMessage.error(e.message || 'Delete failed');
  }
};

onMounted(loadTags);
</script>
