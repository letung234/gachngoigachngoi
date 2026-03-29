import { Router } from 'express'
import { wrapAsync } from '../../utils/response'
import authMiddleware from '../../middleware/auth.middleware'
import orderController from '../../controllers/order.controller'

const adminOrderRouter = Router()

// All routes require admin authentication
adminOrderRouter.use(authMiddleware.verifyAccessToken, authMiddleware.verifyAdmin)

// GET /admin/orders - Get all orders with pagination
adminOrderRouter.get('', wrapAsync(orderController.getOrders))

// GET /admin/orders/:order_id - Get order detail
adminOrderRouter.get('/:order_id', wrapAsync(orderController.getOrder))

// POST /admin/orders - Create new order
adminOrderRouter.post('', wrapAsync(orderController.createOrder))

// PUT /admin/orders/:order_id - Update order
adminOrderRouter.put('/:order_id', wrapAsync(orderController.updateOrder))

// DELETE /admin/orders/:order_id - Delete order
adminOrderRouter.delete('/:order_id', wrapAsync(orderController.deleteOrder))

export default adminOrderRouter
