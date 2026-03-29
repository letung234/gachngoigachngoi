export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  order?: number
  createdAt?: string
  updatedAt?: string
}

export interface CategoryList {
  categories: Category[]
  pagination: {
    page: number
    limit: number
    page_size: number
    total?: number
  }
}

export interface CategoryListConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'name' | 'order'
  order?: 'asc' | 'desc'
  search?: string
}
