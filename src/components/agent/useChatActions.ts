import { ElMessage } from 'element-plus'
import { post, get, url } from '@/helpers/http'
import type { ChatIntent, Message } from './types'
import { stripNulls } from './utils'
import type { Ref } from 'vue'

import { useTasks } from '@/stores/tasks'
import { useProjects } from '@/stores/projects'

interface ChatState {
  input: Ref<string>
  loading: Ref<boolean>
  messages: Ref<Message[]>
  pushMessage: (msg: Message) => void
}

export function useChatActions(state: ChatState) {
  const { input, loading, messages, pushMessage } = state
  const tasksStore = useTasks()
  const projectsStore = useProjects()

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

    const isTask = intent.resource_type === 'task'
    const id = isTask ? intent.task_id : intent.project_id
    const store = isTask ? tasksStore : projectsStore

    try {
      switch (intent.action) {
        case 'create': {
          if (isTask) {
            await tasksStore.add(stripNulls(intent.data ?? {}) as any)
          } else {
            await projectsStore.add(stripNulls(intent.data ?? {}) as any)
          }
          pushMessage({ role: 'assistant', text: `✓ ${isTask ? 'Task' : 'Project'} created successfully.`, confirmation: null })
          break
        }

        case 'update': {
          if (!id) throw new Error(`No ${isTask ? 'task' : 'project'} ID to update.`)
          if (isTask) {
            await tasksStore.update({ id, ...stripNulls(intent.data ?? {}) } as any)
          } else {
            await projectsStore.update(id, stripNulls(intent.data ?? {}) as any)
          }
          pushMessage({ role: 'assistant', text: `✓ ${isTask ? 'Task' : 'Project'} updated successfully.`, confirmation: null })
          break
        }

        case 'delete': {
          if (!id) throw new Error(`No ${isTask ? 'task' : 'project'} ID to delete.`)
          await store.remove(id)
          pushMessage({ role: 'assistant', text: `✓ ${isTask ? 'Task' : 'Project'} deleted.`, confirmation: null })
          break
        }

        case 'list': {
          const params = new URLSearchParams()
          const f = intent.filters ?? {}
          const endpoint = isTask ? 'tasks' : 'projects'
          
          if (isTask) {
            if (f.assignee_id) params.set('assignee_id', String(f.assignee_id))
            if (f.project_id) params.set('project_id', String(f.project_id))
            if (f.is_complete !== null && f.is_complete !== undefined) params.set('is_complete', f.is_complete ? '1' : '0')
            if (f.deadline_before) params.set('deadline_before', f.deadline_before)
          } else {
            if (f.search) params.set('search', f.search)
          }

          const result = await get(url(`${endpoint}?${params.toString()}`)) as { data: any[] }
          const items = result?.data ?? result ?? []

          if (!items.length) {
            pushMessage({ role: 'assistant', text: `No ${isTask ? 'tasks' : 'projects'} found matching your criteria.`, confirmation: null })
          } else {
            const list = items
              .slice(0, 10)
              .map((item: any) => isTask 
                ? `• ${item.title}${item.deadline ? ` — due ${item.deadline}` : ''}`
                : `• ${item.name}`)
              .join('\n')
            
            pushMessage({
              role: 'assistant',
              text: `Found ${items.length} ${isTask ? 'task' : 'project'}(s):\n\n${list}${items.length > 10 ? `\n…and ${items.length - 10} more.` : ''}`,
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
