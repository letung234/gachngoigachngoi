import { Router } from 'express'
import authMiddleware from '../../middleware/auth.middleware'
import helpersMiddleware from '../../middleware/helpers.middleware'
import * as purchaseController from '../../controllers/purchase.controller'
import { wrapAsync } from '../../utils/response'
import { body, query } from 'express-validator'
import { requirePermission } from '../../middleware/permission.middleware'
import { Permission } from '../../constants/permission'

const adminPurchaseRouter = Router()

const getPurchasesRules = () => {
  return [
    query('page')
      .if((value) => value !== undefined)
      .isInt()
      .withMessage('page không đúng định dạng'),
    query('limit')
      .if((value) => value !== undefined)
      .isInt()
      .withMessage('limit không đúng định dạng'),
    query('status')
      .if((value) => value !== undefined)
      .isInt()
      .withMessage('status không đúng định dạng'),
  ]
}

const updateStatusRules = () => {
  return [
    body('status')
      .exists({ checkFalsy: true })
      .withMessage('status không được để trống')
      .isInt()
      .withMessage('status phải là số nguyên'),
  ]
}

// Get all purchases with pagination and filter
adminPurchaseRouter.get(
  '',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PURCHASE_READ),
  getPurchasesRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(purchaseController.getAdminPurchases)
)

// Get purchase detail
adminPurchaseRouter.get(
  '/:purchase_id',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PURCHASE_READ),
  helpersMiddleware.idRule('purchase_id'),
  helpersMiddleware.idValidator,
  wrapAsync(purchaseController.getAdminPurchaseDetail)
)

// Update purchase status
adminPurchaseRouter.put(
  '/:purchase_id',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PURCHASE_UPDATE),
  helpersMiddleware.idRule('purchase_id'),
  helpersMiddleware.idValidator,
  updateStatusRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(purchaseController.updatePurchaseStatus)
)

export default adminPurchaseRouter
