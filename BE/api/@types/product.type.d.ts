interface ProductReview {
  avatar?: string
  name: string
  content: string
  rating?: number
}

interface ProductSpecs {
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

interface Product {
  name: string
  image: string
  images: string[]
  description: string
  category: string[]
  price: number
  price_before_discount: number
  quantity: number
  rating: number
  view: number
  sold: number
  featured?: boolean
  specs?: ProductSpecs
  reviews?: ProductReview[]
}