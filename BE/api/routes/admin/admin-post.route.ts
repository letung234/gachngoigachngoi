import { Router } from 'express'
import { wrapAsync } from '../../utils/response'
import authMiddleware from '../../middleware/auth.middleware'
import postController from '../../controllers/post.controller'

const adminPostRouter = Router()

// All routes require admin authentication
adminPostRouter.use(authMiddleware.verifyAccessToken, authMiddleware.verifyAdmin)

// POST /admin/posts/upload-thumbnail - Upload thumbnail
adminPostRouter.post('/upload-thumbnail', wrapAsync(postController.uploadPostThumbnail))

// GET /admin/posts - Get all posts with pagination
adminPostRouter.get('', wrapAsync(postController.getPosts))

// GET /admin/posts/:post_id - Get post detail
adminPostRouter.get('/:post_id', wrapAsync(postController.getPost))

// POST /admin/posts - Create new post
adminPostRouter.post('', wrapAsync(postController.createPost))

// PUT /admin/posts/:post_id - Update post
adminPostRouter.put('/:post_id', wrapAsync(postController.updatePost))

// DELETE /admin/posts/:post_id - Delete post
adminPostRouter.delete('/:post_id', wrapAsync(postController.deletePost))

export default adminPostRouter
