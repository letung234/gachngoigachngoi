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

export interface ProductReview {
  _id?: string
  avatar?: string
  name: string
  content: string
  rating?: number
  createdAt?: string
}

export interface Product {
  _id: string
  images: string[]
  price: number
  rating: number
  price_before_discount: number
  quantity: number
  sold: number
  view: number
  name: string
  description: string
  category: {
    _id: string
    name: string
    slug?: string
  }
  image: string
  featured?: boolean
  specs?: ProductSpecs
  reviews?: ProductReview[]
  createdAt: string
  updatedAt: string
}

export interface ProductList {
  products: Product[]
  pagination: {
    page: number
    limit: number
    page_size: number
    total?: number
  }
}

export interface ProductListConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price'
  order?: 'asc' | 'desc'
  exclude?: string
  rating_filter?: number | string
  price_max?: number | string
  price_min?: number | string
  name?: string
  category?: string
}
