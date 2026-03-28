export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number // Price snapshot at time of order
  totalPrice: number
  image?: string
}

export interface Order {
  _id: string
  customerName: string
  customerEmail?: string
  phone: string
  address?: string
  items: OrderItem[]
  subtotal: number
  shippingCost?: number
  discount?: number
  total: number
  status: OrderStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderList {
  orders: Order[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}

export interface OrderListConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'total'
  order?: 'asc' | 'desc'
  status?: OrderStatus
  search?: string
}
