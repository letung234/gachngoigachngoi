import { Request, Response } from 'express'
import { PostModel, POST_STATUS } from '../database/models/post.model'
import { STATUS } from '../constants/status'
import { ErrorHandler, responseSuccess } from '../utils/response'
import { uploadFileCloudinary } from '../utils/cloudinary'
import { FOLDERS } from '../constants/config'

// Get all posts with pagination
export const getPosts = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    search,
    sort_by = 'createdAt',
    order = 'desc',
  } = req.query

  const _page = Number(page)
  const _limit = Number(limit)

  // Build filter condition
  const condition: any = {}

  if (status && status !== 'all') {
    condition.status = status
  }

  if (category) {
    condition.category = category
  }

  if (search) {
    condition.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ]
  }

  const [posts, totalPosts] = await Promise.all([
    PostModel.find(condition)
      .populate('category', 'name slug')
      .populate('author', 'name email')
      .sort({ [sort_by as string]: order === 'desc' ? -1 : 1 })
      .skip((_page - 1) * _limit)
      .limit(_limit)
      .lean(),
    PostModel.countDocuments(condition),
  ])

  const page_size = Math.ceil(totalPosts / _limit) || 1

  const response = {
    message: 'Lấy danh sách bài viết thành công',
    data: {
      posts,
      pagination: {
        page: _page,
        limit: _limit,
        page_size,
        total: totalPosts,
      },
    },
  }
  return responseSuccess(res, response)
}

// Get post detail
export const getPost = async (req: Request, res: Response) => {
  const post = await PostModel.findById(req.params.post_id)
    .populate('category', 'name slug')
    .populate('author', 'name email')
    .lean()

  if (post) {
    const response = {
      message: 'Lấy chi tiết bài viết thành công',
      data: post,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy bài viết')
  }
}

// Create new post
export const createPost = async (req: Request, res: Response) => {
  const { title, content, thumbnail, category, status = POST_STATUS.DRAFT } = req.body

  const post = new PostModel({
    title,
    content,
    thumbnail,
    category,
    status,
    author: req.jwtDecoded?.id,
  })

  const savedPost = await post.save()

  // Populate after save
  const populatedPost = await PostModel.findById(savedPost._id)
    .populate('category', 'name slug')
    .populate('author', 'name email')
    .lean()

  const response = {
    message: 'Tạo bài viết thành công',
    data: populatedPost,
  }
  return responseSuccess(res, response)
}

// Update post
export const updatePost = async (req: Request, res: Response) => {
  const post_id = req.params.post_id
  const updateData = req.body

  // Generate new slug if title changed
  if (updateData.title) {
    updateData.slug = updateData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now()
  }

  const post = await PostModel.findByIdAndUpdate(post_id, updateData, {
    new: true,
  })
    .populate('category', 'name slug')
    .populate('author', 'name email')
    .lean()

  if (post) {
    const response = {
      message: 'Cập nhật bài viết thành công',
      data: post,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy bài viết')
  }
}

// Delete post
export const deletePost = async (req: Request, res: Response) => {
  const post_id = req.params.post_id
  const post = await PostModel.findByIdAndDelete(post_id).lean()

  if (post) {
    return responseSuccess(res, {
      message: 'Xóa bài viết thành công',
      data: { deleted_count: 1 },
    })
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy bài viết')
  }
}

// Get published posts for public access
export const getPublishedPosts = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    category,
    search,
    sort_by = 'createdAt',
    order = 'desc',
  } = req.query

  const _page = Number(page)
  const _limit = Number(limit)

  // Build filter condition - only published posts
  const condition: any = {
    status: POST_STATUS.PUBLISHED
  }

  if (category) {
    condition.category = category
  }

  if (search) {
    condition.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ]
  }

  const [posts, totalPosts] = await Promise.all([
    PostModel.find(condition)
      .populate('category', 'name slug')
      .populate('author', 'name email avatar')
      .sort({ [sort_by as string]: order === 'desc' ? -1 : 1 })
      .skip((_page - 1) * _limit)
      .limit(_limit)
      .lean(),
    PostModel.countDocuments(condition),
  ])

  const page_size = Math.ceil(totalPosts / _limit) || 1

  const response = {
    message: 'Lấy danh sách bài viết thành công',
    data: {
      posts,
      pagination: {
        page: _page,
        limit: _limit,
        page_size,
        total: totalPosts,
      },
    },
  }
  return responseSuccess(res, response)
}

// Get published post by slug for public access
export const getPublishedPost = async (req: Request, res: Response) => {
  const { slug } = req.params

  const post = await PostModel.findOneAndUpdate(
    { slug, status: POST_STATUS.PUBLISHED },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate('category', 'name slug')
    .populate('author', 'name email avatar')
    .lean()

  if (post) {
    const response = {
      message: 'Lấy chi tiết bài viết thành công',
      data: post,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy bài viết')
  }
}

// Upload post thumbnail
export const uploadPostThumbnail = async (req: Request, res: Response) => {
  const url = await uploadFileCloudinary(req, FOLDERS.POST)
  const response = {
    message: 'Upload ảnh thành công',
    data: url,
  }
  return responseSuccess(res, response)
}

const postController = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getPublishedPosts,
  getPublishedPost,
  uploadPostThumbnail,
}

export default postController
