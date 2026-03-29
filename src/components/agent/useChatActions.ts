import { ElMessage } from 'element-plus'
import { post, get, destroy, put, url } from '@/helpers/http'
import type { ChatIntent, Message } from './types'
import { stripNulls } from './utils'
import type { Ref } from 'vue'

interface ChatState {
  input: Ref<string>
  loading: Ref<boolean>
  messages: Ref<Message[]>
  pushMessage: (msg: Message) => void
}

export function useChatActions(state: ChatState) {
  const { input, loading, messages, pushMessage } = state

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

  return {
    sendMessage,
    executeIntent
  }
}
