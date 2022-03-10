<template>
  <el-tooltip
    class="box-item"
    effect="dark"
    :content="isTimerRunning ? 'Stop timer' : 'Start timer'"
    placement="bottom"
  >
    <el-button
      @click="toggleTimer"
      :type="isTimerRunning ? 'danger' : 'success'"
      :icon="Clock"
      circle
    ></el-button>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { Clock } from '@element-plus/icons-vue'
import { postMultipart, url } from '@/helpers/http';

const props = defineProps<{
  task: Task
}>()

const isTimerRunning: Ref<boolean> = ref(false)

function toggleTimer() {
  isTimerRunning.value = !isTimerRunning.value

  isTimerRunning.value ? startCapture() : stopCapture()
}

const videoElement: HTMLVideoElement = document.createElement("video");
const canvas: HTMLCanvasElement = document.createElement('canvas');

let screenshotTimer: number;

const width = 1280;
const height = 720;

function stopCapture() {
  let mediaProvider: MediaStream | null = videoElement.srcObject as MediaStream;

  mediaProvider.getTracks().forEach(track => track.stop());

  videoElement.pause();
  videoElement.srcObject = null;

  clearInterval(screenshotTimer);
}

async function startCapture() {
  try {
    navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    }).then(function (stream) {
      videoElement.srcObject = stream;
    });
    videoElement.play();
  } catch (err) {
    console.error("Error: " + err);
  }
}

function savePictureFromVideoElement() {
  let context = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  context?.drawImage(videoElement, 0, 0, width, height);
  canvas.toBlob(function (blob) {
    uploadScreenshot(blob as Blob);
  });
}

function uploadScreenshot(screenshotBlob: Blob) {
  const formData = new FormData();
  formData.append('screenshot', screenshotBlob, 'screenshot.png');
  formData.append('task_id', props.task.id.toString());
  postMultipart(url('screenshots'), formData)
}

videoElement.onplay = function () {
  screenshotTimer = setInterval(function () {
    savePictureFromVideoElement();
  }, 1000 * 60 * 2);
}
</script>