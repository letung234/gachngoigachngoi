import { Request, Response } from 'express'
import { OrderModel, ORDER_STATUS } from '../database/models/order.model'
import { STATUS } from '../constants/status'
import { ErrorHandler, responseSuccess } from '../utils/response'

// Get all orders with pagination
export const getOrders = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    status,
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

  if (search) {
    condition.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { customerEmail: { $regex: search, $options: 'i' } },
    ]
  }

  const [orders, totalOrders] = await Promise.all([
    OrderModel.find(condition)
      .sort({ [sort_by as string]: order === 'desc' ? -1 : 1 })
      .skip((_page - 1) * _limit)
      .limit(_limit)
      .lean(),
    OrderModel.countDocuments(condition),
  ])

  const page_size = Math.ceil(totalOrders / _limit) || 1

  const response = {
    message: 'Lấy danh sách đơn hàng thành công',
    data: {
      orders,
      pagination: {
        page: _page,
        limit: _limit,
        page_size,
        total: totalOrders,
      },
    },
  }
  return responseSuccess(res, response)
}

// Get order detail
export const getOrder = async (req: Request, res: Response) => {
  const order = await OrderModel.findById(req.params.order_id).lean()

  if (order) {
    const response = {
      message: 'Lấy chi tiết đơn hàng thành công',
      data: order,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy đơn hàng')
  }
}

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  const {
    customerName,
    customerEmail,
    phone,
    address,
    items,
    subtotal,
    shippingCost = 0,
    discount = 0,
    total,
    status = ORDER_STATUS.PENDING,
    notes,
  } = req.body

  const order = new OrderModel({
    customerName,
    customerEmail,
    phone,
    address,
    items,
    subtotal,
    shippingCost,
    discount,
    total,
    status,
    notes,
    createdBy: req.jwtDecoded?.id,
  })

  const savedOrder = await order.save()

  const response = {
    message: 'Tạo đơn hàng thành công',
    data: savedOrder,
  }
  return responseSuccess(res, response)
}

// Update order
export const updateOrder = async (req: Request, res: Response) => {
  const order_id = req.params.order_id
  const updateData = req.body

  const order = await OrderModel.findByIdAndUpdate(order_id, updateData, {
    new: true,
  }).lean()

  if (order) {
    const response = {
      message: 'Cập nhật đơn hàng thành công',
      data: order,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy đơn hàng')
  }
}

// Delete order
export const deleteOrder = async (req: Request, res: Response) => {
  const order_id = req.params.order_id
  const order = await OrderModel.findByIdAndDelete(order_id).lean()

  if (order) {
    return responseSuccess(res, {
      message: 'Xóa đơn hàng thành công',
      data: { deleted_count: 1 },
    })
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy đơn hàng')
  }
}

const orderController = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
}

export default orderController
