import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import blogApi, { BlogListConfig } from 'src/apis/blog.api'
import categoryApi from 'src/apis/category.api'
import { AdminPagination } from 'src/components/Pagination'
import path from 'src/constants/path'

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

// Helper function to extract plain text from HTML content
const getExcerpt = (htmlContent: string, maxLength = 150) => {
  const textContent = htmlContent.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ')
  return textContent.length > maxLength ? textContent.substring(0, maxLength) + '...' : textContent
}

// Helper function to calculate reading time
const getReadingTime = (content: string) => {
  const wordsPerMinute = 200
  const textContent = content.replace(/<[^>]*>/g, '')
  const words = textContent.split(/\s+/).length
  const readingTime = Math.ceil(words / wordsPerMinute)
  return readingTime
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function Blog() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'views'>('createdAt')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const limit = 12

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Build query parameters
  const queryParams: BlogListConfig = {
    page,
    limit,
    sort_by: sortBy,
    order,
    ...(searchTerm && { search: searchTerm }),
    ...(selectedCategory && { category: selectedCategory })
  }

  // Fetch blog posts
  const { data: postsData, isPending, error } = useQuery({
    queryKey: ['blog-posts', page, searchTerm, selectedCategory, sortBy, order],
    queryFn: () => blogApi.getPosts(queryParams),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Fetch categories for filtering
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
    staleTime: 10 * 60 * 1000 // 10 minutes
  })

  const posts = postsData?.data.data.posts || []
  const pagination = postsData?.data.data.pagination
  const categories = categoriesData?.data.data.categories || []

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSortBy('createdAt')
    setOrder('desc')
    setPage(1)
  }

  return (
    <>
      <Helmet>
        <title>Blog - Tin tức & Kiến thức | Gạch Ngói Việt</title>
        <meta
          name='description'
          content='Blog chia sẻ kiến thức về gạch ngói, xu hướng kiến trúc, và các dự án tiêu biểu từ Gạch Ngói Việt.'
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
              Blog & Tin tức
            </span>
            <h1 className='mb-4 font-serif text-4xl font-bold text-cream-light md:text-5xl'>
              Kiến thức & Xu hướng
            </h1>
            <p className='mx-auto max-w-2xl text-lg text-cream-light/70'>
              Chia sẻ những kiến thức chuyên sâu về gạch ngói và xu hướng kiến trúc hiện đại
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <section className='bg-cream-light py-16'>
        <div className='container'>
          {/* Filters & Search */}
          <div className='mb-12 space-y-6'>
            {/* Search Bar */}
            <div className='flex justify-center'>
              <div className='relative w-full max-w-lg'>
                <input
                  type='text'
                  placeholder='Tìm kiếm bài viết...'
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setPage(1)
                  }}
                  className='w-full rounded-full bg-white px-6 py-3 pl-12 text-sm shadow-sm border border-gray-200 focus:border-brick focus:outline-none focus:ring-2 focus:ring-brick/10'
                />
                <svg
                  className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className='flex flex-wrap justify-center gap-3'>
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setPage(1)
                }}
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                  !selectedCategory ? 'bg-brick text-cream-light' : 'bg-cream text-earth hover:bg-cream-dark'
                }`}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => {
                    setSelectedCategory(category._id)
                    setPage(1)
                  }}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                    selectedCategory === category._id
                      ? 'bg-brick text-cream-light'
                      : 'bg-cream text-earth hover:bg-cream-dark'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className='flex flex-wrap justify-center gap-4'>
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [newSortBy, newOrder] = e.target.value.split('-')
                  setSortBy(newSortBy as 'createdAt' | 'title' | 'views')
                  setOrder(newOrder as 'asc' | 'desc')
                  setPage(1)
                }}
                className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-brick focus:outline-none focus:ring-2 focus:ring-brick/10'
              >
                <option value='createdAt-desc'>Mới nhất</option>
                <option value='createdAt-asc'>Cũ nhất</option>
                <option value='title-asc'>Tiêu đề A-Z</option>
                <option value='title-desc'>Tiêu đề Z-A</option>
                <option value='views-desc'>Xem nhiều nhất</option>
              </select>
              <button
                onClick={handleResetFilters}
                className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:border-brick focus:outline-none focus:ring-2 focus:ring-brick/10'
              >
                🗑️ Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isPending && (
            <div className='flex items-center justify-center py-16'>
              <div className='text-center'>
                <div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brick mb-4'></div>
                <div className='text-gray-600 font-medium'>Đang tải bài viết...</div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className='flex items-center justify-center py-16'>
              <div className='text-center'>
                <span className='text-3xl'>⚠️</span>
                <div className='text-gray-600 font-medium mt-2'>Không thể tải bài viết. Vui lòng thử lại sau.</div>
              </div>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!isPending && !error && (
            <motion.div
              variants={staggerContainer}
              initial='hidden'
              animate='visible'
              className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'
            >
              {posts.length > 0 ? (
                posts.map((post) => (
                  <motion.article
                    key={post._id}
                    variants={fadeInUp}
                    className='group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover-lift'
                  >
                    <Link to={`/blog/${post.slug}`}>
                      {/* Thumbnail */}
                      <div className='img-zoom relative aspect-[4/3]'>
                        <img
                          src={post.thumbnail || '/images/projects/nha-co.jpg'}
                          alt={post.title}
                          className='h-full w-full object-cover'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-earth-dark/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
                        {post.category && (
                          <span className='absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-earth-dark'>
                            {post.category.name}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className='p-6'>
                        {/* Meta */}
                        <div className='mb-3 flex items-center gap-4 text-sm text-earth/60'>
                          <span>{formatDate(post.createdAt)}</span>
                          <span>•</span>
                          <span>{getReadingTime(post.content)} phút đọc</span>
                          {post.views && (
                            <>
                              <span>•</span>
                              <span>{post.views} lượt xem</span>
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className='mb-3 font-serif text-xl font-semibold text-earth-dark group-hover:text-brick line-clamp-2'>
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className='mb-4 text-sm text-earth/70 line-clamp-3'>{getExcerpt(post.content)}</p>

                        {/* Author */}
                        {post.author && (
                          <div className='flex items-center gap-2'>
                            {post.author.avatar ? (
                              <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className='h-6 w-6 rounded-full object-cover'
                              />
                            ) : (
                              <div className='h-6 w-6 rounded-full bg-brick text-center text-xs font-bold leading-6 text-white flex items-center justify-center'>
                                {post.author.name?.charAt(0) || post.author.email?.charAt(0) || 'A'}
                              </div>
                            )}
                            <span className='text-xs text-earth/60'>{post.author.name || post.author.email}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                ))
              ) : (
                <div className='col-span-full flex items-center justify-center py-16'>
                  <div className='text-center'>
                    <span className='text-3xl'>📝</span>
                    <div className='text-gray-600 font-medium mt-2'>Không có bài viết nào được tìm thấy</div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Pagination */}
          {pagination && (
            <div className='mt-12'>
              <AdminPagination pagination={pagination} onPageChange={setPage} showInfo={true} />
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-brick py-16'>
        <div className='container'>
          <div className='flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left'>
            <div>
              <h2 className='mb-2 font-serif text-2xl font-bold text-cream-light md:text-3xl'>
                Bạn có câu hỏi về sản phẩm?
              </h2>
              <p className='text-cream-light/80'>Liên hệ ngay để nhận tư vấn từ chuyên gia về gạch ngói</p>
            </div>
            <Link
              to={path.contact}
              className='inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-4 font-semibold text-earth-dark transition-all hover:bg-gold-light hover:scale-105'
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}