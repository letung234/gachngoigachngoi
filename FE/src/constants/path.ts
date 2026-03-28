const path = {
  home: '/',
  products: '/san-pham',
  productCategory: '/san-pham/:category',
  productDetail: '/san-pham/:category/:id',
  projects: '/du-an',
  about: '/gioi-thieu',
  contact: '/lien-he',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  login: '/login',
  register: '/register',
  logout: '/logout',
  cart: '/cart',
  // Admin routes
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminProducts: '/admin/products',
  adminCategories: '/admin/categories',
  adminOrders: '/admin/orders',
  adminUsers: '/admin/users',
  adminPosts: '/admin/posts',
  adminAnalytics: '/admin/analytics',
  // Error pages
  unauthorized: '/403',
  notFound: '/404'
} as const

export default path
