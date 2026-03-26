import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

const projects = [
  {
    id: 1,
    title: 'Nhà cổ Đường Lâm',
    category: 'Nhà cổ',
    location: 'Sơn Tây, Hà Nội',
    year: '2023',
    description: 'Phục dựng mái ngói cho ngôi nhà cổ 200 năm tuổi tại làng cổ Đường Lâm, sử dụng ngói âm dương truyền thống.',
    products: ['Ngói âm dương đỏ', 'Gạch xây cổ'],
    image: '/images/projects/nha-co.jpg'
  },
  {
    id: 2,
    title: 'Resort An Lâm Retreats',
    category: 'Resort',
    location: 'Ninh Bình',
    year: '2022',
    description: 'Cung cấp toàn bộ vật liệu mái ngói cho khu nghỉ dưỡng cao cấp, kết hợp kiến trúc hiện đại với vật liệu truyền thống.',
    products: ['Ngói mũi hài men', 'Gạch lát sân'],
    image: '/images/projects/resort.jpg'
  },
  {
    id: 3,
    title: 'Chùa Bái Đính',
    category: 'Chùa',
    location: 'Ninh Bình',
    year: '2021',
    description: 'Tham gia dự án mở rộng quần thể chùa Bái Đính, cung cấp ngói mũi hài cao cấp cho các công trình phụ.',
    products: ['Ngói mũi hài cổ', 'Gạch trang trí hoa sen'],
    image: '/images/projects/chua.jpg'
  },
  {
    id: 4,
    title: 'Biệt thự Vinhomes Riverside',
    category: 'Biệt thự',
    location: 'Long Biên, Hà Nội',
    year: '2023',
    description: 'Thiết kế và cung cấp giải pháp mái ngói cho căn biệt thự phong cách Á Đông trong khu đô thị Vinhomes.',
    products: ['Ngói âm dương nâu', 'Gạch trang trí'],
    image: '/images/projects/biet-thu.jpg'
  },
  {
    id: 5,
    title: 'Nhà hàng Quán Ăn Ngon',
    category: 'Nhà hàng',
    location: 'Phan Bội Châu, Hà Nội',
    year: '2022',
    description: 'Cải tạo và phục dựng không gian nhà hàng với phong cách làng quê Việt Nam, sử dụng gạch ngói truyền thống.',
    products: ['Ngói âm dương', 'Gạch lát sân vuông'],
    image: '/images/projects/nha-co.jpg'
  },
  {
    id: 6,
    title: 'Đền thờ Vua Đinh',
    category: 'Di tích',
    location: 'Ninh Bình',
    year: '2021',
    description: 'Tham gia dự án trùng tu đền thờ Vua Đinh, cung cấp ngói mũi hài theo đúng mẫu cổ.',
    products: ['Ngói mũi hài cổ', 'Gạch xây cổ vàng'],
    image: '/images/projects/chua.jpg'
  }
]

const categories = ['Tất cả', 'Nhà cổ', 'Resort', 'Chùa', 'Biệt thự', 'Nhà hàng', 'Di tích']

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

export default function Projects() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Dự án tiêu biểu | Gạch Ngói Việt</title>
        <meta
          name='description'
          content='Các dự án tiêu biểu sử dụng sản phẩm gạch ngói truyền thống của Gạch Ngói Việt. Đình chùa, nhà cổ, resort, biệt thự.'
        />
      </Helmet>

      {/* Hero Banner */}
      <section className='relative bg-earth-dark pt-32 pb-20'>
        <div className='absolute inset-0 opacity-20'>
          <img src='/images/hero-bg.jpg' alt='' className='h-full w-full object-cover' />
        </div>
        <div className='container relative'>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center'>
            <span className='mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-gold'>
              Dự án tiêu biểu
            </span>
            <h1 className='mb-4 font-serif text-4xl font-bold text-cream-light md:text-5xl'>Công trình đã thực hiện</h1>
            <p className='mx-auto max-w-2xl text-lg text-cream-light/70'>
              Những dự án tiêu biểu mà chúng tôi vinh dự được đồng hành cùng các kiến trúc sư và nhà thầu
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className='bg-cream-light py-16'>
        <div className='container'>
          {/* Filter */}
          <div className='mb-12'>
            <div className='flex flex-wrap justify-center gap-3'>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                    cat === 'Tất cả' ? 'bg-brick text-cream-light' : 'bg-cream text-earth hover:bg-cream-dark'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects */}
          <motion.div
            variants={staggerContainer}
            initial='hidden'
            animate='visible'
            className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'
          >
            {projects.map((project) => (
              <motion.article
                key={project.id}
                variants={fadeInUp}
                className='group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover-lift'
              >
                {/* Image */}
                <div className='img-zoom relative aspect-[4/3]'>
                  <img src={project.image} alt={project.title} className='h-full w-full object-cover' />
                  <div className='absolute inset-0 bg-gradient-to-t from-earth-dark/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
                  <span className='absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-earth-dark'>
                    {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className='p-6'>
                  <div className='mb-3 flex items-center gap-4 text-sm text-earth/60'>
                    <span className='flex items-center gap-1'>
                      <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                      {project.location}
                    </span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className='mb-3 font-serif text-xl font-semibold text-earth-dark group-hover:text-brick'>
                    {project.title}
                  </h3>

                  <p className='mb-4 text-sm text-earth/70 line-clamp-3'>{project.description}</p>

                  {/* Products Used */}
                  <div className='flex flex-wrap gap-2'>
                    {project.products.map((product, index) => (
                      <span key={index} className='rounded-full bg-cream px-3 py-1 text-xs text-earth/80'>
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-earth-dark py-16'>
        <div className='container'>
          <div className='grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='rounded-2xl bg-earth/30 p-8'
            >
              <div className='mb-2 font-serif text-5xl font-bold text-gold'>30+</div>
              <div className='text-cream-light/70'>Năm kinh nghiệm</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='rounded-2xl bg-earth/30 p-8'
            >
              <div className='mb-2 font-serif text-5xl font-bold text-gold'>500+</div>
              <div className='text-cream-light/70'>Dự án hoàn thành</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className='rounded-2xl bg-earth/30 p-8'
            >
              <div className='mb-2 font-serif text-5xl font-bold text-gold'>50+</div>
              <div className='text-cream-light/70'>Nghệ nhân lành nghề</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className='rounded-2xl bg-earth/30 p-8'
            >
              <div className='mb-2 font-serif text-5xl font-bold text-gold'>100%</div>
              <div className='text-cream-light/70'>Khách hàng hài lòng</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-brick py-16'>
        <div className='container'>
          <div className='flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left'>
            <div>
              <h2 className='mb-2 font-serif text-2xl font-bold text-cream-light md:text-3xl'>
                Bạn có dự án cần tư vấn?
              </h2>
              <p className='text-cream-light/80'>Liên hệ ngay để nhận báo giá và tư vấn miễn phí từ chuyên gia</p>
            </div>
            <a
              href='/lien-he'
              className='inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-4 font-semibold text-earth-dark transition-all hover:bg-gold-light hover:scale-105'
            >
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
