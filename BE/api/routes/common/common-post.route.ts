import { Router } from 'express'
import postController from '../../controllers/post.controller'
import helpersMiddleware from '../../middleware/helpers.middleware'
import { wrapAsync } from '../../utils/response'

const commonPostRouter = Router()

/**
 * [Get published posts with pagination]
 * @queryParam page: number, limit: number, category: mongoId, search: string, sort_by: string, order: string
 * @route posts
 * @method get
 */
commonPostRouter.get(
  '',
  wrapAsync(postController.getPublishedPosts)
)

/**
 * [Get published post by slug]
 * @route posts/:slug
 * @method get
 */
commonPostRouter.get(
  '/:slug',
  wrapAsync(postController.getPublishedPost)
)

export default commonPostRouter