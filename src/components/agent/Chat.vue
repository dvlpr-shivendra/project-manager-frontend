<template>
  <div class="fixed bottom-6 right-6 z-[1000] font-['DM_Sans',_sans-serif]">
    <!-- Toggle Button -->
    <ChatToggle :is-open="isOpen" @toggle="isOpen = !isOpen" />

    <!-- Chat Panel -->
    <ChatPanel
      v-model:input="input"
      :is-open="isOpen"
      :messages="messages"
      :loading="loading"
      @send-message="sendMessage($event)"
      @execute-intent="executeIntent"
      @cancel-confirmation="cancelConfirmation"
      @set-messages-el="messagesEl = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import { useChatState } from "./useChatState";
import { useChatActions } from "./useChatActions";
import ChatToggle from "./ChatToggle.vue";
import ChatPanel from "./ChatPanel.vue";

// ─── State Management (Composable) ──────────────────────────────────────────

const state = useChatState();
const { isOpen, input, loading, messages, messagesEl, cancelConfirmation } =
  state;

// ─── Chat Actions (Composable) ──────────────────────────────────────────────

const { sendMessage, executeIntent } = useChatActions(state);
</script>
