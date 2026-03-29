import { Request, Response } from 'express'
import { responseSuccess, ErrorHandler } from '../utils/response'
import { STATUS } from '../constants/status'
import { CategoryModel } from '../database/models/category.model'

const addCategory = async (req: Request, res: Response) => {
  const name: string = req.body.name
  const categoryAdd = await new CategoryModel({ name }).save()
  const response = {
    message: 'Tạo Category thành công',
    data: categoryAdd.toObject({
      transform: (doc, ret, option) => {
        delete ret.__v
        return ret
      },
    }),
  }
  return responseSuccess(res, response)
}

const getCategories = async (req: Request, res: Response) => {
  let {
    page = 1,
    limit = 10,
    exclude,
    sort_by = 'createdAt',
    order = 'desc',
    search,
  } = req.query as {
    [key: string]: string | number
  }

  page = Number(page)
  limit = Number(limit)

  // Build search conditions
  let condition: any = {}
  if (exclude) {
    condition._id = { $ne: exclude }
  }
  if (search) {
    condition.name = {
      $regex: search,
      $options: 'i',
    }
  }

  // Validate sort_by and order
  const validSortFields = ['createdAt', 'name', 'order']
  const validOrders = ['asc', 'desc']

  if (!validSortFields.includes(sort_by as string)) {
    sort_by = 'createdAt'
  }
  if (!validOrders.includes(order as string)) {
    order = 'desc'
  }

  // Execute parallel queries for data and count
  let [categories, totalCategories]: [categories: any, totalCategories: any] =
    await Promise.all([
      CategoryModel.find(condition)
        .sort({ [sort_by]: order === 'desc' ? -1 : 1 })
        .skip(page * limit - limit)
        .limit(limit)
        .select({ __v: 0 })
        .lean(),
      CategoryModel.find(condition).countDocuments().lean(),
    ])

  const page_size = Math.ceil(totalCategories / limit) || 1
  const response = {
    message: 'Lấy categories thành công',
    data: {
      categories,
      pagination: {
        page,
        limit,
        page_size,
        total: totalCategories,
      },
    },
  }
  return responseSuccess(res, response)
}

const getCategory = async (req: Request, res: Response) => {
  const categoryDB = await CategoryModel.findById(req.params.category_id)
    .select({ __v: 0 })
    .lean()
  if (categoryDB) {
    const response = {
      message: 'Lấy category thành công',
      data: categoryDB,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy Category')
  }
}

const updateCategory = async (req: Request, res: Response) => {
  const { name } = req.body
  const categoryDB = await CategoryModel.findByIdAndUpdate(
    req.params.category_id,
    { name },
    { new: true }
  )
    .select({ __v: 0 })
    .lean()
  if (categoryDB) {
    const response = {
      message: 'Cập nhật category thành công',
      data: categoryDB,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy Category')
  }
}

const deleteCategory = async (req: Request, res: Response) => {
  const category_id = req.params.category_id
  const categoryDB = await CategoryModel.findByIdAndDelete(category_id).lean()
  if (categoryDB) {
    return responseSuccess(res, { message: 'Xóa thành công' })
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy Category')
  }
}

const categoryController = {
  addCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
}

export default categoryController
