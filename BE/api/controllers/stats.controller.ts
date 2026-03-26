import { Request, Response } from 'express'
import { ProductModel } from '../database/models/product.model'
import { UserModel } from '../database/models/user.model'
import { PurchaseModel } from '../database/models/purchase.model'
import { STATUS_PURCHASE } from '../constants/purchase'
import { responseSuccess } from '../utils/response'
import { handleImageProduct } from './product.controller'
import { cloneDeep } from 'lodash'

// Dashboard Overview Stats
export const getOverviewStats = async (req: Request, res: Response) => {
  const [totalProducts, totalUsers, purchases] = await Promise.all([
    ProductModel.countDocuments(),
    UserModel.countDocuments(),
    PurchaseModel.find({
      status: { $ne: STATUS_PURCHASE.IN_CART },
    }).lean(),
  ])

  const totalOrders = purchases.length
  const totalRevenue = purchases.reduce((sum, purchase: any) => {
    return sum + purchase.price * purchase.buy_count
  }, 0)

  // Count orders by status
  const ordersByStatus = {
    wait_for_confirmation: purchases.filter(
      (p: any) => p.status === STATUS_PURCHASE.WAIT_FOR_CONFIRMATION
    ).length,
    wait_for_getting: purchases.filter(
      (p: any) => p.status === STATUS_PURCHASE.WAIT_FOR_GETTING
    ).length,
    in_progress: purchases.filter(
      (p: any) => p.status === STATUS_PURCHASE.IN_PROGRESS
    ).length,
    delivered: purchases.filter(
      (p: any) => p.status === STATUS_PURCHASE.DELIVERED
    ).length,
    cancelled: purchases.filter(
      (p: any) => p.status === STATUS_PURCHASE.CANCELLED
    ).length,
  }

  const response = {
    message: 'Lấy thống kê tổng quan thành công',
    data: {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      ordersByStatus,
    },
  }
  return responseSuccess(res, response)
}

// Revenue by month (last 12 months)
export const getRevenueStats = async (req: Request, res: Response) => {
  const { period = 'month' } = req.query

  // Get purchases from last 12 months
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

  const purchases: any = await PurchaseModel.find({
    status: STATUS_PURCHASE.DELIVERED,
    createdAt: { $gte: twelveMonthsAgo },
  }).lean()

  // Group by month
  const revenueByMonth: any = {}
  const currentDate = new Date()

  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    revenueByMonth[monthKey] = {
      month: monthKey,
      revenue: 0,
      orders: 0,
    }
  }

  purchases.forEach((purchase: any) => {
    const date = new Date(purchase.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (revenueByMonth[monthKey]) {
      revenueByMonth[monthKey].revenue += purchase.price * purchase.buy_count
      revenueByMonth[monthKey].orders += 1
    }
  })

  const response = {
    message: 'Lấy thống kê doanh thu thành công',
    data: Object.values(revenueByMonth),
  }
  return responseSuccess(res, response)
}

// Top selling products
export const getTopProducts = async (req: Request, res: Response) => {
  const { limit = 10 } = req.query
  const _limit = Number(limit)

  // Get all delivered purchases
  const purchases: any = await PurchaseModel.find({
    status: STATUS_PURCHASE.DELIVERED,
  })
    .populate({
      path: 'product',
      populate: {
        path: 'category',
      },
    })
    .lean()

  // Group by product and calculate total sold and revenue
  const productStats: any = {}

  purchases.forEach((purchase: any) => {
    if (purchase.product && purchase.product._id) {
      const productId = purchase.product._id.toString()
      if (!productStats[productId]) {
        productStats[productId] = {
          product: purchase.product,
          totalSold: 0,
          totalRevenue: 0,
        }
      }
      productStats[productId].totalSold += purchase.buy_count
      productStats[productId].totalRevenue += purchase.price * purchase.buy_count
    }
  })

  // Convert to array and sort by revenue
  const topProducts = Object.values(productStats)
    .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
    .slice(0, _limit)
    .map((item: any) => ({
      ...item,
      product: handleImageProduct(cloneDeep(item.product)),
    }))

  const response = {
    message: 'Lấy danh sách sản phẩm bán chạy thành công',
    data: topProducts,
  }
  return responseSuccess(res, response)
}

// Latest orders
export const getLatestOrders = async (req: Request, res: Response) => {
  const { limit = 5 } = req.query
  const _limit = Number(limit)

  const orders = await PurchaseModel.find({
    status: { $ne: STATUS_PURCHASE.IN_CART },
  })
    .populate('user', 'email name')
    .populate({
      path: 'product',
      populate: {
        path: 'category',
      },
    })
    .sort({ createdAt: -1 })
    .limit(_limit)
    .lean()

  const response = {
    message: 'Lấy danh sách đơn hàng mới nhất thành công',
    data: orders.map((order: any) => ({
      ...order,
      product: handleImageProduct(cloneDeep(order.product)),
    })),
  }
  return responseSuccess(res, response)
}

const statsController = {
  getOverviewStats,
  getRevenueStats,
  getTopProducts,
  getLatestOrders,
}

export default statsController
