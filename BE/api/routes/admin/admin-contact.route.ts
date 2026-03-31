import { Router } from 'express'
import authMiddleware from '../../middleware/auth.middleware'
import contactController from '../../controllers/contact.controller'
import { wrapAsync } from '../../utils/response'
import { requirePermission } from '../../middleware/permission.middleware'
import { Permission } from '../../constants/permission'

const adminContactRouter = Router()

adminContactRouter.get(
  '',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.CONTACT_READ),
  wrapAsync(contactController.getContactList)
)

adminContactRouter.get(
  '/stats',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.CONTACT_READ),
  wrapAsync(contactController.getContactStats)
)

adminContactRouter.get(
  '/export',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.CONTACT_READ),
  wrapAsync(contactController.exportContacts)
)

adminContactRouter.put(
  '/:id/status',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.CONTACT_UPDATE),
  wrapAsync(contactController.updateContactStatus)
)

adminContactRouter.delete(
  '/:id',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.CONTACT_UPDATE),
  wrapAsync(contactController.deleteContact)
)

export default adminContactRouter
