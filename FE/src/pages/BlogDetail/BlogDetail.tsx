import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import blogApi from 'src/apis/blog.api'
import path from 'src/constants/path'
import { Post } from 'src/types/post.type'

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
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper function to get excerpt
const getExcerpt = (htmlContent: string, maxLength = 150) => {
  const textContent = htmlContent.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ')
  return textContent.length > maxLength ? textContent.substring(0, maxLength) + '...' : textContent
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Fetch post detail
  const { data: postData, isPending, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogApi.getPost(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Fetch related posts when post is loaded
  const { data: relatedPostsData } = useQuery({
    queryKey: ['related-posts', postData?.data.data?.category?._id],
    queryFn: () =>
      blogApi.getPosts({
        limit: 3,
        category: postData?.data.data?.category?._id,
        sort_by: 'createdAt',
        order: 'desc'
      }),
    enabled: !!postData?.data.data?.category?._id,
    staleTime: 10 * 60 * 1000 // 10 minutes
  })

  const post = postData?.data.data
  useEffect(() => {
    if (relatedPostsData?.data.data.posts) {
      // Filter out current post from related posts
      const filtered = relatedPostsData.data.data.posts.filter((p) => p.slug !== slug)
      setRelatedPosts(filtered.slice(0, 3))
    }
  }, [relatedPostsData, slug])

  if (isPending) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-cream-light'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brick mb-4'></div>
          <div className='text-gray-600 font-medium'>Đang tải bài viết...</div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-cream-light'>
        <div className='text-center'>
          <span className='text-6xl'>📝</span>
          <h1 className='mt-4 text-2xl font-bold text-earth'>Không tìm thấy bài viết</h1>
          <p className='mt-2 text-earth/60'>Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link
            to='/blog'
            className='mt-6 inline-block rounded-lg bg-brick px-6 py-3 font-semibold text-white transition-all hover:bg-brick-dark'
          >
            Về trang Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Gạch Ngói Việt</title>
        <meta name='description' content={getExcerpt(post.content, 160)} />
        <meta property='og:title' content={post.title} />
        <meta property='og:description' content={getExcerpt(post.content, 160)} />
        <meta property='og:image' content={post.thumbnail} />
        <meta property='og:type' content='article' />

        {/* JSON-LD structured data for articles */}
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            image: post.thumbnail,
            author: {
              '@type': 'Person',
              name: post.author?.name || post.author?.email || 'Gạch Ngói Việt'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Gạch Ngói Việt',
              logo: {
                '@type': 'ImageObject',
                url: '/logo.png'
              }
            },
            datePublished: post.createdAt,
            dateModified: post.updatedAt || post.createdAt
          })}
        </script>
      </Helmet>

      <motion.div initial='hidden' animate='visible' variants={staggerContainer} className='bg-cream-light'>
        {/* Breadcrumb */}
        <section className='border-b border-cream bg-white py-4'>
          <div className='container'>
            <motion.nav variants={fadeInUp} className='flex flex-wrap items-center gap-2 text-sm'>
              <Link to={path.home} className='text-earth/60 hover:text-brick transition-colors'>
                Trang chủ
              </Link>
              <span className='text-earth/40'>/</span>
              <Link to='/blog' className='text-earth/60 hover:text-brick transition-colors'>
                Blog
              </Link>
              {post.category && (
                <>
                  <span className='text-earth/40'>/</span>
                  <span className='text-earth/60'>{post.category.name}</span>
                </>
              )}
              <span className='text-earth/40'>/</span>
              <span className='font-medium text-earth'>{post.title}</span>
            </motion.nav>
          </div>
        </section>

        {/* Article Header */}
        <section className='bg-white py-16'>
          <div className='container'>
            <motion.div variants={fadeInUp} className='mx-auto max-w-4xl'>
              {/* Category Badge */}
              {post.category && (
                <div className='mb-6'>
                  <span className='inline-block rounded-full bg-gold px-4 py-2 text-sm font-semibold text-earth-dark'>
                    {post.category.name}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className='mb-6 font-serif text-3xl font-bold text-earth-dark md:text-4xl lg:text-5xl'>
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className='flex flex-wrap items-center gap-6 text-sm text-earth/60 mb-8'>
                <div className='flex items-center gap-3'>
                  {post.author?.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className='h-10 w-10 rounded-full object-cover'
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-brick text-center text-sm font-bold leading-10 text-white flex items-center justify-center'>
                      {post.author?.name?.charAt(0) || post.author?.email?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div>
                    <div className='font-medium text-earth'>{post.author?.name || post.author?.email}</div>
                    <div className='text-xs'>Tác giả</div>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <span>📅 {formatDate(post.createdAt)}</span>
                  <span>⏰ {getReadingTime(post.content)} phút đọc</span>
                  {post.views && <span>👀 {post.views} lượt xem</span>}
                </div>
              </div>

              {/* Featured Image */}
              {post.thumbnail && (
                <div className='mb-8 overflow-hidden rounded-2xl'>
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className='h-96 w-full object-cover md:h-[500px]'
                  />
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <section className='py-16'>
          <div className='container'>
            <motion.div variants={fadeInUp} className='mx-auto max-w-4xl'>
              <div
                className='prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-earth-dark prose-p:text-earth/80 prose-a:text-brick hover:prose-a:text-brick-dark prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:bg-cream/50 prose-blockquote:pl-6 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-lg'
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </motion.div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className='bg-white py-16'>
            <div className='container'>
              <motion.div variants={fadeInUp} className='mx-auto max-w-6xl'>
                <h2 className='mb-8 text-center font-serif text-3xl font-bold text-earth-dark'>
                  Bài viết liên quan
                </h2>

                <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                  {relatedPosts.map((relatedPost) => (
                    <motion.article
                      key={relatedPost._id}
                      variants={fadeInUp}
                      className='group overflow-hidden rounded-2xl bg-cream-light shadow-md transition-all hover-lift'
                    >
                      <Link to={`/blog/${relatedPost.slug}`}>
                        {/* Thumbnail */}
                        <div className='img-zoom relative aspect-[4/3]'>
                          <img
                            src={relatedPost.thumbnail || '/images/projects/nha-co.jpg'}
                            alt={relatedPost.title}
                            className='h-full w-full object-cover'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-earth-dark/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
                        </div>

                        {/* Content */}
                        <div className='p-6'>
                          <div className='mb-2 text-sm text-earth/60'>
                            {formatDate(relatedPost.createdAt)}
                          </div>
                          <h3 className='font-serif text-lg font-semibold text-earth-dark group-hover:text-brick line-clamp-2'>
                            {relatedPost.title}
                          </h3>
                          <p className='mt-2 text-sm text-earth/70 line-clamp-2'>
                            {getExcerpt(relatedPost.content)}
                          </p>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                <div className='mt-8 text-center'>
                  <Link
                    to='/blog'
                    className='inline-flex items-center gap-2 rounded-lg bg-brick px-6 py-3 font-semibold text-white transition-all hover:bg-brick-dark hover:scale-105'
                  >
                    Xem tất cả bài viết
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className='bg-earth-dark py-16'>
          <div className='container'>
            <motion.div variants={fadeInUp} className='text-center'>
              <h2 className='mb-4 font-serif text-3xl font-bold text-cream-light'>
                Bạn thấy bài viết hữu ích?
              </h2>
              <p className='mb-8 text-lg text-cream-light/70'>
                Chia sẻ với bạn bè hoặc liên hệ để nhận tư vấn từ chuyên gia
              </p>
              <div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
                <Link
                  to={path.contact}
                  className='inline-flex items-center gap-2 rounded-lg bg-brick px-8 py-4 font-semibold text-white transition-all hover:bg-brick-dark hover:scale-105'
                >
                  Liên hệ tư vấn
                </Link>
                <Link
                  to='/blog'
                  className='inline-flex items-center gap-2 rounded-lg border-2 border-gold px-8 py-4 font-semibold text-gold transition-all hover:bg-gold hover:text-earth-dark'
                >
                  Đọc thêm bài viết
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </>
  )
}