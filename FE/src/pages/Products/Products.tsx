import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import categoryApi from 'src/apis/category.api'
import { Product } from 'src/types/product.type'

interface Category {
  _id: string
  name: string
  slug: string
  order?: number
}

const PRODUCTS_PER_PAGE = 8

// Animation variants
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

export default function Products() {
  const { category } = useParams<{ category?: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(category || 'all')
  const currentPage = Number(searchParams.get('page')) || 1

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
    staleTime: 5 * 60 * 1000
  })

  const categories: Category[] = categoriesData?.data.data.categories || []

  // Fetch products with pagination
  const { data: productsData, isLoading: isPending } = useQuery({
    queryKey: ['products', activeCategory, currentPage],
    queryFn: () => {
      const params: Record<string, string | number> = {
        limit: PRODUCTS_PER_PAGE,
        page: currentPage
      }
      if (activeCategory !== 'all') {
        const cat = categories.find((c) => c.slug === activeCategory)
        if (cat) {
          params.category = cat._id
        }
      }
      return productApi.getProducts(params as any)
    },
    enabled: !!categoriesData,
    staleTime: 5 * 60 * 1000
  })

  const products: Product[] = productsData?.data.data.products || []
  const pagination = productsData?.data.data.pagination || { page: 1, limit: PRODUCTS_PER_PAGE, page_size: 1 }
  const totalPages = pagination.page_size || 1

  // Add "Tất cả" option at the beginning
  const allCategories = [{ _id: 'all', name: 'Tất cả', slug: 'all' }, ...categories]

  useEffect(() => {
    setActiveCategory(category || 'all')
    setSearchParams({}) // Reset page when category changes
    window.scrollTo(0, 0)
  }, [category])

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentCategory = allCategories.find(
    (cat) => cat.slug === activeCategory || (activeCategory === 'all' && cat._id === 'all')
  )

  const formatPrice = (price: number) => {
    if (price === 0) return 'Liên hệ'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  return (
    <>
      <Helmet>
        <title>
          {currentCategory && currentCategory._id !== 'all'
            ? `${currentCategory.name} | Gạch Ngói Việt`
            : 'Sản phẩm | Gạch Ngói Việt'}
        </title>
        <meta
          name='description'
          content='Danh mục sản phẩm gạch ngói truyền thống Việt Nam. Ngói âm dương, ngói mũi hài, gạch lát sân, gạch xây cổ, gạch trang trí.'
        />
      </Helmet>

      {/* Hero Banner */}
      <section className='relative bg-earth-dark pb-20 pt-32'>
        <div className='absolute inset-0 opacity-20'>
          <img src='/images/hero-bg.jpg' alt='' className='h-full w-full object-cover' />
        </div>
        <div className='container relative'>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center'>
            <span className='mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-gold'>Sản phẩm</span>
            <h1 className='mb-4 font-serif text-4xl font-bold text-cream-light md:text-5xl'>
              {currentCategory && currentCategory._id !== 'all' ? currentCategory.name : 'Tất cả sản phẩm'}
            </h1>
            <p className='mx-auto max-w-2xl text-lg text-cream-light/70'>
              Khám phá bộ sưu tập gạch ngói truyền thống, được chế tác thủ công bởi nghệ nhân lành nghề
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className='bg-cream-light py-16'>
        <div className='container'>
          {/* Category Filters */}
          <div className='mb-12'>
            <div className='flex flex-wrap justify-center gap-3'>
              {allCategories.map((cat) => (
                <Link
                  key={cat._id}
                  to={cat.slug ? `/san-pham/${cat.slug}` : '/san-pham'}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                    activeCategory === cat.slug || (activeCategory === 'all' && cat._id === 'all')
                      ? 'bg-brick text-cream-light'
                      : 'bg-cream text-earth hover:bg-cream-dark'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isPending && (
            <div className='flex items-center justify-center py-20'>
              <div className='h-12 w-12 animate-spin rounded-full border-4 border-brick border-t-transparent' />
            </div>
          )}

          {/* Products Grid */}
          {!isPending && (
            <motion.div
              variants={staggerContainer}
              initial='hidden'
              animate='visible'
              key={activeCategory}
              className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            >
              {products.map((product) => (
                <motion.div key={product._id} variants={fadeInUp}>
                  <Link
                    to={`/san-pham/${(product.category as any)?.slug || 'san-pham'}/${product._id}`}
                    className='hover-lift group block overflow-hidden rounded-2xl bg-white shadow-md transition-all'
                  >
                    {/* Product Image */}
                    <div className='img-zoom relative aspect-square'>
                      <img src={product.image} alt={product.name} className='h-full w-full object-cover' />
                      {(product as any).featured && (
                        <span className='absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-earth-dark'>
                          Nổi bật
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className='p-6'>
                      <span className='mb-2 inline-block text-xs font-medium text-brick'>
                        {(product.category as any)?.name || 'Sản phẩm'}
                      </span>
                      <h3 className='mb-2 font-serif text-lg font-semibold text-earth-dark group-hover:text-brick'>
                        {product.name}
                      </h3>
                      <p className='mb-4 line-clamp-2 text-sm text-earth/70'>{product.description}</p>

                      {/* Specs */}
                      {(product as any).specs && (
                        <div className='mb-4 flex flex-wrap gap-2'>
                          {(product as any).specs.size && (
                            <span className='rounded bg-cream px-2 py-1 text-xs text-earth/80'>
                              {(product as any).specs.size}
                            </span>
                          )}
                          {(product as any).specs.color && (
                            <span className='rounded bg-cream px-2 py-1 text-xs text-earth/80'>
                              {(product as any).specs.color}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price & CTA */}
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold text-brick'>{formatPrice(product.price)}</span>
                        <span className='flex items-center gap-1 text-sm font-medium text-earth/60 group-hover:text-brick'>
                          Chi tiết
                          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {!isPending && products.length === 0 && (
            <div className='py-20 text-center'>
              <p className='text-lg text-earth/60'>Không có sản phẩm nào trong danh mục này.</p>
            </div>
          )}

          {/* Pagination */}
          {!isPending && totalPages > 1 && (
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
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-brick py-16'>
        <div className='container'>
          <div className='flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left'>
            <div>
              <h2 className='mb-2 font-serif text-2xl font-bold text-cream-light md:text-3xl'>
                Cần tư vấn chọn sản phẩm?
              </h2>
              <p className='text-cream-light/80'>Liên hệ ngay để được hỗ trợ miễn phí từ đội ngũ chuyên gia</p>
            </div>
            <Link
              to='/lien-he'
              className='inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-4 font-semibold text-earth-dark transition-all hover:scale-105 hover:bg-gold-light'
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
