import { connectMongoDB } from '../database/database'
import { UserModel } from '../database/models/user.model'
import { ROLE } from '../constants/role.enum'
require('dotenv').config()

async function createAdmin() {
  await connectMongoDB()

  const adminEmail = 'admin@demo.com'

  // Update user to Super Admin
  const result = await UserModel.findOneAndUpdate(
    { email: adminEmail },
    { roles: [ROLE.SUPER_ADMIN] },
    { new: true }
  ).select({ password: 0, __v: 0 }).lean()

  if (result) {
    console.log('✅ User updated to Super Admin:')
    console.log(result)
  } else {
    console.log('❌ User not found')
  }

  process.exit(0)
}

createAdmin().catch(console.error)
