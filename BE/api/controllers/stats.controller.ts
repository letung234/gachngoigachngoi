import { Request, Response } from 'express'
import { ProductModel } from '../database/models/product.model'
import { UserModel } from '../database/models/user.model'
import { OrderModel, ORDER_STATUS } from '../database/models/order.model'
import { responseSuccess } from '../utils/response'

// Dashboard Overview Stats
export const getOverviewStats = async (req: Request, res: Response) => {
  const [totalProducts, totalUsers, orders] = await Promise.all([
    ProductModel.countDocuments(),
    OrderModel.distinct("customerEmail"),
    OrderModel.find().lean(),
  ])

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order: any) => {
    return sum + order.total
  }, 0)

  // Get today's orders
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayOrders = orders.filter((o: any) =>
    new Date(o.createdAt) >= todayStart
  ).length

  // Get new customers (users created in last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const newCustomers = await UserModel.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  })

  // Calculate conversion rate (completed orders / total orders)
  const completedOrders = orders.filter(
    (o: any) => o.status === ORDER_STATUS.COMPLETED
  ).length
  const conversionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0

  // Calculate changes (mock for now - would need historical data)
  const response = {
    message: 'Lấy thống kê tổng quan thành công',
    data: {
      totalRevenue,
      todayOrders,
      newCustomers,
      conversionRate: Math.round(conversionRate * 100) / 100,
      revenueChange: '+12.5%', // Would calculate from previous period
      ordersChange: todayOrders > 0 ? `+${todayOrders}` : '0',
      customersChange: newCustomers > 0 ? `+${newCustomers}` : '0',
      conversionChange: '+2.3%', // Would calculate from previous period
      // Additional useful data
      totalProducts,
      totalUsers: totalUsers.length,
      totalOrders,
    },
  }
  return responseSuccess(res, response)
}

// Revenue by month (last 12 months)
export const getRevenueStats = async (req: Request, res: Response) => {
  const { period = 'month' } = req.query

  // Get orders from last 12 months
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

  const orders: any = await OrderModel.find({
    status: ORDER_STATUS.COMPLETED,
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

  orders.forEach((order: any) => {
    const date = new Date(order.createdAt)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (revenueByMonth[monthKey]) {
      revenueByMonth[monthKey].revenue += order.total
      revenueByMonth[monthKey].orders += 1
    }
  })

  const response = {
    message: 'Lấy thống kê doanh thu thành công',
    data: {
      monthly: Object.values(revenueByMonth),
    },
  }
  return responseSuccess(res, response)
}

// Top selling products
export const getTopProducts = async (req: Request, res: Response) => {
  const { limit = 10 } = req.query
  const _limit = Number(limit)

  // Get all completed orders
  const orders: any = await OrderModel.find({
    status: ORDER_STATUS.COMPLETED,
  }).lean()

  // Group by product and calculate total sold and revenue
  const productStats: any = {}

  orders.forEach((order: any) => {
    order.items.forEach((item: any) => {
      const productId = item.productId.toString()
      if (!productStats[productId]) {
        productStats[productId] = {
          productId,
          productName: item.productName,
          image: item.image,
          totalSold: 0,
          totalRevenue: 0,
        }
      }
      productStats[productId].totalSold += item.quantity
      productStats[productId].totalRevenue += item.totalPrice
    })
  })

  // Convert to array and sort by revenue
  const topProducts = Object.values(productStats)
    .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
    .slice(0, _limit)

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

  const orders = await OrderModel.find({})
    .sort({ createdAt: -1 })
    .limit(_limit)
    .lean()

  const response = {
    message: 'Lấy danh sách đơn hàng mới nhất thành công',
    data: orders.map((order: any) => ({
      _id: order._id,
      customer: order.customerName || order.customerEmail || 'Khách hàng',
      amount: order.total,
      status: order.status,
      createdAt: order.createdAt,
    })),
  }
  return responseSuccess(res, response)
}

// Category sales distribution
export const getCategoryStats = async (req: Request, res: Response) => {
  // Get all completed orders to calculate real stats
  const orders: any = await OrderModel.find({
    status: ORDER_STATUS.COMPLETED,
  }).lean()

  // Get products to map productId to category
  const allProducts = await ProductModel.find({})
    .populate('category')
    .lean()

  const productCategoryMap = new Map()
  allProducts.forEach((product: any) => {
    if (product.category) {
      productCategoryMap.set(product._id.toString(), {
        categoryId: product.category._id.toString(),
        categoryName: product.category.name,
      })
    }
  })

  // Group by category and calculate total sales
  const categoryStats: any = {}
  let totalRevenue = 0

  orders.forEach((order: any) => {
    order.items.forEach((item: any) => {
      const productCategory = productCategoryMap.get(item.productId.toString())
      if (productCategory) {
        const categoryId = productCategory.categoryId
        const categoryName = productCategory.categoryName
        const revenue = item.totalPrice

        totalRevenue += revenue

        if (!categoryStats[categoryId]) {
          categoryStats[categoryId] = {
            categoryId,
            categoryName,
            totalRevenue: 0,
            totalSold: 0
          }
        }

        categoryStats[categoryId].totalRevenue += revenue
        categoryStats[categoryId].totalSold += item.quantity
      }
    })
  })

  // Convert to array and calculate percentages
  const categoryArray = Object.values(categoryStats).map((cat: any) => ({
    label: cat.categoryName,
    value: totalRevenue > 0 ? Math.round((cat.totalRevenue / totalRevenue) * 100) : 0,
    revenue: cat.totalRevenue,
    sold: cat.totalSold,
    // Assign colors based on category (you can customize this)
    color: getCategoryColor(cat.categoryName)
  }))

  // Sort by revenue and take top categories
  const topCategories = categoryArray
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 4) // Top 4 categories

  const response = {
    message: 'Lấy thống kê danh mục thành công',
    data: topCategories,
  }
  return responseSuccess(res, response)
}

// Helper function to assign colors to categories
const getCategoryColor = (categoryName: string): string => {
  const colorMap: any = {
    'gạch ốp tường': 'from-brick to-brick/70',
    'gạch lát sàn': 'from-gold to-gold/70',
    'gạch trang trí': 'from-purple-600 to-purple-600/70',
    'gạch mosaic': 'from-blue-600 to-blue-600/70',
    'gạch ceramic': 'from-green-600 to-green-600/70'
  }

  // Convert to lowercase for matching
  const lowerName = categoryName.toLowerCase()

  // Find matching color or return default
  for (const key in colorMap) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return colorMap[key]
    }
  }

  return 'from-gray-400 to-gray-400/70' // Default color
}

// Order counts grouped by status
export const getOrderStatusCounts = async (req: Request, res: Response) => {
  const statusList = Object.values(ORDER_STATUS)

  const countPromiseList = statusList.map(async (status) => {
    const count = await OrderModel.countDocuments({ status })
    return { status, count }
  })

  const statusCountList = await Promise.all(countPromiseList)

  const totalOrders = statusCountList.reduce((sum, item) => sum + item.count, 0)

  const response = {
    message: 'Lấy thống kê trạng thái đơn hàng thành công',
    data: {
      statusCountList,
      totalOrders,
    },
  }
  return responseSuccess(res, response)
}

const statsController = {
  getOverviewStats,
  getRevenueStats,
  getTopProducts,
  getLatestOrders,
  getCategoryStats,
  getOrderStatusCounts,
}

export default statsController
