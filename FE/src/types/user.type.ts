export type Role = 'User' | 'Admin' | 'Editor' | 'SuperAdmin'
export type UserStatus = 'active' | 'disabled' | 'pending'

export interface User {
  _id: string
  roles: Role[]
  email: string
  name?: string
  date_of_birth?: string // ISO 8610
  avatar?: string
  address?: string
  phone?: string
  status?: UserStatus
  createdAt: string
  updatedAt: string
}

export interface UserList {
  users: User[]
  pagination: {
    page: number
    limit: number
    page_size: number
    total?: number
  }
}

export interface UserListConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'email' | 'name'
  order?: 'asc' | 'desc'
  role?: Role
  status?: UserStatus
  search?: string
}
