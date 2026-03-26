import { connectMongoDB } from '../database/database'
import { CategoryModel } from '../database/models/category.model'
import { ProductModel } from '../database/models/product.model'
require('dotenv').config()

// Categories data
const categories = [
  { name: 'Ngói âm dương', slug: 'ngoi-am-duong', order: 1 },
  { name: 'Ngói mũi hài', slug: 'ngoi-mui-hai', order: 2 },
  { name: 'Gạch lát sân', slug: 'gach-lat-san', order: 3 },
  { name: 'Gạch xây cổ', slug: 'gach-xay-co', order: 4 },
  { name: 'Gạch trang trí', slug: 'gach-trang-tri', order: 5 }
]

// Products data (will be linked to categories after insert)
const products = [
  {
    name: 'Ngói âm dương đỏ',
    categorySlug: 'ngoi-am-duong',
    description: 'Ngói âm dương truyền thống, màu đỏ gạch tự nhiên',
    price: 0, // Liên hệ
    specs: { size: '20x30cm', material: 'Đất sét nung', color: 'Đỏ gạch' },
    image: '/images/products/ngoi-am-duong.jpg',
    featured: true,
    quantity: 1000
  },
  {
    name: 'Ngói âm dương nâu',
    categorySlug: 'ngoi-am-duong',
    description: 'Ngói âm dương màu nâu đất, phù hợp kiến trúc cổ',
    price: 0,
    specs: { size: '20x30cm', material: 'Đất sét nung', color: 'Nâu đất' },
    image: '/images/products/ngoi-am-duong.jpg',
    featured: false,
    quantity: 1000
  },
  {
    name: 'Ngói mũi hài cổ',
    categorySlug: 'ngoi-mui-hai',
    description: 'Ngói mũi hài cong mềm mại, dùng cho đình chùa',
    price: 0,
    specs: { size: '25x35cm', material: 'Đất sét nung', color: 'Đỏ gạch' },
    image: '/images/products/ngoi-mui-hai.jpg',
    featured: true,
    quantity: 800
  },
  {
    name: 'Ngói mũi hài men',
    categorySlug: 'ngoi-mui-hai',
    description: 'Ngói mũi hài phủ men bóng, chống thấm tốt',
    price: 0,
    specs: { size: '25x35cm', material: 'Đất sét nung + Men', color: 'Đỏ bóng' },
    image: '/images/products/ngoi-mui-hai.jpg',
    featured: false,
    quantity: 600
  },
  {
    name: 'Gạch lát sân vuông',
    categorySlug: 'gach-lat-san',
    description: 'Gạch lát sân hình vuông, bề mặt nhám chống trơn',
    price: 0,
    specs: { size: '30x30cm', material: 'Đất sét nung', color: 'Đỏ gạch' },
    image: '/images/products/gach-lat-san.jpg',
    featured: true,
    quantity: 2000
  },
  {
    name: 'Gạch lát sân chữ nhật',
    categorySlug: 'gach-lat-san',
    description: 'Gạch lát sân hình chữ nhật, dễ lắp đặt',
    price: 0,
    specs: { size: '20x40cm', material: 'Đất sét nung', color: 'Nâu đỏ' },
    image: '/images/products/gach-lat-san.jpg',
    featured: false,
    quantity: 1500
  },
  {
    name: 'Gạch xây cổ đỏ',
    categorySlug: 'gach-xay-co',
    description: 'Gạch xây theo phong cách cổ, độ bền cao',
    price: 0,
    specs: { size: '10x20x5cm', material: 'Đất sét nung', color: 'Đỏ gạch' },
    image: '/images/products/gach-xay-co.jpg',
    featured: true,
    quantity: 5000
  },
  {
    name: 'Gạch xây cổ vàng',
    categorySlug: 'gach-xay-co',
    description: 'Gạch xây màu vàng đất, phong cách Huế',
    price: 0,
    specs: { size: '10x20x5cm', material: 'Đất sét nung', color: 'Vàng đất' },
    image: '/images/products/gach-xay-co.jpg',
    featured: false,
    quantity: 3000
  },
  {
    name: 'Gạch trang trí hoa sen',
    categorySlug: 'gach-trang-tri',
    description: 'Gạch trang trí họa tiết hoa sen, tinh xảo',
    price: 0,
    specs: { size: '20x20cm', material: 'Đất sét chạm khắc', color: 'Đỏ gạch' },
    image: '/images/products/gach-trang-tri.jpg',
    featured: true,
    quantity: 500
  },
  {
    name: 'Gạch trang trí hình học',
    categorySlug: 'gach-trang-tri',
    description: 'Gạch trang trí hoa văn hình học truyền thống',
    price: 0,
    specs: { size: '20x20cm', material: 'Đất sét chạm khắc', color: 'Nâu đỏ' },
    image: '/images/products/gach-trang-tri.jpg',
    featured: false,
    quantity: 500
  }
]

async function seedData() {
  await connectMongoDB()

  console.log('🗑️  Clearing existing data...')
  await CategoryModel.deleteMany({})
  await ProductModel.deleteMany({})

  console.log('📁 Seeding categories...')
  const insertedCategories = await CategoryModel.insertMany(categories as any[])
  console.log(`✅ Inserted ${insertedCategories.length} categories`)

  // Create category slug -> id map
  const categoryMap: Record<string, string> = {}
  insertedCategories.forEach((cat: any) => {
    categoryMap[cat.slug] = cat._id.toString()
  })

  console.log('📦 Seeding products...')
  const productsWithCategory = products.map((product) => ({
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    images: [product.image],
    category: categoryMap[product.categorySlug],
    specs: product.specs,
    featured: product.featured,
    quantity: product.quantity,
    sold: 0,
    view: 0,
    rating: 0
  }))

  const insertedProducts = await ProductModel.insertMany(productsWithCategory as any[])
  console.log(`✅ Inserted ${insertedProducts.length} products`)

  console.log('\n📊 Summary:')
  console.log('Categories:')
  insertedCategories.forEach((cat: any) => {
    console.log(`  - ${cat.name} (${cat.slug})`)
  })

  console.log('\nProducts:')
  insertedProducts.forEach((prod: any) => {
    console.log(`  - ${prod.name} [${prod.featured ? '⭐ Featured' : 'Normal'}]`)
  })

  console.log('\n🎉 Seed completed successfully!')
  process.exit(0)
}

seedData().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
