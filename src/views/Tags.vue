<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <pimped-heading class="!mb-0">Tags</pimped-heading>
      <pimped-button label="New Tag" @click="openCreateDialog" />
    </div>
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <el-table v-loading="loading" :data="tags" style="width:100%" stripe>
        <el-table-column prop="name" label="Tag" min-width="180">
          <template #default="{ row }"><span class="inline-flex items-center px-2.5 py-1 rounded text-[12px] font-bold tracking-wide" :style="{ color: row.color, backgroundColor: row.background_color }">{{ row.name }}</span></template>
        </el-table-column>
        <el-table-column label="Text color" width="160">
          <template #default="{ row }"><div class="flex items-center gap-2"><div class="w-5 h-5 rounded border border-gray-200 dark:border-gray-700 shrink-0" :style="{ backgroundColor: row.color }"></div><span class="text-[12px] text-gray-500 dark:text-gray-400 font-mono">{{ row.color }}</span></div></template>
        </el-table-column>
        <el-table-column label="Background" width="180">
          <template #default="{ row }"><div class="flex items-center gap-2"><div class="w-5 h-5 rounded border border-gray-200 dark:border-gray-700 shrink-0" :style="{ backgroundColor: row.background_color }"></div><span class="text-[12px] text-gray-500 dark:text-gray-400 font-mono">{{ row.background_color }}</span></div></template>
        </el-table-column>
        <el-table-column label="Actions" width="140" fixed="right">
          <template #default="{ row }">
            <div class="flex items-center gap-1">
              <button @click="openEditDialog(row)" class="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors">Edit</button>
              <button @click="handleDelete(row)" class="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">Delete</button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!loading && tags.length === 0" class="flex flex-col items-center gap-3 py-16 text-gray-400 dark:text-gray-600">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <p class="text-[14px] font-medium text-gray-500 dark:text-gray-500">No tags yet. Create your first one.</p>
      </div>
    </div>
    <TagFormDialog v-model="dialogVisible" :tag="editingTag" @saved="onSaved" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { tagService } from '@/services/tagService';
import PimpedHeading from '@/components/ui/PimpedHeading.vue';
import PimpedButton from '@/components/ui/PimpedButton.vue';
import TagFormDialog from '@/components/TagFormDialog.vue';
const tags = ref<Tag[]>([]); const loading = ref(false); const dialogVisible = ref(false); const editingTag = ref<Tag | null>(null);
const loadTags = async () => { loading.value = true; try { tags.value = await tagService.getAll(); } catch (e: any) { ElMessage.error(e.message || 'Failed to load tags'); } finally { loading.value = false; } };
const openCreateDialog = () => { editingTag.value = null; dialogVisible.value = true; };
const openEditDialog = (tag: Tag) => { editingTag.value = tag; dialogVisible.value = true; };
const onSaved = (tag: Tag) => { const i = tags.value.findIndex(t => t.id === tag.id); if (i === -1) tags.value.unshift(tag); else tags.value[i] = tag; };
const handleDelete = async (tag: Tag) => { try { await ElMessageBox.confirm(`Delete tag "${tag.name}"?`,'Delete tag',{confirmButtonText:'Delete',cancelButtonText:'Cancel',type:'warning'}); await tagService.delete(tag.id); tags.value = tags.value.filter(t => t.id !== tag.id); ElMessage.success('Tag deleted'); } catch (e: any) { if (e !== 'cancel') ElMessage.error(e.message || 'Delete failed'); } };
onMounted(loadTags);
</script>
