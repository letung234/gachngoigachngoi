import { Router } from 'express'
import authMiddleware from '../../middleware/auth.middleware'
import statsController from '../../controllers/stats.controller'
import { wrapAsync } from '../../utils/response'
import { query } from 'express-validator'
import helpersMiddleware from '../../middleware/helpers.middleware'
import { requirePermission } from '../../middleware/permission.middleware'
import { Permission } from '../../constants/permission'

const adminStatsRouter = Router()

const limitRules = () => {
  return [
    query('limit')
      .if((value) => value !== undefined)
      .isInt()
      .withMessage('limit không đúng định dạng'),
  ]
}

// Get overview statistics
adminStatsRouter.get(
  '/overview',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.DASHBOARD_VIEW),
  wrapAsync(statsController.getOverviewStats)
)

// Get revenue statistics
adminStatsRouter.get(
  '/revenue',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.STATS_VIEW),
  wrapAsync(statsController.getRevenueStats)
)

// Get top selling products
adminStatsRouter.get(
  '/top-products',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.STATS_VIEW),
  limitRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(statsController.getTopProducts)
)

// Get latest orders
adminStatsRouter.get(
  '/latest-orders',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PURCHASE_READ),
  limitRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(statsController.getLatestOrders)
)

// Get category statistics
adminStatsRouter.get(
  '/category-stats',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.STATS_VIEW),
  wrapAsync(statsController.getCategoryStats)
)

export default adminStatsRouter
