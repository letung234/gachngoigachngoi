// Role definitions
export enum Role {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  VIEWER = 'Viewer',
  USER = 'User'
}

// Permission definitions
export enum Permission {
  // Product permissions
  PRODUCT_READ = 'product.read',
  PRODUCT_CREATE = 'product.create',
  PRODUCT_UPDATE = 'product.update',
  PRODUCT_DELETE = 'product.delete',

  // Category permissions
  CATEGORY_READ = 'category.read',
  CATEGORY_CREATE = 'category.create',
  CATEGORY_UPDATE = 'category.update',
  CATEGORY_DELETE = 'category.delete',

  // Posts/Blog permissions
  POST_READ = 'post.read',
  POST_CREATE = 'post.create',
  POST_UPDATE = 'post.update',
  POST_DELETE = 'post.delete',

  // User/Admin permissions
  USER_READ = 'user.read',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',
  USER_MANAGE_ROLES = 'user.manage_roles',

  // Purchase/Order permissions
  ORDER_READ = 'order.read',
  ORDER_CREATE = 'order.create',
  ORDER_UPDATE = 'order.update',
  ORDER_DELETE = 'order.delete',

  // Stats/Dashboard permissions
  DASHBOARD_VIEW = 'dashboard.view',
  STATS_VIEW = 'stats.view',

  // Contact permissions
  CONTACT_READ = 'contact.read',
  CONTACT_UPDATE = 'contact.update',
  CONTACT_DELETE = 'contact.delete',

  // Config permissions
  CONFIG_READ = 'config.read',
  CONFIG_UPDATE = 'config.update'
}

// Map roles to their permissions
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: Object.values(Permission), // All permissions

  [Role.ADMIN]: [
    // Product & Category management
    Permission.PRODUCT_READ,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_UPDATE,
    Permission.PRODUCT_DELETE,
    Permission.CATEGORY_READ,
    Permission.CATEGORY_CREATE,
    Permission.CATEGORY_UPDATE,
    Permission.CATEGORY_DELETE,
    // Order management
    Permission.ORDER_READ,
    Permission.ORDER_CREATE,
    Permission.ORDER_UPDATE,
    Permission.ORDER_DELETE,
    // User management (read only)
    Permission.USER_READ,
    // Dashboard & Stats
    Permission.DASHBOARD_VIEW,
    Permission.STATS_VIEW,
    // Contact
    Permission.CONTACT_READ,
    Permission.CONTACT_UPDATE,
    Permission.CONTACT_DELETE,
    // Config
    Permission.CONFIG_READ,
    Permission.CONFIG_UPDATE
  ],

  [Role.EDITOR]: [
    // Post/Blog management
    Permission.POST_READ,
    Permission.POST_CREATE,
    Permission.POST_UPDATE,
    Permission.POST_DELETE,
    // Category read only
    Permission.CATEGORY_READ,
    // Dashboard view only
    Permission.DASHBOARD_VIEW
  ],

  [Role.VIEWER]: [
    // Read-only access
    Permission.PRODUCT_READ,
    Permission.CATEGORY_READ,
    Permission.POST_READ,
    Permission.DASHBOARD_VIEW,
    Permission.STATS_VIEW
  ],

  [Role.USER]: [] // Regular users have no admin permissions
}

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (userRoles: string[], permission: Permission): boolean => {
  const roles = userRoles.map((role) => role as Role)
  return roles.some((role) => rolePermissions[role]?.includes(permission))
}

/**
 * Get all permissions for given roles
 */
export const getPermissions = (userRoles: string[]): Permission[] => {
  const roles = userRoles.map((role) => role as Role)
  const permissions = new Set<Permission>()

  roles.forEach((role) => {
    rolePermissions[role]?.forEach((permission) => {
      permissions.add(permission)
    })
  })

  return Array.from(permissions)
}

/**
 * Check if user is admin (any admin role)
 */
export const isAdminRole = (userRoles: string[]): boolean => {
  return userRoles.some(
    (role) => role === Role.SUPER_ADMIN || role === Role.ADMIN || role === Role.EDITOR || role === Role.VIEWER
  )
}

/**
 * Admin menu items with required permissions
 */
export const adminMenuItems = [
  {
    path: '/admin/dashboard',
    label: 'Dashboard',
    icon: '📊',
    permission: Permission.DASHBOARD_VIEW
  },
  {
    path: '/admin/products',
    label: 'Sản phẩm',
    icon: '�ｨ滓ｨ｣ﾂ�ｿｽ',
    permission: Permission.PRODUCT_READ
  },
  {
    path: '/admin/categories',
    label: 'Danh mục',
    icon: '📋',
    permission: Permission.CATEGORY_READ
  },
  {
    path: '/admin/orders',
    label: 'Đơn hàng',
    icon: '🛒',
    permission: Permission.ORDER_READ
  },
  {
    path: '/admin/users',
    label: 'Người dùng',
    icon: '👥',
    permission: Permission.USER_READ
  },
  {
    path: '/admin/posts',
    label: 'Bài viết',
    icon: '📝',
    permission: Permission.POST_READ
  },
  {
    path: '/admin/analytics',
    label: 'Phân tích',
    icon: '📈',
    permission: Permission.STATS_VIEW
  },
  {
    path: '/admin/contacts',
    label: 'Liên hệ',
    icon: '📩',
    permission: Permission.CONTACT_READ
  },
  {
    path: '/admin/settings',
    label: 'Cài đặt',
    icon: '⚙️',
    permission: Permission.CONFIG_READ
  }
]
