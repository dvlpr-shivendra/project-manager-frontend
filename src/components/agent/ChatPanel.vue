<template>
  <transition
    enter-active-class="transition duration-200"
    enter-from-class="translate-y-3 scale-[0.97] opacity-0"
    enter-to-class="translate-y-0 scale-100 opacity-100"
    leave-active-class="transition duration-200"
    leave-from-class="translate-y-0 scale-100 opacity-100"
    leave-to-class="translate-y-3 scale-[0.97] opacity-0"
  >
    <div
      v-if="isOpen"
      class="absolute bottom-[64px] right-0 flex flex-col overflow-hidden rounded-[16px] border border-[var(--el-border-color-light)] bg-[var(--el-bg-color)] shadow-[0_12px_48px_rgba(0,0,0,0.14)] select-none"
      :style="{ width: width + 'px', height: height + 'px' }"
    >
      <!-- Resize Handle (Top Left) -->
      <div 
        class="absolute left-0 top-0 h-4 w-4 cursor-nw-resize z-[1001] transition-colors hover:bg-[var(--el-color-primary-light-8)]"
        @mousedown="startResize"
      >
        <div class="absolute left-[3px] top-[3px] w-[6px] h-[6px] border-l-2 border-t-2 border-[var(--el-border-color)] rounded-tl-[1px]" />
      </div>

      <div
        class="flex items-baseline gap-2.5 border-b border-[var(--el-border-color-lighter)] px-5 py-4 shrink-0"
      >
        <span
          class="text-[15px] font-semibold text-[var(--el-text-color-primary)]"
        >
          Task Assistant
        </span>
      </div>

      <!-- Messages -->
      <div
        class="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4 scroll-smooth"
        :ref="setMessagesEl"
      >
        <ChatSuggestions
          v-if="messages.length === 0"
          @select="$emit('send-message', $event)"
        />

        <template v-for="(msg, i) in messages" :key="i">
          <ChatMessage :message="msg">
            <template #confirmation v-if="msg.confirmation">
              <ChatConfirmation
                :message="msg.confirmation.message"
                @confirm="$emit('execute-intent', msg.confirmation.intent, i)"
                @cancel="$emit('cancel-confirmation', i)"
              />
            </template>
          </ChatMessage>
        </template>

        <!-- Loading Indicator -->
        <div v-if="loading" class="flex flex-col items-start">
          <div
            class="flex items-start gap-[7px] rounded-[14px] rounded-bl-[4px] bg-[var(--el-fill-color-light)] px-3.5 py-[9px] text-[13.5px] leading-[1.55]"
          >
            <span class="mt-0.5 shrink-0 text-[12px] text-[var(--el-color-primary)]">
              ✦
            </span>
            <span class="mt-2 flex items-center gap-1">
              <span class="dot h-1.5 w-1.5 rounded-full bg-[var(--el-text-color-placeholder)]" />
              <span class="dot h-1.5 w-1.5 rounded-full bg-[var(--el-text-color-placeholder)]" />
              <span class="dot h-1.5 w-1.5 rounded-full bg-[var(--el-text-color-placeholder)]" />
            </span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <ChatInput
        :model-value="input"
        :loading="loading"
        @update:model-value="$emit('update:input', $event)"
        @send="$emit('send-message')"
        class="shrink-0"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { Message, ChatIntent } from "./types";
import ChatSuggestions from "./ChatSuggestions.vue";
import ChatMessage from "./ChatMessage.vue";
import ChatConfirmation from "./ChatConfirmation.vue";
import ChatInput from "./ChatInput.vue";

const props = defineProps<{
  isOpen: boolean;
  messages: Message[];
  loading: boolean;
  input: string;
  width: number;
  height: number;
}>();

const emit = defineEmits<{
  (e: "update:input", value: string): void;
  (e: "update:width", value: number): void;
  (e: "update:height", value: number): void;
  (e: "send-message", text?: string): void;
  (e: "execute-intent", intent: ChatIntent, index: number): void;
  (e: "cancel-confirmation", index: number): void;
  (e: "set-messages-el", el: any): void;
}>();

function setMessagesEl(el: any) {
  emit("set-messages-el", el);
}

function startResize(e: MouseEvent) {
  const startX = e.clientX;
  const startY = e.clientY;
  const startWidth = props.width;
  const startHeight = props.height;

  function onMouseMove(moveE: MouseEvent) {
    const deltaX = startX - moveE.clientX;
    const deltaY = startY - moveE.clientY;
    
    let newWidth = startWidth + deltaX;
    let newHeight = startHeight + deltaY;

    // Limits
    newWidth = Math.max(320, Math.min(600, newWidth));
    newHeight = Math.max(400, Math.min(800, newHeight));

    emit('update:width', newWidth);
    emit('update:height', newHeight);
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.body.style.cursor = '';
  }

  document.body.style.cursor = 'nw-resize';
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}
</script>

<style scoped>
.dot {
  animation: bounce 1.2s infinite;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
}
</style>
