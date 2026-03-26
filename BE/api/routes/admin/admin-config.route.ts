import { Router } from 'express'
import authMiddleware from '../../middleware/auth.middleware'
import siteConfigController from '../../controllers/site-config.controller'
import { wrapAsync } from '../../utils/response'
import { requirePermission } from '../../middleware/permission.middleware'
import { Permission } from '../../constants/permission'

const adminConfigRouter = Router()

// Get site config (admin)
adminConfigRouter.get(
  '',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.CONFIG_READ),
  wrapAsync(siteConfigController.getSiteConfig)
)

// Update site config
adminConfigRouter.put(
  '',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.CONFIG_UPDATE),
  wrapAsync(siteConfigController.updateSiteConfig)
)

// Upload config image (logo, favicon, etc.)
adminConfigRouter.post(
  '/upload-image',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.CONFIG_UPDATE),
  wrapAsync(siteConfigController.uploadConfigImage)
)

// Reset to default config
adminConfigRouter.post(
  '/reset',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.USER_MANAGE_ROLES), // Only Super Admin
  wrapAsync(siteConfigController.resetSiteConfig)
)

export default adminConfigRouter
