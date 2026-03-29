<template>
  <div class="chat-container">
    <!-- Toggle Button -->
    <button class="chat-toggle" @click="isOpen = !isOpen" :class="{ open: isOpen }">
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>

    <!-- Chat Panel -->
    <transition name="chat-slide">
      <div v-if="isOpen" class="chat-panel">
        <div class="chat-header">
          <span class="chat-header-title">Task Assistant</span>
        </div>

        <!-- Messages -->
        <div class="chat-messages" ref="messagesEl">
          <div v-if="messages.length === 0" class="chat-empty">
            <p>Ask me to manage your tasks.</p>
            <div class="chat-suggestions">
              <button
                v-for="s in suggestions"
                :key="s"
                class="suggestion-chip"
                @click="sendMessage(s)"
              >{{ s }}</button>
            </div>
          </div>

          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="chat-message"
            :class="msg.role"
          >
            <div class="message-bubble">
              <span v-if="msg.role === 'assistant'" class="message-icon">✦</span>
              {{ msg.text }}
            </div>

            <!-- Confirmation Card -->
            <div v-if="msg.confirmation" class="confirmation-card">
              <p class="confirmation-label">Confirm action</p>
              <p class="confirmation-text">{{ msg.confirmation.message }}</p>
              <div class="confirmation-actions">
                <el-button size="small" type="primary" @click="executeIntent(msg.confirmation.intent, i)">
                  Confirm
                </el-button>
                <el-button size="small" @click="cancelConfirmation(i)">Cancel</el-button>
              </div>
            </div>
          </div>

          <div v-if="loading" class="chat-message assistant">
            <div class="message-bubble">
              <span class="message-icon">✦</span>
              <span class="typing-dots"><span/><span/><span/></span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-input-area">
          <el-input
            v-model="input"
            placeholder="e.g. Create a task to review the API docs..."
            @keydown.enter.prevent="sendMessage()"
            :disabled="loading"
            size="large"
          >
            <template #append>
              <el-button :disabled="loading || !input.trim()" @click="sendMessage()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { post, get, destroy, put, url } from '@/helpers/http' // adjust path as needed

// ─── Types ───────────────────────────────────────────────────────────────────

interface TaskData {
  title?: string | null
  description?: string | null
  assignee_id?: number | null
  project_id?: number | null
  deadline?: string | null
  time_estimate?: number | null
  is_complete?: boolean | null
}

interface TaskFilters {
  assignee_id?: number | null
  project_id?: number | null
  is_complete?: boolean | null
  deadline_before?: string | null
}

interface ChatIntent {
  action: 'create' | 'update' | 'delete' | 'list' | 'clarify'
  task_id?: number | null
  data?: TaskData
  filters?: TaskFilters
  confirmation_message: string
  question?: string | null
}

interface Message {
  role: 'user' | 'assistant'
  text: string
  confirmation?: {
    message: string
    intent: ChatIntent
  } | null
}

// ─── State ───────────────────────────────────────────────────────────────────

const isOpen   = ref(false)
const input    = ref('')
const loading  = ref(false)
const messages = ref<Message[]>([])
const messagesEl = ref<HTMLElement | null>(null)

