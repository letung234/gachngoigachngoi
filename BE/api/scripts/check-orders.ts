import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { OrderModel } from '../database/models/order.model'

dotenv.config()

async function checkOrders() {
  try {
    await mongoose.connect(process.env.DB_URL!)

    const orders = await OrderModel.find().limit(3).sort({ createdAt: -1 })

    console.log('Recent orders:')
    orders.forEach((order: any, i) => {
      console.log(`${i+1}. Order ID: ${order._id}`)
      console.log(`   Customer: ${order.customerName}`)
      console.log(`   Items: ${order.items?.length || 0} products`)
      console.log(`   Total: ₫${order.total.toLocaleString()}`)
      console.log('   Items details:')
      order.items?.forEach(item => {
        console.log(`   - ${item.productName} (x${item.quantity})`)
      })
      console.log('')
    })

    process.exit(0)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

checkOrders()