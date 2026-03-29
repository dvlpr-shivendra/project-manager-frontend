export interface TaskData {
  title?: string | null
  description?: string | null
  assignee_id?: number | null
  project_id?: number | null
  deadline?: string | null
  time_estimate?: number | null
  is_complete?: boolean | null
}

export interface TaskFilters {
  assignee_id?: number | null
  project_id?: number | null
  is_complete?: boolean | null
  deadline_before?: string | null
}

export interface ChatIntent {
  action: 'create' | 'update' | 'delete' | 'list' | 'clarify'
  task_id?: number | null
  data?: TaskData
  filters?: TaskFilters
  confirmation_message: string
  question?: string | null
}

export interface Message {
  role: 'user' | 'assistant'
  text: string
  confirmation?: {
    message: string
    intent: ChatIntent
  } | null
}
