export const ROLE = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
  USER: 'User'
}

// Check if any role in array is an admin role
export const isAdminRole = (roles: string[]): boolean => {
  return roles.some((role) => [ROLE.SUPER_ADMIN, ROLE.ADMIN, ROLE.EDITOR, ROLE.VIEWER].includes(role))
}
