import { connectMongoDB } from '../database/database'
import { UserModel } from '../database/models/user.model'
require('dotenv').config()

async function createAdminUser() {
  try {
    await connectMongoDB()

    console.log('🔍 Checking for existing admin user...')
    const existingAdmin = await UserModel.findOne({ roles: 'Super Admin' })

    if (existingAdmin) {
      console.log('✅ Super Admin user already exists:', (existingAdmin as any).email)
      process.exit(0)
    }

    console.log('📝 Creating super admin user...')
    const adminUser = await UserModel.create({
      email: 'supperadmin@gachngoiviet.com',
      password: 'supperadmin123',
      name: 'Supper Admin',
      roles: ['Super Admin'],
      verify: 1
    })

    console.log('✅ Super Admin user created successfully!')
    console.log('\nSuper Admin credentials:')
    console.log('  Email: supperadmin@gachngoiviet.com')
    console.log('  Password: supperadmin123')
    console.log('\n⚠️  Please change the password after first login!')

    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to create admin:', err)
    process.exit(1)
  }
}

createAdminUser()
