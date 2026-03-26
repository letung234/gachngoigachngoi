import { ReactNode } from 'react'
import { Permission } from 'src/constants/permission'
import usePermission from 'src/hooks/usePermission'

interface PermissionGuardProps {
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Component to conditionally render children based on user permissions
 *
 * @example
 * // Single permission
 * <PermissionGuard permission={Permission.PRODUCT_DELETE}>
 *   <DeleteButton />
 * </PermissionGuard>
 *
 * @example
 * // Any of multiple permissions
 * <PermissionGuard permissions={[Permission.PRODUCT_CREATE, Permission.PRODUCT_UPDATE]}>
 *   <EditButton />
 * </PermissionGuard>
 *
 * @example
 * // All permissions required
 * <PermissionGuard permissions={[Permission.USER_READ, Permission.USER_DELETE]} requireAll>
 *   <DeleteUserButton />
 * </PermissionGuard>
 */
export default function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback = null
}: PermissionGuardProps) {
  const { can, canAny, canAll } = usePermission()

  let hasAccess = false

  if (permission) {
    hasAccess = can(permission)
  } else if (permissions) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions)
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
