import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { Purchase } from 'src/types/purchase.type'
import { User, UserList, UserListConfig } from 'src/types/user.type'
import { Category } from 'src/types/category.type'
import { Post, PostList, PostListConfig } from 'src/types/post.type'
import { Order, OrderList, OrderListConfig } from 'src/types/order.type'
import { SiteConfig } from 'src/types/config.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const ADMIN_URL = 'admin'

// Stats interfaces
export interface OverviewStats {
  totalRevenue: number
  todayOrders: number
  newCustomers: number
  conversionRate: number
  revenueChange: string
  ordersChange: string
  customersChange: string
  conversionChange: string
}

export interface RevenueStats {
  monthly: {
    month: string
    revenue: number
  }[]
}

export interface TopProduct {
  _id: string
  name: string
  sales: number
  revenue: number
}

export interface LatestOrder {
  _id: string
  customer: string
  amount: number
  status: number
  createdAt: string
}

// Purchase list params
export interface AdminPurchaseParams {
  page?: number
  limit?: number
  status?: number
}

// Product specs interface
export interface ProductSpecs {
  size?: string
  thickness?: string
  weight?: string
  material?: string
  color?: string
  waterAbsorption?: string
  bendingStrength?: string
  compressiveStrength?: string
  technique?: string
  origin?: string
}

// Product review interface
export interface ProductReview {
  _id?: string
  avatar?: string
  name: string
  content: string
  rating?: number
  createdAt?: string
}

// Product create/update body
export interface ProductBody {
  name: string
  description: string
  category: string
  price: number
  price_before_discount: number
  quantity: number
  sold?: number
  view?: number
  featured?: boolean
  image?: string
  images?: string[]
  specs?: ProductSpecs
  reviews?: ProductReview[]
}

