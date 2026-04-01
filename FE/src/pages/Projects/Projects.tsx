import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import blogApi from 'src/apis/blog.api'
import categoryApi from 'src/apis/category.api'

const PROJECTS_PER_PAGE = 8

// Helper function to extract plain text from HTML content
const getExcerpt = (htmlContent: string, maxLength = 200) => {
  const textContent = htmlContent.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ')
  return textContent.length > maxLength ? textContent.substring(0, maxLength) + '...' : textContent
}

// Helper function to format date to year
const getYear = (dateString: string) => {
  return new Date(dateString).getFullYear().toString()
}

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
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('')
  const currentPage = Number(searchParams.get('page')) || 1

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Fetch project posts from API with pagination
  const { data: postsData, isPending, error } = useQuery({
    queryKey: ['project-posts', currentPage, selectedCategory],
    queryFn: () => blogApi.getPosts({
      page: currentPage,
      limit: PROJECTS_PER_PAGE,
      sort_by: 'createdAt',
      order: 'desc',
      ...(selectedCategory && { category: selectedCategory })
    }),
    staleTime: 5 * 60 * 1000
  })

  // Fetch categories for filtering
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
    staleTime: 10 * 60 * 1000
  })

  // Transform posts to project format
  const projects = (postsData?.data.data.posts || []).map((post) => ({
    id: post._id,
    title: post.title,
    category: post.category?.name || 'Dự án',
    location: 'Việt Nam',
    year: getYear(post.createdAt),
    description: getExcerpt(post.content),
    products: [],
    image: post.thumbnail || '/images/projects/nha-co.jpg',
    slug: post.slug
  }))

  const pagination = postsData?.data.data.pagination || { page: 1, limit: PROJECTS_PER_PAGE, page_size: 1 }
  const totalPages = pagination.page_size || 1

  // Get categories from API
  let categories = [{ _id: '', name: 'Tất cả' }]
  if (categoriesData?.data.data && Array.isArray(categoriesData.data.data.categories)) {
    const dynamicCategories = categoriesData.data.data.categories.map((cat: any) => ({
      _id: cat._id,
      name: cat.name
    }))
    categories = [{ _id: '', name: 'Tất cả' }, ...dynamicCategories]
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSearchParams({}) // Reset page to 1 when category changes
  }

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat._id)}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                    cat._id === selectedCategory ? 'bg-brick text-cream-light' : 'bg-cream text-earth hover:bg-cream-dark'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isPending && (
            <div className='flex items-center justify-center py-16'>
              <div className='text-center'>
                <div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brick mb-4'></div>
                <div className='text-gray-600 font-medium'>Đang tải dự án...</div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className='mb-8 flex items-center justify-center py-8'>
              <div className='text-center'>
                <span className='text-2xl'>⚠️</span>
                <div className='text-gray-600 font-medium mt-2'>Không thể tải dữ liệu dự án. Vui lòng thử lại sau.</div>
              </div>
            </div>
          )}

          {/* Projects */}
          {!isPending && !error && (
            <>
              {projects.length > 0 ? (
                <motion.div
                  variants={staggerContainer}
                  initial='hidden'
                  animate='visible'
                  key={`${selectedCategory}-${currentPage}`}
                  className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'
                >
                  {projects.map((project) => (
                <motion.article
                  key={project.id}
                  variants={fadeInUp}
                  className='group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover-lift'
                >
                  <Link to={`/du-an/${project.slug}`}>
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
                      {project.products && project.products.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {project.products.map((product, index) => (
                            <span key={index} className='rounded-full bg-cream px-3 py-1 text-xs text-earth/80'>
                              {product}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className='flex items-center justify-center py-16'>
              <div className='text-center'>
                <span className='text-3xl'>📦</span>
                <div className='text-gray-600 font-medium mt-2'>Chưa có dự án nào</div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='mt-12 flex items-center justify-center gap-2'>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='flex h-10 w-10 items-center justify-center rounded-lg border border-cement-light bg-white text-earth transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50'
              >
                <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show limited page numbers
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-brick text-white'
                          : 'border border-cement-light bg-white text-earth hover:bg-cream'
                      }`}
                    >
                      {page}
                    </button>
                  )
                }
                // Show ellipsis
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className='px-2 text-earth/50'>
                      ...
                    </span>
                  )
                }
                return null
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='flex h-10 w-10 items-center justify-center rounded-lg border border-cement-light bg-white text-earth transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50'
              >
                <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </div>
          )}
        </>
          )}
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
