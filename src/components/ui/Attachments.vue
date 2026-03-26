<template>
  <button @click="openDrawer = true" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 hover:border-indigo-300 dark:hover:border-indigo-800 text-gray-600 dark:text-gray-400 text-[13px] font-medium transition-all cursor-pointer">
    <UploadFilled style="width:14px;height:14px;" class="text-gray-400 shrink-0" />
    <span v-if="attachments.length === 0">Upload attachments</span>
    <span v-else>{{ attachments.length }} {{ pluralize('attachment', attachments.length) }}</span>
  </button>
  <el-drawer v-model="openDrawer" direction="rtl" :with-header="false" size="420px">
    <div class="flex flex-col h-full p-5 gap-5">
      <h2 class="font-['Syne'] font-bold text-xl text-gray-900 dark:text-white">Attachments</h2>
      <el-upload name="file" :headers="headers" drag :action="action" :show-file-list="false" :on-success="handleSuccess" v-on:progress="handleProgress" :before-upload="handleBeforeUpload">
        <div class="flex flex-col items-center gap-2 py-4">
          <UploadFilled style="width:32px;height:32px;" class="text-gray-400" />
          <p class="text-[13px] text-gray-500 dark:text-gray-400">Drop files here or <span class="text-indigo-600 dark:text-indigo-400 font-medium">click to upload</span></p>
        </div>
      </el-upload>
      <el-progress v-if="uploading" :percentage="uploadedPercent" class="mt-1" />
      <div class="flex flex-col gap-1.5 flex-1 overflow-y-auto">
        <TransitionGroup name="list">
          <div v-for="attachment in attachments" :key="attachment.id" class="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="text-indigo-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <a :href="url(`tasks/${taskId}/attachments/${attachment.id}/download`)" target="_blank" class="text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 truncate no-underline transition-colors">{{ attachment.name }}</a>
            </div>
            <button @click="handleDelete(attachment)" :disabled="!!deletingWithIds[attachment.id]" class="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
              <Delete style="width:13px;height:13px;" />
            </button>
          </div>
        </TransitionGroup>
        <div v-if="attachments.length === 0 && !uploading" class="flex flex-col items-center gap-2 py-8 text-gray-400 dark:text-gray-600 text-[13px]">No attachments yet</div>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { getToken } from '@/helpers/auth';
import { ElMessageBox } from 'element-plus';
import { Delete, UploadFilled } from '@element-plus/icons-vue';
import { pluralize } from '@/helpers/string';
import { url } from '@/helpers/http';
defineProps<{ action: string; taskId: number; attachments: Attachment[] }>();
const emit = defineEmits(['remove', 'add']);
const deletingWithIds = ref<{ [key: string]: boolean }>({});
const uploading = ref(false);
const uploadedPercent = ref(0);
const openDrawer = ref(false);
const headers = new Headers();
headers.append('Accept', 'application/json');
headers.append('Authorization', 'Bearer ' + getToken());
function handleBeforeUpload() { uploading.value = true; }
function handleSuccess(response: any) { uploading.value = false; uploadedPercent.value = 0; emit('add', response); }
function handleProgress(event: any) { uploadedPercent.value = Math.floor(event.percent); }
function handleDelete(attachment: Attachment) { ElMessageBox.confirm('Delete this attachment?', 'Delete attachment', { confirmButtonText: 'Delete', cancelButtonText: 'Cancel', type: 'warning' }).then(() => { deletingWithIds.value[attachment.id] = true; emit('remove', attachment.id); }).catch(() => {}); }
</script>
