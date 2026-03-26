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

  // User permissions
  USER_READ = 'user.read',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',
  USER_MANAGE_ROLES = 'user.manage_roles',

  // Purchase/Order permissions
  PURCHASE_READ = 'purchase.read',
  PURCHASE_UPDATE = 'purchase.update',
  PURCHASE_DELETE = 'purchase.delete',

  // Stats/Dashboard permissions
  DASHBOARD_VIEW = 'dashboard.view',
  STATS_VIEW = 'stats.view',

  // Contact permissions
  CONTACT_READ = 'contact.read',
  CONTACT_UPDATE = 'contact.update',

  // Config permissions
  CONFIG_READ = 'config.read',
  CONFIG_UPDATE = 'config.update'
}

// Map roles to their permissions
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: Object.values(Permission), // All permissions

  [Role.ADMIN]: [
    Permission.PRODUCT_READ,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_UPDATE,
    Permission.PRODUCT_DELETE,
    Permission.CATEGORY_READ,
    Permission.CATEGORY_CREATE,
    Permission.CATEGORY_UPDATE,
    Permission.CATEGORY_DELETE,
    Permission.USER_READ,
    Permission.PURCHASE_READ,
    Permission.PURCHASE_UPDATE,
    Permission.DASHBOARD_VIEW,
    Permission.STATS_VIEW,
    Permission.CONTACT_READ,
    Permission.CONTACT_UPDATE,
    Permission.CONFIG_READ,
    Permission.CONFIG_UPDATE
  ],

  [Role.EDITOR]: [
    Permission.PRODUCT_READ,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_UPDATE,
    Permission.CATEGORY_READ,
    Permission.DASHBOARD_VIEW
  ],

  [Role.VIEWER]: [
    Permission.PRODUCT_READ,
    Permission.CATEGORY_READ,
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
    path: '/admin',
    label: 'Dashboard',
    icon: 'dashboard',
    permission: Permission.DASHBOARD_VIEW
  },
  {
    path: '/admin/products',
    label: 'Sản phẩm',
    icon: 'products',
    permission: Permission.PRODUCT_READ
  },
  {
    path: '/admin/orders',
    label: 'Đơn hàng',
    icon: 'orders',
    permission: Permission.PURCHASE_READ
  },
  {
    path: '/admin/customers',
    label: 'Khách hàng',
    icon: 'customers',
    permission: Permission.USER_READ
  },
  {
    path: '/admin/analytics',
    label: 'Phân tích',
    icon: 'analytics',
    permission: Permission.STATS_VIEW
  },
  {
    path: '/admin/settings',
    label: 'Cài đặt',
    icon: 'settings',
    permission: Permission.CONFIG_READ
  }
]
