import { Router } from 'express'
import userController from '../../controllers/user.controller'
import helpersMiddleware from '../../middleware/helpers.middleware'
import userMiddleware from '../../middleware/user.middleware'
import authMiddleware from '../../middleware/auth.middleware'
import { wrapAsync } from '../../utils/response'
import { requirePermission } from '../../middleware/permission.middleware'
import { Permission } from '../../constants/permission'

const adminUserRouter = Router()
adminUserRouter.get(
  '',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.USER_READ),
  userController.getUsers
)
adminUserRouter.post(
  '',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.USER_CREATE),
  userMiddleware.addUserRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(userController.addUser)
)
adminUserRouter.put(
  '/:user_id',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.USER_UPDATE),
  helpersMiddleware.idRule('user_id'),
  helpersMiddleware.idValidator,
  userMiddleware.updateUserRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(userController.updateUser)
)

adminUserRouter.get(
  '/:user_id',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.USER_READ),
  helpersMiddleware.idRule('user_id'),
  helpersMiddleware.idValidator,
  wrapAsync(userController.getUser)
)

adminUserRouter.delete(
  '/delete/:user_id',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.USER_DELETE),
  helpersMiddleware.idRule('user_id'),
  helpersMiddleware.idValidator,
  wrapAsync(userController.deleteUser)
)
export default adminUserRouter
