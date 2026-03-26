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
  adminOrders: '/admin/orders',
  adminCustomers: '/admin/customers',
  adminAnalytics: '/admin/analytics',
  adminSettings: '/admin/settings'
} as const

export default path
