type Pagination = {
  next_page_url: string,
  current_page: string,
  last_page: string,
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

type Tag = {
  id: number,
  title: string,
  type: 'success' | 'info' | 'warning' | 'danger',
  pivot: Pivot
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

type Task = {
  id: number,
  title: string,
  description: string,
  deadline: string,
  tags: Tag[],
  assignee: User,
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