import { ref, nextTick } from 'vue'
import type { Message } from './types'

export function useChatState() {
  const isOpen = ref(false)
  const input = ref('')
  const loading = ref(false)
  const messages = ref<Message[]>([])
  const messagesEl = ref<HTMLElement | null>(null)

  function scrollToBottom() {
    nextTick(() => {
      if (messagesEl.value) {
        messagesEl.value.scrollTop = messagesEl.value.scrollHeight
      }
    })
  }

  function pushMessage(msg: Message) {
    messages.value.push(msg)
    scrollToBottom()
  }

  function cancelConfirmation(index: number) {
    messages.value[index].confirmation = null
    pushMessage({ role: 'assistant', text: 'Action cancelled.', confirmation: null })
  }

  return {
    isOpen,
    input,
    loading,
    messages,
    messagesEl,
    scrollToBottom,
    pushMessage,
    cancelConfirmation
  }
}
