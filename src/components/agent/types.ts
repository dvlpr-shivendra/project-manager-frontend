export interface ResourceData {
  title?: string | null
  name?: string | null
  description?: string | null
  assignee_id?: number | null
  project_id?: number | null
  deadline?: string | null
  time_estimate?: number | null
  is_complete?: boolean | null
  tags?: string[] | null
  add_tags?: string[] | null
  remove_tags?: string[] | null
}

export interface ResourceFilters {
  assignee_id?: number | null
  project_id?: number | null
  is_complete?: boolean | null
  deadline_before?: string | null
  search?: string | null
}

export interface ChatIntent {
  action: 'create' | 'update' | 'delete' | 'list' | 'clarify'
  resource_type: 'task' | 'project'
  task_id?: number | null
  project_id?: number | null
  data?: ResourceData
  filters?: ResourceFilters
  confirmation_message: string
  question?: string | null
  conversation_id?: string | null
}

export interface Message {
  role: 'user' | 'assistant'
  text: string
  confirmation?: {
    message: string
    intent: ChatIntent
  } | null
}
