import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

// Product categories data
const categories = [
  {
    id: 1,
    name: 'Ngói âm dương',
    description: 'Loại ngói truyền thống với thiết kế độc đáo, tạo nên mái nhà bền vững',
    image: '/images/products/ngoi-am-duong.jpg',
    path: '/san-pham/ngoi-am-duong'
  },
  {
    id: 2,
    name: 'Ngói mũi hài',
    description: 'Ngói cong mềm mại, thường dùng cho đình chùa, nhà cổ',
    image: '/images/products/ngoi-mui-hai.jpg',
    path: '/san-pham/ngoi-mui-hai'
  },
  {
    id: 3,
    name: 'Gạch lát sân',
    description: 'Gạch terracotta lát sân vườn, bền đẹp qua thời gian',
    image: '/images/products/gach-lat-san.jpg',
    path: '/san-pham/gach-lat-san'
  },
  {
    id: 4,
    name: 'Gạch xây cổ',
    description: 'Gạch xây dựng theo phong cách truyền thống, chắc khỏe',
    image: '/images/products/gach-xay-co.jpg',
    path: '/san-pham/gach-xay-co'
  },
  {
    id: 5,
    name: 'Gạch trang trí',
    description: 'Gạch hoa văn trang trí, điểm nhấn cho công trình',
    image: '/images/products/gach-trang-tri.jpg',
    path: '/san-pham/gach-trang-tri'
  }
]

// Process steps
const processSteps = [
  {
    step: 1,
    title: 'Chọn đất',
    description: 'Lựa chọn đất sét chất lượng cao từ vùng nguyên liệu truyền thống',
    image: '/images/process/chon-dat.jpg'
  },
  {
    step: 2,
    title: 'Nhào đất',
    description: 'Nhào trộn đất sét với nước theo tỷ lệ chuẩn của làng nghề',
    image: '/images/process/nhao-dat.jpg'
  },
  {
    step: 3,
    title: 'Tạo hình',
    description: 'Nghệ nhân tạo hình thủ công từng viên gạch ngói',
    image: '/images/process/tao-hinh.jpg'
  },
  {
    step: 4,
    title: 'Phơi khô',
    description: 'Phơi sản phẩm dưới ánh nắng tự nhiên trong nhiều ngày',
    image: '/images/process/phoi-kho.jpg'
  },
  {
    step: 5,
    title: 'Nung lò',
    description: 'Nung trong lò truyền thống ở nhiệt độ cao để tạo độ bền',
    image: '/images/process/nung-lo.jpg'
  }
]

// Projects
const projects = [
  {
    id: 1,
    title: 'Nhà cổ Đường Lâm',
    category: 'Nhà cổ',
    image: '/images/projects/nha-co.jpg'
  },
  {
    id: 2,
    title: 'Resort An Lâm',
    category: 'Resort',
    image: '/images/projects/resort.jpg'
  },
  {
    id: 3,
    title: 'Chùa Bái Đính',
    category: 'Chùa',
    image: '/images/projects/chua.jpg'
  },
  {
    id: 4,
    title: 'Biệt thự Vinhomes',
    category: 'Biệt thự',
    image: '/images/projects/biet-thu.jpg'
  }
]

// Testimonials
const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn Minh',
    role: 'Kiến trúc sư',
    content: 'Chất lượng gạch ngói rất tốt, màu sắc đẹp và đồng đều. Tôi đã sử dụng cho nhiều dự án nhà cổ phục dựng.',
    avatar: 'NM'
  },
  {
    id: 2,
    name: 'Trần Thị Hoa',
    role: 'Chủ resort',
    content: 'Sản phẩm mang đậm bản sắc Việt, khách hàng quốc tế rất thích. Đội ngũ tư vấn nhiệt tình và chuyên nghiệp.',
    avatar: 'TH'
  },
  {
    id: 3,
    name: 'Lê Đức Anh',
    role: 'Nhà thầu xây dựng',
    content: 'Gạch ngói bền, chắc, chịu được thời tiết khắc nghiệt. Giá cả hợp lý, giao hàng đúng hẹn.',
    avatar: 'LA'
  }
]

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

