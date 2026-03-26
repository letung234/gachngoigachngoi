import { useContext, useMemo, useCallback } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { Permission, hasPermission, getPermissions, isAdminRole, Role } from 'src/constants/permission'

/**
 * Hook to check user permissions
 */
export function usePermission() {
  const { profile } = useContext(AppContext)

  const userRoles = useMemo(() => {
    return profile?.roles || []
  }, [profile])

  /**
   * Check if user has a specific permission
   */
  const can = useCallback(
    (permission: Permission): boolean => {
      return hasPermission(userRoles, permission)
    },
    [userRoles]
  )

  /**
   * Check if user has any of the given permissions
   */
  const canAny = useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.some((permission) => hasPermission(userRoles, permission))
    },
    [userRoles]
  )

  /**
   * Check if user has all of the given permissions
   */
  const canAll = useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.every((permission) => hasPermission(userRoles, permission))
    },
    [userRoles]
  )

  /**
   * Get all user permissions
   */
  const permissions = useMemo(() => {
    return getPermissions(userRoles)
  }, [userRoles])

  /**
   * Check if user has any admin role
   */
  const isAdmin = useMemo(() => {
    return isAdminRole(userRoles)
  }, [userRoles])

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (role: Role): boolean => {
      return userRoles.some(userRole => userRole === String(role))
    },
    [userRoles]
  )

  /**
   * Check if user is Super Admin
   */
  const isSuperAdmin = useMemo(() => {
    return userRoles.some(userRole => userRole === String(Role.SUPER_ADMIN))
  }, [userRoles])

  return {
    can,
    canAny,
    canAll,
    permissions,
    isAdmin,
    hasRole,
    isSuperAdmin,
    userRoles
  }
}

export default usePermission
