type Pagination = {
  next_page_url: string,
  current_page: string,
  last_page: string,
}

type User = {
  id: number,
  name: string,
  email: string,
  email_verified_at: string
  created_at: string,
  updated_at: string,
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
  user: User,
  user_id: number
  project_id: number,
  is_complete: boolean,
  created_at: string,
  updated_at: string
}

type TaskForm = {
  title: string
  project_id: number
}