// Animated Section Component
function AnimatedSection({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Gạch Ngói Truyền Thống Việt Nam | Tinh Hoa Làng Nghề</title>
        <meta
          name='description'
          content='Chuyên sản xuất và cung cấp gạch ngói truyền thống Việt Nam. Ngói âm dương, ngói mũi hài, gạch lát sân - Sản xuất thủ công, bền vững theo thời gian.'
        />
      </Helmet>

      {/* Hero Section */}
      <section className='relative min-h-screen'>
        <div className='absolute inset-0'>
          <img
            src='/images/hero-bg.jpg'
            alt='Mái ngói truyền thống Việt Nam'
            className='h-full w-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-earth-dark/70 via-earth-dark/50 to-earth-dark/80' />
        </div>

        <div className='container relative flex min-h-screen flex-col items-center justify-center px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='max-w-4xl'
          >
            <span className='mb-4 inline-block rounded-full bg-gold/20 px-4 py-2 text-sm font-medium text-gold'>
              Di sản làng nghề Việt Nam
            </span>
            <h1 className='mb-6 font-serif text-4xl font-bold leading-tight text-cream-light text-balance sm:text-5xl md:text-6xl lg:text-7xl'>
              Tinh hoa gạch ngói truyền thống Việt
            </h1>
            <p className='mx-auto mb-10 max-w-2xl text-lg text-cream-light/80 md:text-xl'>
              Sản xuất thủ công - Bền vững theo thời gian
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Link
                to='/san-pham'
                className='group inline-flex items-center gap-2 rounded-lg bg-brick px-8 py-4 font-semibold text-cream-light transition-all hover:bg-brick-dark hover:scale-105'
              >
                Xem sản phẩm
                <svg
                  className='h-5 w-5 transition-transform group-hover:translate-x-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                </svg>
              </Link>
              <Link
                to='/lien-he'
                className='inline-flex items-center gap-2 rounded-lg border-2 border-cream-light/30 px-8 py-4 font-semibold text-cream-light transition-all hover:bg-cream-light/10'
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className='absolute bottom-10'
          >
            <div className='flex flex-col items-center gap-2 text-cream-light/60'>
              <span className='text-sm'>Cuộn xuống</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Preview Section */}
      <AnimatedSection className='bg-cream-light py-20 md:py-28'>
        <div className='container'>
          <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-20'>
            <div className='img-zoom overflow-hidden rounded-2xl shadow-xl'>
              <img
                src='/images/craftsman.jpg'
                alt='Nghệ nhân làm gạch ngói'
                className='h-full w-full object-cover'
              />
            </div>
            <div>
              <span className='mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-brick'>
                Về chúng tôi
              </span>
              <h2 className='mb-6 font-serif text-3xl font-bold text-earth-dark md:text-4xl lg:text-5xl'>
                Giữ hồn kiến trúc Việt
              </h2>
              <p className='mb-6 text-lg leading-relaxed text-earth/80'>
                Với hơn 30 năm kinh nghiệm, chúng tôi tự hào là đơn vị hàng đầu trong việc sản xuất 
                gạch ngói truyền thống. Mỗi sản phẩm đều được làm thủ công bởi những nghệ nhân 
                tâm huyết, kế thừa tinh hoa từ các thế hệ đi trước.
              </p>
              <p className='mb-8 text-lg leading-relaxed text-earth/80'>
                Chúng tôi không chỉ sản xuất vật liệu xây dựng, mà còn góp phần bảo tồn và phát huy 
                giá trị văn hóa kiến trúc truyền thống Việt Nam.
              </p>
              <Link
                to='/gioi-thieu'
                className='group inline-flex items-center gap-2 font-semibold text-brick transition-colors hover:text-brick-dark'
              >
                Tìm hiểu thêm
                <svg
                  className='h-5 w-5 transition-transform group-hover:translate-x-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Product Categories Section */}
      <AnimatedSection className='bg-cream py-20 md:py-28'>
        <div className='container'>
          <div className='mb-16 text-center'>
            <span className='mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-brick'>
              Danh mục sản phẩm
            </span>
            <h2 className='mb-4 font-serif text-3xl font-bold text-earth-dark md:text-4xl lg:text-5xl'>
              Sản phẩm của chúng tôi
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-earth/70'>
              Đa dạng các loại gạch ngói truyền thống, phục vụ mọi nhu cầu kiến trúc
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={fadeInUp}>
                <Link
                  to={category.path}
                  className='group block overflow-hidden rounded-2xl bg-cream-light shadow-md transition-all hover-lift'
                >
                  <div className='img-zoom aspect-[4/3]'>
                    <img
                      src={category.image}
                      alt={category.name}
                      className='h-full w-full object-cover'
                    />
                  </div>
                  <div className='p-5'>
                    <h3 className='mb-2 font-serif text-lg font-semibold text-earth-dark group-hover:text-brick'>
                      {category.name}
                    </h3>
                    <p className='text-sm text-earth/70 line-clamp-2'>{category.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className='mt-12 text-center'>
            <Link
              to='/san-pham'
              className='inline-flex items-center gap-2 rounded-lg bg-brick px-8 py-4 font-semibold text-cream-light transition-all hover:bg-brick-dark hover:scale-105'
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Production Process Section */}
      <AnimatedSection id='quy-trinh' className='bg-earth-dark py-20 md:py-28'>
        <div className='container'>
          <div className='mb-16 text-center'>
            <span className='mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-gold'>
              Quy trình sản xuất
            </span>
            <h2 className='mb-4 font-serif text-3xl font-bold text-cream-light md:text-4xl lg:text-5xl'>
              Nghệ thuật thủ công truyền thống
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-cream-light/70'>
              5 bước tạo nên những viên gạch ngói hoàn hảo
            </p>
          </div>

          <div className='relative'>
            {/* Timeline line - hidden on mobile */}
            <div className='absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gold/30 lg:block' />

            <div className='space-y-12 lg:space-y-0'>
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col items-center gap-8 lg:flex-row ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className='rounded-2xl bg-earth/30 p-6'>
                      <span className='mb-2 inline-block text-4xl font-bold text-gold'>0{step.step}</span>
                      <h3 className='mb-3 font-serif text-2xl font-bold text-cream-light'>{step.title}</h3>
                      <p className='text-cream-light/70'>{step.description}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className='z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold text-earth-dark'>
                    <span className='font-bold'>{step.step}</span>
                  </div>

                  {/* Image */}
                  <div className='w-full lg:w-5/12'>
                    <div className='img-zoom overflow-hidden rounded-2xl'>
                      <img
                        src={step.image}
                        alt={step.title}
                        className='aspect-video w-full object-cover'
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Projects Section */}
      <AnimatedSection className='bg-cream-light py-20 md:py-28'>
        <div className='container'>
          <div className='mb-16 text-center'>
            <span className='mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-brick'>
              Dự án tiêu biểu
            </span>
            <h2 className='mb-4 font-serif text-3xl font-bold text-earth-dark md:text-4xl lg:text-5xl'>
              Công trình đã thực hiện
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-earth/70'>
              Những dự án tiêu biểu sử dụng sản phẩm gạch ngói của chúng tôi
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={fadeInUp}>
                <Link
                  to='/du-an'
                  className='group relative block aspect-[4/5] overflow-hidden rounded-2xl'
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-earth-dark/90 via-earth-dark/20 to-transparent' />
                  <div className='absolute bottom-0 left-0 right-0 p-6'>
                    <span className='mb-2 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-gold'>
                      {project.category}
                    </span>
                    <h3 className='font-serif text-xl font-bold text-cream-light'>{project.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className='mt-12 text-center'>
            <Link
              to='/du-an'
              className='inline-flex items-center gap-2 rounded-lg border-2 border-brick px-8 py-4 font-semibold text-brick transition-all hover:bg-brick hover:text-cream-light'
            >
              Xem tất cả dự án
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection className='bg-cream py-20 md:py-28'>
        <div className='container'>
          <div className='mb-16 text-center'>
            <span className='mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-brick'>
              Đánh giá
            </span>
            <h2 className='mb-4 font-serif text-3xl font-bold text-earth-dark md:text-4xl lg:text-5xl'>
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>

          <motion.div
            variants={staggerContainer}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={fadeInUp}
                className='rounded-2xl bg-cream-light p-8 shadow-md'
              >
                {/* Quote icon */}
                <svg className='mb-4 h-10 w-10 text-brick/30' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
                </svg>
                <p className='mb-6 text-lg leading-relaxed text-earth/80'>{testimonial.content}</p>
                <div className='flex items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-brick text-cream-light font-semibold'>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className='font-semibold text-earth-dark'>{testimonial.name}</h4>
                    <p className='text-sm text-earth/60'>{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <section className='relative py-20 md:py-28'>
        <div className='absolute inset-0'>
          <img
            src='/images/cta-bg.jpg'
            alt='Xưởng sản xuất gạch ngói'
            className='h-full w-full object-cover'
          />
          <div className='absolute inset-0 bg-earth-dark/85' />
        </div>

        <div className='container relative'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mx-auto max-w-3xl text-center'
          >
            <h2 className='mb-6 font-serif text-3xl font-bold text-cream-light md:text-4xl lg:text-5xl text-balance'>
              Bạn đang tìm vật liệu mang giá trị truyền thống?
            </h2>
            <p className='mb-10 text-lg text-cream-light/80'>
              Hãy liên hệ với chúng tôi để được tư vấn và báo giá chi tiết nhất
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Link
                to='/lien-he'
                className='inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-4 font-semibold text-earth-dark transition-all hover:bg-gold-light hover:scale-105'
              >
                Liên hệ ngay
              </Link>
              <a
                href='tel:0987654321'
                className='inline-flex items-center gap-2 rounded-lg border-2 border-cream-light/30 px-8 py-4 font-semibold text-cream-light transition-all hover:bg-cream-light/10'
              >
                <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
                0987 654 321
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
