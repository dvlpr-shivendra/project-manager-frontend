type Pagination = {
  next_page_url: string,
  current_page: number,
  last_page: number,
  total: number
}

type User = {
  id: number,
  name: string,
  email: string,
}

type UserWithToken = {
  user: User,
  token: string
}

type Pivot = {
  taggable_id: number,
  tag_id: number,
  taggable_type: string
}

type NewTag = {
  name: string
  color: string
  background_color: string
}

type Tag = {
  id: number,
  name: string,
  color: string,
  background_color: string,
}

type Project = {
  id: number,
  name: string,
  description: string,
  user_id: number,
  created_at: string,
  updated_at: string
}

type ProjectForm = {
  name: string,
  description: string,
}

type Attachment = {
  id: number,
  task_id?: number,
  name: string,
  path: string,
  size: number,
  created_at: string,
  updated_at: string,
}

type Task = {
  id: number,
  title: string,
  description: string,
  deadline: string,
  tags: Tag[],
  attachments: TaskAttachment[],
  followers: User[],
  assignee: User,
  project?: Project,
  assignee_id: number
  project_id: number,
  is_complete: boolean,
  created_at: string,
  updated_at: string
}

type TaskForm = {
  title: string
  project_id: number
}

type ApiExceptionPayload = {
  message: string,
  errors: {
      [key: string]: string | [string]
  },
}