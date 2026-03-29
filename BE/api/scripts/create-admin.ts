import { connectMongoDB } from '../database/database'
import { UserModel } from '../database/models/user.model'
require('dotenv').config()

async function createAdminUser() {
  try {
    await connectMongoDB()

    console.log('🔍 Checking for existing admin user...')
    const existingAdmin = await UserModel.findOne({ roles: 'Admin' })

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', (existingAdmin as any).email)
      process.exit(0)
    }

    console.log('📝 Creating admin user...')
    const adminUser = await UserModel.create({
      email: 'admin@gachngoiviet.com',
      password: 'admin123',
      name: 'Admin',
      roles: 'Admin',
      verify: 1
    })

    console.log('✅ Admin user created successfully!')
    console.log('\nAdmin credentials:')
    console.log('  Email: admin@gachngoiviet.com')
    console.log('  Password: admin123')
    console.log('\n⚠️  Please change the password after first login!')

    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to create admin:', err)
    process.exit(1)
  }
}

createAdminUser()
