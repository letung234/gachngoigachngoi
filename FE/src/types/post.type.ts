export type PostStatus = 'draft' | 'published' | 'archived'

export interface Post {
  _id: string
  title: string
  slug?: string
  content: string
  thumbnail?: string
  category: {
    _id: string
    name: string
  }
  author?: {
    _id: string
    name: string
    email: string
  }
  status: PostStatus
  views?: number
  createdAt: string
  updatedAt: string
}

export interface PostList {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    page_size: number
    total?: number
  }
}

export interface PostListConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'views'
  order?: 'asc' | 'desc'
  status?: PostStatus
  category?: string
  search?: string
}
