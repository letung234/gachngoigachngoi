import { connectMongoDB } from '../database/database'
import { PostModel, POST_STATUS } from '../database/models/post.model'
import { CategoryModel } from '../database/models/category.model'
import { UserModel } from '../database/models/user.model'
require('dotenv').config()

// Sample posts data - Project posts
const postsData = [
  {
    title: 'Dự án phục dựng Nhà cổ Đường Lâm',
    content: `
      <h2>Giới thiệu dự án</h2>
      <p>Dự án phục dựng mái ngói cho ngôi nhà cổ 200 năm tuổi tại làng cổ Đường Lâm, Sơn Tây, Hà Nội. Đây là một trong những công trình tiêu biểu trong việc bảo tồn kiến trúc truyền thống Việt Nam.</p>

      <h2>Sản phẩm sử dụng</h2>
      <ul>
        <li>Ngói âm dương đỏ truyền thống</li>
        <li>Gạch xây cổ đỏ</li>
        <li>Gạch trang trí hoa sen</li>
      </ul>

      <h2>Thách thức</h2>
      <p>Việc phục dựng ngôi nhà cổ đòi hỏi sự tỉ mỉ và am hiểu sâu về kiến trúc truyền thống. Chúng tôi đã nghiên cứu kỹ lưỡng các tài liệu lịch sử và làm việc chặt chẽ với các nghệ nhân để đảm bảo tính xác thực của công trình.</p>

      <h2>Kết quả</h2>
      <p>Ngôi nhà được phục dựng hoàn hảo, giữ nguyên được nét đẹp kiến trúc truyền thống. Dự án đã nhận được sự đánh giá cao từ Sở Văn hóa và Du lịch Hà Nội.</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
    categoryName: 'Dự án',
    status: POST_STATUS.PUBLISHED
  },
  {
    title: 'Resort An Lâm Retreats Ninh Bình',
    content: `
      <h2>Tổng quan dự án</h2>
      <p>Cung cấp toàn bộ vật liệu mái ngói cho khu nghỉ dưỡng cao cấp An Lâm Retreats tại Ninh Bình. Dự án kết hợp hoàn hảo giữa kiến trúc hiện đại với vật liệu truyền thống.</p>

      <h2>Phạm vi công việc</h2>
      <ul>
        <li>Thiết kế và tư vấn giải pháp mái ngói</li>
        <li>Cung cấp 15,000 viên ngói mũi hài men</li>
        <li>Cung cấp 8,000 viên gạch lát sân</li>
        <li>Hỗ trợ kỹ thuật thi công</li>
      </ul>

      <h2>Đặc điểm nổi bật</h2>
      <p>Sử dụng ngói mũi hài men cao cấp với khả năng chống thấm tuyệt vời, phù hợp với khí hậu ẩm ướt của Ninh Bình. Màu sắc hài hòa với cảnh quan thiên nhiên xung quanh.</p>

      <h2>Đánh giá</h2>
      <p>Resort đã khai trương thành công và trở thành một trong những điểm đến được yêu thích nhất tại Ninh Bình. Mái ngói truyền thống góp phần tạo nên bản sắc riêng cho công trình.</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    categoryName: 'Dự án',
    status: POST_STATUS.PUBLISHED
  },
  {
    title: 'Tham gia dự án mở rộng Chùa Bái Đính',
    content: `
      <h2>Về dự án</h2>
      <p>Tham gia dự án mở rộng quần thể chùa Bái Đính - ngôi chùa lớn nhất Việt Nam, cung cấp ngói mũi hài cao cấp cho các công trình phụ trong khuôn viên chùa.</p>

      <h2>Quy mô dự án</h2>
      <ul>
        <li>Diện tích mái: 2,500m²</li>
        <li>Số lượng ngói: 25,000 viên</li>
        <li>Thời gian thi công: 6 tháng</li>
        <li>Giá trị hợp đồng: Liên hệ</li>
      </ul>

      <h2>Yêu cầu kỹ thuật</h2>
      <p>Dự án yêu cầu ngói phải đạt tiêu chuẩn cao về độ bền, màu sắc và kích thước. Chúng tôi đã sản xuất ngói theo đúng mẫu cổ, đảm bảo tính đồng nhất với các công trình chính.</p>

      <h2>Ý nghĩa</h2>
      <p>Được tham gia vào dự án này là niềm vinh dự lớn của chúng tôi. Đây không chỉ là công trình kiến trúc mà còn là biểu tượng tâm linh quan trọng của đất nước.</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    categoryName: 'Dự án',
    status: POST_STATUS.PUBLISHED
  },
  {
    title: 'Biệt thự Vinhomes Riverside phong cách Á Đông',
    content: `
      <h2>Giới thiệu</h2>
      <p>Thiết kế và cung cấp giải pháp mái ngói cho căn biệt thự phong cách Á Đông tại khu đô thị Vinhomes Riverside, Long Biên, Hà Nội.</p>

      <h2>Concept thiết kế</h2>
      <p>Biệt thự được thiết kế theo phong cách Á Đông hiện đại, kết hợp giữa nét đẹp truyền thống và tiện nghi đương đại. Mái ngói âm dương màu nâu tạo điểm nhấn ấn tượng cho tổng thể công trình.</p>

      <h2>Sản phẩm chính</h2>
      <ul>
        <li>Ngói âm dương nâu: 3,500 viên</li>
        <li>Gạch trang trí hình học: 200 viên</li>
        <li>Gạch lát sân chữ nhật: 1,500 viên</li>
      </ul>

      <h2>Đặc điểm</h2>
      <p>Ngói âm dương màu nâu đất tạo cảm giác ấm áp, gần gũi. Sản phẩm có độ bền cao, chống thấm tốt và dễ dàng bảo trì.</p>

      <h2>Phản hồi từ chủ đầu tư</h2>
      <p>"Chúng tôi rất hài lòng với chất lượng sản phẩm và dịch vụ của Gạch Ngói Việt. Mái ngói đã góp phần làm nên vẻ đẹp độc đáo cho ngôi nhà của chúng tôi." - Anh Nguyễn Văn A, Chủ nhà</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    categoryName: 'Dự án',
    status: POST_STATUS.PUBLISHED
  },
  {
    title: 'Cải tạo Nhà hàng Quán Ăn Ngon phong cách làng quê',
    content: `
      <h2>Tổng quan</h2>
      <p>Dự án cải tạo và phục dựng không gian nhà hàng Quán Ăn Ngon tại Phan Bội Châu, Hà Nội với phong cách làng quê Việt Nam, sử dụng gạch ngói truyền thống.</p>

      <h2>Concept</h2>
      <p>Tái hiện không gian làng quê Việt Nam xưa với mái ngói âm dương, sân gạch lát thô và các chi tiết trang trí truyền thống.</p>

      <h2>Vật liệu sử dụng</h2>
      <ul>
        <li>Ngói âm dương đỏ: 2,000 viên</li>
        <li>Gạch lát sân vuông: 3,000 viên</li>
        <li>Gạch xây cổ đỏ: 5,000 viên</li>
        <li>Gạch trang trí hoa văn: 150 viên</li>
      </ul>

      <h2>Quá trình thi công</h2>
      <p>Dự án được thực hiện trong thời gian 3 tháng với sự phối hợp chặt chẽ giữa đội ngũ kiến trúc sư, nghệ nhân và đội thi công. Mọi chi tiết đều được chăm chút tỉ mỉ để tạo nên không gian hoàn hảo.</p>

      <h2>Kết quả</h2>
      <p>Nhà hàng sau khi hoàn thành đã thu hút đông đảo thực khách nhờ không gian độc đáo, mang đậm nét văn hóa Việt Nam. Mái ngói và sân gạch cổ là điểm nhấn chính tạo nên sự khác biệt.</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    categoryName: 'Dự án',
    status: POST_STATUS.PUBLISHED
  },
  {
    title: 'Trùng tu Đền thờ Vua Đinh Tiên Hoàng',
    content: `
      <h2>Giới thiệu dự án</h2>
      <p>Tham gia dự án trùng tu đền thờ Vua Đinh Tiên Hoàng tại Ninh Bình, cung cấp ngói mũi hài theo đúng mẫu cổ để phục dựng các công trình trong khu di tích.</p>

      <h2>Ý nghĩa lịch sử</h2>
      <p>Đền thờ Vua Đinh là di tích lịch sử quốc gia đặc biệt quan trọng. Việc trùng tu cần đảm bảo tính xác thực về lịch sử và nghệ thuật.</p>

      <h2>Nghiên cứu và phục dựng</h2>
      <p>Đội ngũ của chúng tôi đã nghiên cứu kỹ các tài liệu lịch sử, hình ảnh cũ và làm việc với các chuyên gia để tái tạo ngói mũi hài đúng với nguyên bản.</p>

      <h2>Sản phẩm cung cấp</h2>
      <ul>
        <li>Ngói mũi hài cổ: 8,000 viên</li>
        <li>Gạch xây cổ vàng: 10,000 viên</li>
        <li>Gạch trang trí rồng phượng: 300 viên</li>
      </ul>

      <h2>Kỹ thuật sản xuất</h2>
      <p>Sử dụng kỹ thuật nung truyền thống để tạo ra màu sắc và độ bền đặc trưng. Mỗi viên ngói đều được kiểm tra kỹ lưỡng trước khi xuất xưởng.</p>

      <h2>Hoàn thành</h2>
      <p>Dự án hoàn thành đúng tiến độ và đạt chất lượng cao. Di tích sau khi trùng tu đã được công nhận và đón hàng nghìn lượt khách tham quan mỗi năm.</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    categoryName: 'Dự án',
    status: POST_STATUS.PUBLISHED
  },
  {
    title: 'Khu villa cao cấp Ecopark Grand',
    content: `
      <h2>Thông tin dự án</h2>
      <p>Cung cấp vật liệu gạch ngói cho 15 căn villa cao cấp tại khu đô thị Ecopark, Hưng Yên. Dự án với tổng diện tích mái 4,500m².</p>

      <h2>Yêu cầu</h2>
      <p>Chủ đầu tư yêu cầu sản phẩm phải đảm bảo tính thẩm mỹ cao, độ bền tối thiểu 30 năm và phù hợp với phong cách kiến trúc hiện đại kết hợp truyền thống.</p>

      <h2>Giải pháp</h2>
      <p>Chúng tôi đề xuất sử dụng ngói mũi hài men cao cấp cho mái chính, kết hợp gạch lát sân và gạch trang trí cho các khu vực sân vườn.</p>

      <h2>Số liệu</h2>
      <ul>
        <li>Tổng số villa: 15 căn</li>
        <li>Diện tích mái trung bình: 300m²/căn</li>
        <li>Ngói mũi hài men: 45,000 viên</li>
        <li>Gạch lát sân: 20,000 viên</li>
        <li>Thời gian hoàn thành: 8 tháng</li>
      </ul>

      <h2>Đánh giá</h2>
      <p>Dự án nhận được đánh giá cao từ chủ đầu tư và cư dân. Sản phẩm vượt mong đợi về chất lượng và thẩm mỹ.</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    categoryName: 'Dự án',
    status: POST_STATUS.PUBLISHED
  },
  {
    title: 'Homestay truyền thống Sa Pa',
    content: `
      <h2>Dự án</h2>
      <p>Xây dựng 5 căn homestay phong cách truyền thống tại Sa Pa, Lào Cai sử dụng gạch ngói và gỗ làm vật liệu chính.</p>

      <h2>Thách thức</h2>
      <p>Khí hậu lạnh và độ ẩm cao tại Sa Pa đặt ra yêu cầu khắt khe về chất lượng vật liệu. Sản phẩm cần có khả năng chịu đựng mưa, sương mù và nhiệt độ thấp.</p>

      <h2>Giải pháp kỹ thuật</h2>
      <ul>
        <li>Sử dụng ngói âm dương đỏ có độ hút nước thấp</li>
        <li>Xử lý chống rêu bề mặt</li>
        <li>Tăng cường độ dày lớp men bảo vệ</li>
      </ul>

      <h2>Sản phẩm</h2>
      <p>Cung cấp 8,000 viên ngói âm dương đỏ đặc biệt và 5,000 viên gạch lát sân chống trơn.</p>

      <h2>Kết quả</h2>
      <p>Sau 2 năm đưa vào sử dụng, sản phẩm vẫn giữ được chất lượng tốt. Homestay trở thành điểm đến được yêu thích nhờ kiến trúc độc đáo.</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800',
    categoryName: 'Dự án',
    status: POST_STATUS.PUBLISHED
  },
  {
    title: 'Khu du lịch sinh thái Cúc Phương',
    content: `
      <h2>Tổng quan</h2>
      <p>Cung cấp gạch ngói cho khu du lịch sinh thái Cúc Phương với 20 bungalow và khu nhà hàng chính, tổng diện tích 6,000m².</p>

      <h2>Concept thiết kế</h2>
      <p>Hòa mình vào thiên nhiên với vật liệu thân thiện môi trường, tạo sự kết nối giữa con người và cảnh quan rừng núi.</p>

      <h2>Vật liệu</h2>
      <ul>
        <li>Ngói âm dương màu nâu đất: 35,000 viên</li>
        <li>Gạch lát sân tự nhiên: 15,000 viên</li>
        <li>Gạch trang trí thổ cẩm: 500 viên</li>
      </ul>

      <h2>Bảo vệ môi trường</h2>
      <p>Toàn bộ sản phẩm được sản xuất từ nguyên liệu tự nhiên, không gây hại môi trường. Quy trình sản xuất tuân thủ tiêu chuẩn xanh.</p>

      <h2>Đặc điểm nổi bật</h2>
      <p>Màu sắc hòa quyện với rừng cây, tạo cảm giác yên bình, thư thái cho du khách. Độ bền cao, phù hợp với điều kiện khí hậu ẩm ướt.</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?w=800',
    categoryName: 'Dự án',
    status: POST_STATUS.PUBLISHED
  },
  {
    title: 'Quán cà phê sân vườn phong cách Huế',
    content: `
      <h2>Giới thiệu</h2>
      <p>Thiết kế và thi công quán cà phê sân vườn tại Huế với phong cách truyền thống cố đô, sử dụng gạch ngói vàng đặc trưng của xứ Huế.</p>

      <h2>Không gian</h2>
      <p>Quán có diện tích 500m² với sân vườn rộng, ao sen và các tiểu cảnh truyền thống. Mái ngói và sân gạch cổ tạo nên nét đẹp cổ kính, thanh thoát.</p>

      <h2>Sản phẩm sử dụng</h2>
      <ul>
        <li>Gạch xây cổ vàng: 8,000 viên</li>
        <li>Ngói mũi hài men vàng: 2,500 viên</li>
        <li>Gạch lát sân cổ: 4,000 viên</li>
        <li>Gạch trang trí hoa văn Huế: 200 viên</li>
      </ul>

      <h2>Điểm đặc biệt</h2>
      <p>Màu vàng đặc trưng của gạch ngói Huế được tái tạo chân thực, tạo nên bản sắc riêng cho công trình. Sản phẩm được sản xuất bằng kỹ thuật truyền thống kết hợp công nghệ hiện đại.</p>

      <h2>Phản hồi</h2>
      <p>Quán cà phê đã trở thành điểm check-in nổi tiếng tại Huế, thu hút đông đảo du khách trong và ngoài nước.</p>
    `,
    thumbnail: 'https://images.unsplash.com/photo-1501959915551-4e8d30928317?w=800',
    categoryName: 'Dự án',
    status: POST_STATUS.PUBLISHED
  }
]

async function seedPosts() {
  try {
    await connectMongoDB()

    console.log('🗑️  Clearing existing posts...')
    await PostModel.deleteMany({})

    // Get or create default category for projects
    console.log('🔍 Finding or creating project category...')
    let projectCategory = await CategoryModel.findOne({ name: 'Dự án' })

    if (!projectCategory) {
      projectCategory = await CategoryModel.create({
        name: 'Dự án',
        slug: 'du-an',
        order: 10
      })
      console.log('✅ Created project category')
    } else {
      console.log('✅ Found existing project category')
    }

    // Get first admin user as author
    console.log('🔍 Finding admin user...')
    const adminUser: any = await UserModel.findOne({ roles: 'Admin' })

    if (!adminUser) {
      console.error('❌ No admin user found. Please create an admin user first.')
      process.exit(1)
    }
    console.log(`✅ Found admin user: ${adminUser.email}`)

    // Prepare posts with category and author
    console.log('📝 Preparing posts data...')

    // Insert posts one by one to trigger pre-save hook for slug generation
    console.log('📦 Inserting posts...')
    const insertedPosts: any[] = []

    for (const post of postsData) {
      const newPost = await PostModel.create({
        title: post.title,
        content: post.content,
        thumbnail: post.thumbnail,
        category: (projectCategory as any)._id,
        author: adminUser._id,
        status: post.status,
        views: Math.floor(Math.random() * 500) + 100 // Random views between 100-600
      })
      insertedPosts.push(newPost)
      console.log(`  ✓ Created: ${post.title}`)
    }

    console.log(`✅ Inserted ${insertedPosts.length} posts`)

    console.log('\n📊 Summary:')
    console.log(`Category: ${(projectCategory as any).name} (${(projectCategory as any).slug})`)
    console.log(`Author: ${adminUser.email}`)
    console.log(`\nPosts:`)
    insertedPosts.forEach((post: any) => {
      console.log(`  - ${post.title} [${post.status}] - ${post.views} views`)
    })

    console.log('\n🎉 Posts seed completed successfully!')
    console.log('\n💡 You can now view posts at:')
    console.log('   - Admin: http://localhost:3000/admin/posts')
    console.log('   - Public: http://localhost:3000/du-an')

    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  }
}

seedPosts()
