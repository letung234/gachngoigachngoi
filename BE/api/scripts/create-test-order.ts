import { connectMongoDB } from '../database/database'
import { OrderModel, ORDER_STATUS } from '../database/models/order.model'
import { UserModel } from '../database/models/user.model'
import { ProductModel } from '../database/models/product.model'
import { CategoryModel } from '../database/models/category.model'
require('dotenv').config()

const createTestOrder = async () => {
  try {
    await connectMongoDB()

    console.log('🔍 Creating test order...')

    // Get first user and product for test order
    const user = await UserModel.findOne({})
    const product = await ProductModel.findOne({})

    if (!user || !product) {
      console.log('❌ Need at least 1 user and 1 product in database')
      process.exit(1)
    }

    // Cast to any to avoid TypeScript issues
    const userData = user as any
    const productData = product as any

    const testOrder = await OrderModel.create({
      customerName: userData.name || 'Test Customer',
      customerEmail: userData.email,
      phone: '0123456789',
      address: '123 Test Street, Test City',
      items: [{
        productId: productData._id,
        productName: productData.name,
        quantity: 2,
        price: productData.price,
        totalPrice: productData.price * 2,
        image: productData.image
      }],
      subtotal: productData.price * 2,
      shippingCost: 30000,
      total: productData.price * 2 + 30000,
      status: ORDER_STATUS.COMPLETED,
      notes: 'Test order for statistics',
      createdBy: userData._id
    })

    const orderData = testOrder as any
    console.log('✅ Test order created successfully!')
    console.log(`📋 Order ID: ${orderData._id}`)
    console.log(`👤 Customer: ${orderData.customerName}`)
    console.log(`💰 Total: ${orderData.total.toLocaleString()}₫`)
    console.log(`📦 Status: ${orderData.status}`)

    // Verify order exists
    const orderCount = await OrderModel.countDocuments()
    console.log(`\n📊 Total orders in database: ${orderCount}`)

    console.log('\n🎉 Done! Now dashboard should show real order data.')

    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to create test order:', err)
    process.exit(1)
  }
}

createTestOrder()