const adminApi = {
  // ========== STATS APIs ==========
  getOverviewStats() {
    return http.get<SuccessResponse<OverviewStats>>(`${ADMIN_URL}/stats/overview`)
  },

  getRevenueStats() {
    return http.get<SuccessResponse<RevenueStats>>(`${ADMIN_URL}/stats/revenue`)
  },

  getTopProducts(limit?: number) {
    return http.get<SuccessResponse<TopProduct[]>>(`${ADMIN_URL}/stats/top-products`, {
      params: { limit }
    })
  },

  getLatestOrders(limit?: number) {
    return http.get<SuccessResponse<LatestOrder[]>>(`${ADMIN_URL}/stats/latest-orders`, {
      params: { limit }
    })
  },

  // ========== PRODUCT APIs ==========
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(`${ADMIN_URL}/products`, {
      params
    })
  },

  getAllProducts() {
    return http.get<SuccessResponse<Product[]>>(`${ADMIN_URL}/products/all`)
  },

  getProduct(id: string) {
    return http.get<SuccessResponse<Product>>(`${ADMIN_URL}/products/${id}`)
  },

  addProduct(body: ProductBody) {
    return http.post<SuccessResponse<Product>>(`${ADMIN_URL}/products`, body)
  },

  updateProduct(id: string, body: ProductBody) {
    return http.put<SuccessResponse<Product>>(`${ADMIN_URL}/products/${id}`, body)
  },

  deleteProduct(id: string) {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(`${ADMIN_URL}/products/delete/${id}`)
  },

  deleteManyProducts(ids: string[]) {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(`${ADMIN_URL}/products/delete-many`, {
      params: { list_id: ids }
    })
  },

  uploadProductImage(body: FormData) {
    return http.post<SuccessResponse<string>>(`${ADMIN_URL}/products/upload-image`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  uploadManyProductImages(body: FormData) {
    return http.post<SuccessResponse<string[]>>(`${ADMIN_URL}/products/upload-images`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // ========== PURCHASE/ORDER APIs ==========
  getPurchases(params: AdminPurchaseParams) {
    return http.get<SuccessResponse<Purchase[]>>(`${ADMIN_URL}/purchases`, {
      params
    })
  },

  getPurchaseDetail(id: string) {
    return http.get<SuccessResponse<Purchase>>(`${ADMIN_URL}/purchases/${id}`)
  },

  updatePurchaseStatus(id: string, status: number) {
    return http.put<SuccessResponse<Purchase>>(`${ADMIN_URL}/purchases/${id}`, {
      status
    })
  },

  // ========== CATEGORY APIs ==========
  getCategories() {
    return http.get<SuccessResponse<Category[]>>(`${ADMIN_URL}/categories`)
  },

  getCategory(id: string) {
    return http.get<SuccessResponse<Category>>(`${ADMIN_URL}/categories/${id}`)
  },

  addCategory(body: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>) {
    return http.post<SuccessResponse<Category>>(`${ADMIN_URL}/categories`, body)
  },

  updateCategory(id: string, body: Partial<Category>) {
    return http.put<SuccessResponse<Category>>(`${ADMIN_URL}/categories/${id}`, body)
  },

  deleteCategory(id: string) {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(`${ADMIN_URL}/categories/${id}`)
  },

  // ========== POST/BLOG APIs ==========
  getPosts(params?: PostListConfig) {
    return http.get<SuccessResponse<PostList>>(`${ADMIN_URL}/posts`, {
      params
    })
  },

  getPost(id: string) {
    return http.get<SuccessResponse<Post>>(`${ADMIN_URL}/posts/${id}`)
  },

  addPost(body: Omit<Post, '_id' | 'slug' | 'createdAt' | 'updatedAt'>) {
    return http.post<SuccessResponse<Post>>(`${ADMIN_URL}/posts`, body)
  },

  updatePost(id: string, body: Partial<Post>) {
    return http.put<SuccessResponse<Post>>(`${ADMIN_URL}/posts/${id}`, body)
  },

  deletePost(id: string) {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(`${ADMIN_URL}/posts/${id}`)
  },

  uploadPostThumbnail(body: FormData) {
    return http.post<SuccessResponse<string>>(`${ADMIN_URL}/posts/upload-thumbnail`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // ========== ORDER APIs ==========
  getOrders(params?: OrderListConfig) {
    return http.get<SuccessResponse<OrderList>>(`${ADMIN_URL}/orders`, {
      params
    })
  },

  getOrder(id: string) {
    return http.get<SuccessResponse<Order>>(`${ADMIN_URL}/orders/${id}`)
  },

  createOrder(body: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>) {
    return http.post<SuccessResponse<Order>>(`${ADMIN_URL}/orders`, body)
  },

  updateOrder(id: string, body: Partial<Order>) {
    return http.put<SuccessResponse<Order>>(`${ADMIN_URL}/orders/${id}`, body)
  },

  deleteOrder(id: string) {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(`${ADMIN_URL}/orders/${id}`)
  },

  // ========== USER/ADMIN MANAGEMENT APIs ==========
  getUsers(params?: UserListConfig) {
    return http.get<SuccessResponse<UserList>>(`${ADMIN_URL}/users`, {
      params
    })
  },

  getUser(id: string) {
    return http.get<SuccessResponse<User>>(`${ADMIN_URL}/users/${id}`)
  },

  createUser(body: { email: string; password: string; name?: string; roles?: string[] }) {
    return http.post<SuccessResponse<User>>(`${ADMIN_URL}/users`, body)
  },

  updateUser(id: string, body: Partial<User>) {
    return http.put<SuccessResponse<User>>(`${ADMIN_URL}/users/${id}`, body)
  },

  deleteUser(id: string) {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(`${ADMIN_URL}/users/${id}`)
  },

  updateUserRole(id: string, roles: string[]) {
    return http.put<SuccessResponse<User>>(`${ADMIN_URL}/users/${id}/roles`, { roles })
  },

  toggleUserStatus(id: string, status: 'active' | 'disabled') {
    return http.put<SuccessResponse<User>>(`${ADMIN_URL}/users/${id}/status`, { status })
  },

  // ========== CONFIG APIs ==========
  getConfig() {
    return http.get<SuccessResponse<SiteConfig>>(`${ADMIN_URL}/config`)
  },

  updateConfig(body: Partial<SiteConfig>) {
    return http.put<SuccessResponse<SiteConfig>>(`${ADMIN_URL}/config`, body)
  },

  uploadConfigImage(body: FormData) {
    return http.post<SuccessResponse<string>>(`${ADMIN_URL}/config/upload-image`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default adminApi
