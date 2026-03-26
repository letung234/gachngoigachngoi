import { Request, Response, NextFunction } from 'express'
import { UserModel } from '../database/models/user.model'
import { ErrorHandler, responseError } from '../utils/response'
import { STATUS } from '../constants/status'
import { hasPermission, Permission, isAdminRole } from '../constants/permission'

/**
 * Middleware to check if user has required permission
 * @param permission - Required permission
 */
export const requirePermission = (permission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get user from database
      const userDB: User = await UserModel.findById(req.jwtDecoded.id).lean()

      if (!userDB) {
        return responseError(res, new ErrorHandler(STATUS.UNAUTHORIZED, 'Người dùng không tồn tại'))
      }

      // Check if user has required permission
      if (!hasPermission(userDB.roles, permission)) {
        return responseError(res, new ErrorHandler(STATUS.FORBIDDEN, 'Không có quyền thực hiện hành động này'))
      }

      next()
    } catch (error) {
      return responseError(res, error)
    }
  }
}

/**
 * Middleware to check if user has any admin role
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userDB: User = await UserModel.findById(req.jwtDecoded.id).lean()

    if (!userDB) {
      return responseError(res, new ErrorHandler(STATUS.UNAUTHORIZED, 'Người dùng không tồn tại'))
    }

    // Check if user has any admin role
    if (!isAdminRole(userDB.roles)) {
      return responseError(res, new ErrorHandler(STATUS.FORBIDDEN, 'Không có quyền truy cập admin panel'))
    }

    next()
  } catch (error) {
    return responseError(res, error)
  }
}

/**
 * Middleware to check if user has one of the required permissions
 * @param permissions - Array of acceptable permissions (user needs at least one)
 */
export const requireAnyPermission = (permissions: Permission[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userDB: User = await UserModel.findById(req.jwtDecoded.id).lean()

      if (!userDB) {
        return responseError(res, new ErrorHandler(STATUS.UNAUTHORIZED, 'Người dùng không tồn tại'))
      }

      // Check if user has any of the required permissions
      const hasAnyPermission = permissions.some((permission) => hasPermission(userDB.roles, permission))

      if (!hasAnyPermission) {
        return responseError(res, new ErrorHandler(STATUS.FORBIDDEN, 'Không có quyền thực hiện hành động này'))
      }

      next()
    } catch (error) {
      return responseError(res, error)
    }
  }
}

const permissionMiddleware = {
  requirePermission,
  requireAdmin,
  requireAnyPermission
}

export default permissionMiddleware
