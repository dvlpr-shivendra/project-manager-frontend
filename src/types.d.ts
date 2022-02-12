type Pagination = {
  next_page_url: string,
  current_page: string,
  last_page: string,
}

type Project = {
  id: number,
  name: string,
  description: string,
  user_id: number,
  created_at: string,
  updated_at: string
}