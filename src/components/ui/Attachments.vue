<template>

  <div>
    <el-button type="text" link @click="openDrawer = true">
      <span v-if="attachments.length === 0">Upload attachments</span>
      <span v-else>{{ attachments.length }} {{ pluralize('attachment', attachments.length) }}</span>
    </el-button>
  </div>

  <el-drawer v-model="openDrawer" direction="rtl" :with-header="false" size="40%">
    <el-upload name="file" :headers="headers" drag :action="action" :show-file-list="false" :on-success="handleSuccess"
      v-on:progress="handleProgress" :before-upload="handleBeforeUpload">
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        Drop files here or <em>click to upload</em>
      </div>
    </el-upload>

    <el-progress v-if="uploading" :percentage="uploadedPercent" />

    <div class="my-4">
      <TransitionGroup name="list">
        <div v-for="attachment in attachments" class=" bg-slate-200 p-2 mb-1 flex justify-between rounded"
          :key="attachment.id">
          <a class="inline-block mr-2" href="#" target="_blank">{{ attachment.name }}</a>
          <el-button type="danger" :icon="Delete" circle size="small" @click="handleDelete(attachment)"
            :loading="!!deletingWithIds[attachment.id]" />
        </div>
      </TransitionGroup>
    </div>
  </el-drawer>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getToken } from '@/helpers/auth';
import { ElMessageBox } from 'element-plus';
import { Delete, UploadFilled } from '@element-plus/icons-vue'
import { pluralize } from '@/helpers/string';

defineProps<{
  action: string,
  attachments: Attachment[]
}>()

const deletingWithIds = ref<{ [key: string]: boolean }>({})
const uploading = ref<boolean>(false)
const uploadedPercent = ref<number>(0)

const emit = defineEmits(['remove', 'add'])

const openDrawer = ref(false)

const headers = new Headers()

headers.append('Accept', 'application/json')
headers.append('Authorization', 'Bearer ' + getToken())

function handleBeforeUpload() {
  uploading.value = true
}

function handleDelete(attachment: Attachment) {
  ElMessageBox.confirm('Are you sure to delete this attachment?')
    .then(() => {
      deletingWithIds.value[attachment.id] = true;
      emit('remove', attachment.id)
    })
    .catch(() => { })
}

function handleSuccess(response: any) {
  uploading.value = false
  uploadedPercent.value = 0
  emit('add', response)
}

function handleProgress(event: any) {
  uploadedPercent.value = Math.floor(event.percent)
}

</script>

<style>
.el-upload {
  width: 100%;
}

.el-upload-dragger {
  width: 100%;
}
</style>