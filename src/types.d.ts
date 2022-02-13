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

type Task = {
  id: number,
  title: string,
  description: string,
  deadline: string,
  tags: string[],
  user: User,
  project_id: number,
  created_at: string,
  updated_at: string
}