const suggestions = [
  'Create a task to review the API docs',
  'Show my open tasks',
  'Mark task 12 as complete',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Send to /chat ────────────────────────────────────────────────────────────

async function sendMessage(text?: string) {
  const message = text ?? input.value.trim()
  if (!message || loading.value) return

  input.value = ''
  pushMessage({ role: 'user', text: message, confirmation: null })
  loading.value = true

  try {
    const intent = await post(url('chat'), { message }) as ChatIntent

    if (intent.action === 'clarify') {
      pushMessage({
        role: 'assistant',
        text: intent.question ?? 'Could you clarify?',
        confirmation: null,
      })
      return
    }

    // Show confirmation before executing
    pushMessage({
      role: 'assistant',
      text: intent.confirmation_message,
      confirmation: {
        message: intent.confirmation_message,
        intent,
      },
    })
  } catch (err: any) {
    const msg = err?.message ?? 'Something went wrong. Please try again.'
    pushMessage({ role: 'assistant', text: msg, confirmation: null })
  } finally {
    loading.value = false
  }
}

// ─── Execute confirmed intent ─────────────────────────────────────────────────

async function executeIntent(intent: ChatIntent, msgIndex: number) {
  // Remove confirmation card immediately
  messages.value[msgIndex].confirmation = null
  loading.value = true

  try {
    switch (intent.action) {
      case 'create': {
        await post(url('tasks'), stripNulls(intent.data ?? {}))
        pushMessage({ role: 'assistant', text: '✓ Task created successfully.', confirmation: null })
        break
      }

      case 'update': {
        if (!intent.task_id) throw new Error('No task ID to update.')
        await put(url(`tasks/${intent.task_id}`), stripNulls(intent.data ?? {}))
        pushMessage({ role: 'assistant', text: '✓ Task updated successfully.', confirmation: null })
        break
      }

      case 'delete': {
        if (!intent.task_id) throw new Error('No task ID to delete.')
        await destroy(url(`tasks/${intent.task_id}`))
        pushMessage({ role: 'assistant', text: '✓ Task deleted.', confirmation: null })
        break
      }

      case 'list': {
        const params = new URLSearchParams()
        const f = intent.filters ?? {}
        if (f.assignee_id)    params.set('assignee_id',    String(f.assignee_id))
        if (f.project_id)     params.set('project_id',     String(f.project_id))
        if (f.is_complete !== null && f.is_complete !== undefined) params.set('is_complete', f.is_complete ? '1' : '0')
        if (f.deadline_before) params.set('deadline_before', f.deadline_before)

        const result = await get(url(`tasks?${params.toString()}`)) as { data: any[] }
        const tasks = result?.data ?? result ?? []

        if (!tasks.length) {
          pushMessage({ role: 'assistant', text: 'No tasks found matching your criteria.', confirmation: null })
        } else {
          const list = tasks
            .slice(0, 10)
            .map((t: any) => `• ${t.title}${t.deadline ? ` — due ${t.deadline}` : ''}`)
            .join('\n')
          pushMessage({
            role: 'assistant',
            text: `Found ${tasks.length} task(s):\n\n${list}${tasks.length > 10 ? `\n…and ${tasks.length - 10} more.` : ''}`,
            confirmation: null,
          })
        }
        break
      }
    }
  } catch (err: any) {
    const msg = err?.message ?? 'Action failed. Please try again.'
    ElMessage.error(msg)
    pushMessage({ role: 'assistant', text: `✗ ${msg}`, confirmation: null })
  } finally {
    loading.value = false
  }
}

// Strip null/undefined values before sending to API
function stripNulls(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined))
}
</script>

<style scoped>
/* ── Layout ── */
.chat-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  font-family: 'DM Sans', sans-serif;
}

.chat-toggle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--el-color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.18);
  transition: transform 0.2s, box-shadow 0.2s;
  margin-left: auto;
}
.chat-toggle:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(0,0,0,0.22); }
.chat-toggle svg { width: 22px; height: 22px; }

/* ── Panel ── */
.chat-panel {
  position: absolute;
  bottom: 64px;
  right: 0;
  width: 380px;
  max-height: 560px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0,0,0,0.14);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Header ── */
.chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.chat-header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.chat-header-sub {
  font-size: 11px;
  color: var(--el-text-color-placeholder);
}

/* ── Messages ── */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
}

.chat-empty {
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  padding: 24px 0;
}
.chat-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-top: 12px;
}
.suggestion-chip {
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-light);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition: background 0.15s;
}
.suggestion-chip:hover { background: var(--el-fill-color); }

/* ── Bubbles ── */
.chat-message { display: flex; flex-direction: column; }
.chat-message.user { align-items: flex-end; }
.chat-message.assistant { align-items: flex-start; }

.message-bubble {
  max-width: 85%;
  padding: 9px 14px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
}
.chat-message.user .message-bubble {
  background: var(--el-color-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.chat-message.assistant .message-bubble {
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  border-bottom-left-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 7px;
}
.message-icon {
  color: var(--el-color-primary);
  font-size: 12px;
  margin-top: 2px;
  flex-shrink: 0;
}

/* ── Confirmation card ── */
.confirmation-card {
  margin-top: 6px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  padding: 12px 14px;
  max-width: 85%;
}
.confirmation-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--el-text-color-placeholder);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 4px;
}
.confirmation-text {
  font-size: 13px;
  color: var(--el-text-color-regular);
  margin: 0 0 10px;
}
.confirmation-actions { display: flex; gap: 8px; }

/* ── Typing dots ── */
.typing-dots { display: flex; gap: 4px; align-items: center; margin-top: 8px; }
.typing-dots span {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--el-text-color-placeholder);
  animation: bounce 1.2s infinite;
}
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
}

/* ── Input ── */
.chat-input-area {
  padding: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* ── Transition ── */
.chat-slide-enter-active, .chat-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.chat-slide-enter-from, .chat-slide-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
</style>