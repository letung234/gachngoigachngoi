import { hashValue } from '../utils/crypt'
import { Request, Response } from 'express'
import { responseSuccess, ErrorHandler } from '../utils/response'
import { UserModel } from '../database/models/user.model'
import { STATUS } from '../constants/status'
import { omitBy } from 'lodash'
import { uploadFileCloudinary } from '../utils/cloudinary'
import { FOLDERS } from '../constants/config'

const addUser = async (req: Request, res: Response) => {
  const form: User = req.body
  const {
    email,
    password,
    address,
    date_of_birth,
    name,
    phone,
    roles,
    avatar,
  } = form
  const userInDB = await UserModel.findOne({ email: email }).exec()
  if (!userInDB) {
    const hashedPassword = hashValue(password)
    const user = {
      email,
      password: hashedPassword,
      roles,
      address,
      date_of_birth,
      name,
      phone,
      avatar,
    }
    Object.keys(user).forEach(
      (key) =>
        user[key as keyof typeof user] === undefined &&
        delete user[key as keyof typeof user]
    )
    const userAdd = await new UserModel(user).save()
    const response = {
      message: 'Tạo người dùng thành công',
      data: userAdd.toObject({
        transform: (doc, ret, option) => {
          delete ret.password
          delete ret.__v
          return ret
        },
      }),
    }
    return responseSuccess(res, response)
  }
  throw new ErrorHandler(422, { email: 'Email đã tồn tại' })
}

const getUsers = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sort_by = 'createdAt',
    order = 'desc',
    search,
    role,
    status,
  } = req.query

  const _page = Number(page)
  const _limit = Number(limit)

  // Build filter condition
  const condition: any = {}

  // Search by name or email
  if (search) {
    condition.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }

  // Filter by role
  if (role) {
    condition.roles = role
  }

  // Filter by status
  if (status) {
    condition.status = status
  }

  const [users, totalUsers] = await Promise.all([
    UserModel.find(condition)
      .select({ password: 0, __v: 0 })
      .sort({ [sort_by as string]: order === 'desc' ? -1 : 1 })
      .skip((_page - 1) * _limit)
      .limit(_limit)
      .lean(),
    UserModel.countDocuments(condition),
  ])

  const page_size = Math.ceil(totalUsers / _limit) || 1

  const response = {
    message: 'Lấy người dùng thành công',
    data: {
      users,
      pagination: {
        page: _page,
        limit: _limit,
        page_size,
        total: totalUsers,
      },
    },
  }
  return responseSuccess(res, response)
}

const getDetailMySelf = async (req: Request, res: Response) => {
  const userDB = await UserModel.findById(req.jwtDecoded.id)
    .select({ password: 0, __v: 0 })
    .lean()
  if (userDB) {
    const response = {
      message: 'Lấy người dùng thành công',
      data: userDB,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.UNAUTHORIZED, 'Không tìm thấy người dùng')
  }
}

const getUser = async (req: Request, res: Response) => {
  const userDB = await UserModel.findById(req.params.user_id)
    .select({ password: 0, __v: 0 })
    .lean()
  if (userDB) {
    const response = {
      message: 'Lấy người dùng thành công',
      data: userDB,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy người dùng')
  }
}

const updateUser = async (req: Request, res: Response) => {
  const form: User = req.body
  const { password, address, date_of_birth, name, phone, roles, avatar } = form
  const user = omitBy(
    {
      password,
      address,
      date_of_birth,
      name,
      phone,
      roles,
      avatar,
    },
    (value) => value === undefined || value === ''
  )
  const userDB = await UserModel.findByIdAndUpdate(req.params.user_id, user, {
    new: true,
  })
    .select({ password: 0, __v: 0 })
    .lean()
  if (userDB) {
    const response = {
      message: 'Cập nhật người dùng thành công',
      data: userDB,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy người dùng')
  }
}

const updateMe = async (req: Request, res: Response) => {
  const form: User = req.body
  const {
    email,
    password,
    new_password,
    address,
    date_of_birth,
    name,
    phone,
    avatar,
  } = form
  const user = omitBy(
    {
      email,
      password,
      address,
      date_of_birth,
      name,
      phone,
      avatar,
    },
    (value) => value === undefined || value === ''
  )
  const userDB: any = await UserModel.findById(req.jwtDecoded.id).lean()
  if (user.password) {
    const hash_password = hashValue(password)
    if (hash_password === userDB.password) {
      Object.assign(user, { password: hashValue(new_password) })
    } else {
      throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
        password: 'Password không đúng',
      })
    }
  }
  const updatedUserDB = await UserModel.findByIdAndUpdate(
    req.jwtDecoded.id,
    user,
    { new: true }
  )
    .select({ password: 0, __v: 0 })
    .lean()
  const response = {
    message: 'Cập nhật thông tin thành công',
    data: updatedUserDB,
  }
  return responseSuccess(res, response)
}

const deleteUser = async (req: Request, res: Response) => {
  const user_id = req.params.user_id
  const userDB = await UserModel.findByIdAndDelete(user_id).lean()
  if (userDB) {
    return responseSuccess(res, { message: 'Xóa thành công' })
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy người dùng')
  }
}

const uploadAvatar = async (req: Request, res: Response) => {
  const url = await uploadFileCloudinary(req, FOLDERS.AVATAR)
  const response = {
    message: 'Upload ảnh thành công',
    data: url,
  }
  return responseSuccess(res, response)
}

const updateUserRole = async (req: Request, res: Response) => {
  const user_id = req.params.user_id
  const { roles } = req.body

  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Vui lòng cung cấp quyền hợp lệ')
  }

  const userDB = await UserModel.findByIdAndUpdate(
    user_id,
    { roles },
    { new: true }
  )
    .select({ password: 0, __v: 0 })
    .lean()

  if (userDB) {
    const response = {
      message: 'Cập nhật quyền thành công',
      data: userDB,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy người dùng')
  }
}

const toggleUserStatus = async (req: Request, res: Response) => {
  const user_id = req.params.user_id
  const { status } = req.body
  const currentUserId = (req as any).jwtDecoded?.id

  if (!status || !['active', 'disabled'].includes(status)) {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Trạng thái không hợp lệ')
  }

  // Prevent user from disabling themselves
  if (user_id === currentUserId && status === 'disabled') {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Bạn không thể khóa tài khoản của chính mình')
  }

  const userDB = await UserModel.findByIdAndUpdate(
    user_id,
    { status },
    { new: true }
  )
    .select({ password: 0, __v: 0 })
    .lean()

  if (userDB) {
    const response = {
      message: 'Cập nhật trạng thái thành công',
      data: userDB,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy người dùng')
  }
}

const userController = {
  addUser,
  getUsers,
  getDetailMySelf,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  uploadAvatar,
  updateUserRole,
  toggleUserStatus,
}

export default userController
