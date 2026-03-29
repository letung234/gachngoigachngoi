import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { Product } from 'src/types/product.type'

const specLabels: Record<string, string> = {
  size: 'Kích thước',
  thickness: 'Độ dày',
  weight: 'Trọng lượng',
  material: 'Chất liệu',
  color: 'Màu sắc',
  waterAbsorption: 'Độ hút nước',
  bendingStrength: 'Độ uốn',
  compressiveStrength: 'Độ nén',
  technique: 'Kỹ thuật',
  origin: 'Xuất xứ'
}

export default function ProductDetail() {
  const { category, id } = useParams<{ category: string; id: string }>()
  const [selectedImage, setSelectedImage] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)

  // Zoom handlers
  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image

    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    const image = imageRef.current as HTMLImageElement
    image.removeAttribute('style')
  }

  // Fetch product detail
  const { data: productData, isLoading: isPending } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  })

  // Fetch related products
  const product = productData?.data.data
  const categoryId = (product?.category as any)?._id

  const { data: relatedData } = useQuery({
    queryKey: ['related-products', categoryId],
    queryFn: () =>
      productApi.getProducts({
        category: categoryId,
        limit: 4
      }),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000
  })

  const relatedProducts = (relatedData?.data.data.products || []).filter((p: Product) => p._id !== id).slice(0, 3)

  const formatPrice = (price: number) => {
    if (price === 0) return 'Liên hệ báo giá'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  if (isPending) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-cream-light'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brick border-t-transparent' />
          <p className='text-lg text-earth/60'>Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-cream-light'>
        <div className='text-center'>
          <p className='mb-4 text-lg text-earth/60'>Không tìm thấy sản phẩm</p>
          <Link to='/san-pham' className='text-brick hover:underline'>
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  const categoryName = (product.category as any)?.name || 'Sản phẩm'
  const categorySlug = (product.category as any)?.slug || 'san-pham'
  const images = product.images?.length > 0 ? product.images : [product.image]
  const specs = (product as any).specs || {}

  return (
    <>
      <Helmet>
        <title>{product.name} | Gạch Ngói Việt</title>
        <meta name='description' content={product.description} />
      </Helmet>

      {/* Breadcrumb */}
      <section className='bg-cream pb-4 pt-28'>
        <div className='container'>
          <nav className='flex flex-wrap items-center gap-2 text-sm'>
            <Link to='/' className='text-earth/60 hover:text-brick'>
              Trang chủ
            </Link>
            <span className='text-earth/40'>/</span>
            <Link to='/san-pham' className='text-earth/60 hover:text-brick'>
              Sản phẩm
            </Link>
            <span className='text-earth/40'>/</span>
            <Link to={`/san-pham/${categorySlug}`} className='text-earth/60 hover:text-brick'>
              {categoryName}
            </Link>
            <span className='text-earth/40'>/</span>
            <span className='text-earth-dark'>{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className='bg-cream-light py-12'>
        <div className='container'>
          <div className='grid gap-12 lg:grid-cols-2'>
            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              {/* Main Image with Zoom */}
              <div
                className='relative mb-4 cursor-zoom-in overflow-hidden rounded-2xl bg-white pt-[100%] shadow-lg'
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  ref={imageRef}
                  src={images[selectedImage]}
                  alt={product.name}
                  className='pointer-events-none absolute left-0 top-0 h-full w-full object-cover'
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/images/no-product.png'
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className='flex gap-3'>
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`overflow-hidden rounded-lg transition-all ${
                        selectedImage === index ? 'ring-2 ring-brick ring-offset-2' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className='h-16 w-16 object-cover sm:h-20 sm:w-20'
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = '/images/no-product.png'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className='mb-3 inline-block rounded-full bg-brick/10 px-4 py-1 text-sm font-medium text-brick'>
                {categoryName}
              </span>
              <h1 className='mb-4 font-serif text-3xl font-bold text-earth-dark md:text-4xl'>{product.name}</h1>
              <p className='mb-6 text-lg leading-relaxed text-earth/80'>{product.description}</p>

              {/* Price */}
              <div className='mb-8 rounded-xl bg-cream p-6'>
                <div className='flex items-center justify-between'>
                  <span className='text-earth/60'>Giá bán:</span>
                  <span className='text-2xl font-bold text-brick'>{formatPrice(product.price)}</span>
                </div>
                {product.price_before_discount > product.price && (
                  <div className='mt-2 flex items-center justify-between'>
                    <span className='text-earth/60'>Giá gốc:</span>
                    <span className='text-lg text-earth/50 line-through'>
                      {formatPrice(product.price_before_discount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Specifications */}
              {Object.keys(specs).length > 0 && (
                <div className='mb-8'>
                  <h3 className='mb-4 font-serif text-xl font-semibold text-earth-dark'>Thông số kỹ thuật</h3>
                  <div className='grid gap-3 sm:grid-cols-2'>
                    {(Object.entries(specs) as [string, string][]).map(
                      ([key, value]) =>
                        value && (
                          <div key={key} className='flex justify-between rounded-lg bg-cream p-3'>
                            <span className='text-earth/60'>{specLabels[key] || key}</span>
                            <span className='font-medium text-earth-dark'>{value}</span>
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className='mb-8 grid grid-cols-3 gap-4'>
                <div className='rounded-lg bg-cream p-4 text-center'>
                  <span className='block text-2xl font-bold text-brick'>{product.sold}</span>
                  <span className='text-sm text-earth/60'>Đã bán</span>
                </div>
                <div className='rounded-lg bg-cream p-4 text-center'>
                  <span className='block text-2xl font-bold text-brick'>{product.view}</span>
                  <span className='text-sm text-earth/60'>Lượt xem</span>
                </div>
                <div className='rounded-lg bg-cream p-4 text-center'>
                  <span className='block text-2xl font-bold text-brick'>{product.quantity}</span>
                  <span className='text-sm text-earth/60'>Còn hàng</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Link
                  to='/lien-he'
                  className='inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brick px-8 py-4 font-semibold text-cream-light transition-all hover:bg-brick-dark'
                >
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                  Liên hệ báo giá
                </Link>
                <a
                  href='tel:0987654321'
                  className='inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-brick px-8 py-4 font-semibold text-brick transition-all hover:bg-brick hover:text-cream-light'
                >
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                    />
                  </svg>
                  Gọi ngay
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className='bg-cream py-16'>
        <div className='container'>
          <div className='mx-auto max-w-4xl'>
            <h2 className='mb-6 font-serif text-2xl font-bold text-earth-dark'>Mô tả chi tiết</h2>
            <div
              className='prose prose-lg max-w-none text-earth/80'
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
        </div>
        </div>
      </section>

      {/* Customer Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <section className='bg-cream-light py-16'>
          <div className='container'>
            <div className='mx-auto max-w-4xl'>
              <h2 className='mb-8 font-serif text-2xl font-bold text-earth-dark'>
                Khách hàng đánh giá ({product.reviews.length})
              </h2>
              <div className='space-y-6'>
                {product.reviews.map((review, index) => (
                  <div key={index} className='rounded-xl bg-white p-6 shadow-md'>
                    <div className='mb-4 flex items-center gap-4'>
                      <img
                        src={review.avatar || '/images/user.svg'}
                        alt={review.name}
                        className='h-14 w-14 rounded-full object-cover'
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = '/images/user.svg'
                        }}
                      />
                      <div>
                        <h4 className='font-semibold text-earth-dark'>{review.name}</h4>
                        <div className='flex text-yellow-400'>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= (review.rating || 5) ? '' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className='leading-relaxed text-earth/80'>{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className='bg-cream-light py-16'>
          <div className='container'>
            <h2 className='mb-8 font-serif text-2xl font-bold text-earth-dark'>Sản phẩm cùng loại</h2>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {relatedProducts.map((relatedProduct: Product) => (
                <Link
                  key={relatedProduct._id}
                  to={`/san-pham/${(relatedProduct.category as any)?.slug || 'san-pham'}/${relatedProduct._id}`}
                  className='hover-lift group block overflow-hidden rounded-2xl bg-white shadow-md transition-all'
                >
                  <div className='img-zoom aspect-[4/3]'>
                    <img
                      src={relatedProduct.images?.[0] || relatedProduct.image}
                      alt={relatedProduct.name}
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = '/images/no-product.png'
                      }}
                    />
                  </div>
                  <div className='p-5'>
                    <h3 className='mb-2 font-serif text-lg font-semibold text-earth-dark group-hover:text-brick'>
                      {relatedProduct.name}
                    </h3>
                    <p className='line-clamp-2 text-sm text-earth/70'>{relatedProduct.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className='bg-brick py-12'>
        <div className='container'>
          <div className='flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left'>
            <div>
              <h2 className='mb-2 font-serif text-2xl font-bold text-cream-light md:text-3xl'>
                Cần tư vấn thêm về sản phẩm?
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
