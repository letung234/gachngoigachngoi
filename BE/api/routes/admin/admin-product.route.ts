import { Router } from 'express'
import helpersMiddleware from '../../middleware/helpers.middleware'
import authMiddleware from '../../middleware/auth.middleware'
import ProductController from '../../controllers/product.controller'
import productMiddleware from '../../middleware/product.middleware'
import { wrapAsync } from '../../utils/response'
import { requirePermission } from '../../middleware/permission.middleware'
import { Permission } from '../../constants/permission'

const adminProductRouter = Router()
/**
 * [Get products paginate]
 * @queryParam type: string, page: number, limit: number, category:mongoId
 * @route admin/products
 * @method get
 */
adminProductRouter.get(
  '',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PRODUCT_READ),
  productMiddleware.getProductsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(ProductController.getProducts)
)
/**
 * [Get all products ]
 * @queryParam type: string, category:mongoId
 * @route admin/products/all
 * @method get
 */
adminProductRouter.get(
  '/all',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PRODUCT_READ),
  productMiddleware.getAllProductsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(ProductController.getAllProducts)
)

adminProductRouter.get(
  '/:product_id',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PRODUCT_READ),
  helpersMiddleware.idRule('product_id'),
  helpersMiddleware.idValidator,
  wrapAsync(ProductController.getProduct)
)
adminProductRouter.post(
  '',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PRODUCT_CREATE),
  productMiddleware.addProductRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(ProductController.addProduct)
)
adminProductRouter.put(
  '/:product_id',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PRODUCT_UPDATE),
  helpersMiddleware.idRule('product_id'),
  helpersMiddleware.idValidator,
  productMiddleware.updateProductRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(ProductController.updateProduct)
)

adminProductRouter.delete(
  '/delete/:product_id',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PRODUCT_DELETE),
  helpersMiddleware.idRule('product_id'),
  helpersMiddleware.idValidator,
  wrapAsync(ProductController.deleteProduct)
)

adminProductRouter.delete(
  '/delete-many',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PRODUCT_DELETE),
  helpersMiddleware.listIdRule('list_id'),
  helpersMiddleware.idValidator,
  wrapAsync(ProductController.deleteManyProducts)
)

adminProductRouter.post(
  '/upload-image',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PRODUCT_CREATE),
  wrapAsync(ProductController.uploadProductImage)
)
adminProductRouter.post(
  '/upload-images',
  authMiddleware.verifyAccessToken,
  requirePermission(Permission.PRODUCT_CREATE),
  wrapAsync(ProductController.uploadManyProductImages)
)
export default adminProductRouter
