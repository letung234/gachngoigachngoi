import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useSiteConfig } from 'src/contexts/siteConfig.context'

// Product categories data
const categories = [
  {
    id: 1,
    name: 'Ng�ｾ��ｽｳi �ｾ��ｽ｢m d�ｾ��ｽｰ�ｾ��ｽ｡ng',
    description: 'Lo陂ｯ�ｽ｡i ng�ｾ��ｽｳi truy逶ｻ�ｼｽ th逶ｻ蜑ｵg v逶ｻ螫� thi陂ｯ�ｽｿt k陂ｯ�ｽｿ �ｾ�鮟幢ｽｻ蜀� �ｾ�螯･�ｽ｡o, t陂ｯ�ｽ｡o n�ｾ��ｽｪn m�ｾ��ｽ｡i nh�ｾ��ｿｽ b逶ｻ�ｼｽ v逶ｻ�ｽｯng',
    image: '/images/products/ngoi-am-duong.jpg',
    path: '/san-pham/ngoi-am-duong'
  },
  {
    id: 2,
    name: 'Ng�ｾ��ｽｳi m�ｾ��ｽｩi h�ｾ��ｿｽi',
    description: 'Ng�ｾ��ｽｳi cong m逶ｻ�ｼｻ m陂ｯ�ｽ｡i, th�ｾ��ｽｰ逶ｻ諡ｵg d�ｾ��ｽｹng cho �ｾ�螯･�ｽｬnh ch�ｾ��ｽｹa, nh�ｾ��ｿｽ c逶ｻ�ｿｽ',
    image: '/images/products/ngoi-mui-hai.jpg',
    path: '/san-pham/ngoi-mui-hai'
  },
  {
    id: 3,
    name: 'G陂ｯ�ｽ｡ch l�ｾ��ｽ｡t s�ｾ��ｽ｢n',
    description: 'G陂ｯ�ｽ｡ch terracotta l�ｾ��ｽ｡t s�ｾ��ｽ｢n v�ｾ��ｽｰ逶ｻ諡ｵ, b逶ｻ�ｼｽ �ｾ�鮟幢ｽｺ�ｽｹp qua th逶ｻ諡ｱ gian',
    image: '/images/products/gach-lat-san.jpg',
    path: '/san-pham/gach-lat-san'
  },
  {
    id: 4,
    name: 'G陂ｯ�ｽ｡ch x�ｾ��ｽ｢y c逶ｻ�ｿｽ',
    description: 'G陂ｯ�ｽ｡ch x�ｾ��ｽ｢y d逶ｻ�ｽｱng theo phong c�ｾ��ｽ｡ch truy逶ｻ�ｼｽ th逶ｻ蜑ｵg, ch陂ｯ�ｽｯc kh逶ｻ驫�',
    image: '/images/products/gach-xay-co.jpg',
    path: '/san-pham/gach-xay-co'
  },
  {
    id: 5,
    name: 'G陂ｯ�ｽ｡ch trang tr�ｾ��ｽｭ',
    description: 'G陂ｯ�ｽ｡ch hoa v�ｾ�繝� trang tr�ｾ��ｽｭ, �ｾ�險ｴ逶ｻ繝� nh陂ｯ�ｽ･n cho c�ｾ��ｽｴng tr�ｾ��ｽｬnh',
    image: '/images/products/gach-trang-tri.jpg',
    path: '/san-pham/gach-trang-tri'
  }
]

// Process steps
const processSteps = [
  {
    step: 1,
    title: 'Ch逶ｻ閧ｱ �ｾ�鮟幢ｽｺ�ｽ･t',
    description: 'L逶ｻ�ｽｱa ch逶ｻ閧ｱ �ｾ�鮟幢ｽｺ�ｽ･t s�ｾ��ｽｩt ch陂ｯ�ｽ･t l�ｾ��ｽｰ逶ｻ�ｽ｣ng cao t逶ｻ�ｽｫ v�ｾ��ｽｹng nguy�ｾ��ｽｪn li逶ｻ緕｡ truy逶ｻ�ｼｽ th逶ｻ蜑ｵg',
    image: '/images/process/chon-dat.jpg'
  },
  {
    step: 2,
    title: 'Nh�ｾ��ｿｽo �ｾ�鮟幢ｽｺ�ｽ･t',
    description: 'Nh�ｾ��ｿｽo tr逶ｻ蜀｢ �ｾ�鮟幢ｽｺ�ｽ･t s�ｾ��ｽｩt v逶ｻ螫� n�ｾ��ｽｰ逶ｻ雖ｩ theo t逶ｻ�ｽｷ l逶ｻ�ｿｽ chu陂ｯ�ｽｩn c逶ｻ�ｽｧa l�ｾ��ｿｽng ngh逶ｻ�ｿｽ',
    image: '/images/process/nhao-dat.jpg'
  },
  {
    step: 3,
    title: 'T陂ｯ�ｽ｡o h�ｾ��ｽｬnh',
    description: 'Ngh逶ｻ�ｿｽ nh�ｾ��ｽ｢n t陂ｯ�ｽ｡o h�ｾ��ｽｬnh th逶ｻ�ｽｧ c�ｾ��ｽｴng t逶ｻ�ｽｫng vi�ｾ��ｽｪn g陂ｯ�ｽ｡ch ng�ｾ��ｽｳi',
    image: '/images/process/tao-hinh.jpg'
  },
  {
    step: 4,
    title: 'Ph�ｾ��ｽ｡i kh�ｾ��ｽｴ',
    description: 'Ph�ｾ��ｽ｡i s陂ｯ�ｽ｣n ph陂ｯ�ｽｩm d�ｾ��ｽｰ逶ｻ螫� �ｾ��ｽ｡nh n陂ｯ�ｽｯng t逶ｻ�ｽｱ nhi�ｾ��ｽｪn trong nhi逶ｻ縲� ng�ｾ��ｿｽy',
    image: '/images/process/phoi-kho.jpg'
  },
  {
    step: 5,
    title: 'Nung l�ｾ��ｽｲ',
    description: 'Nung trong l�ｾ��ｽｲ truy逶ｻ�ｼｽ th逶ｻ蜑ｵg 逶ｻ�ｿｽ nhi逶ｻ繽� �ｾ�鮟幢ｽｻ�ｿｽ cao �ｾ�鮟幢ｽｻ�ｿｽ t陂ｯ�ｽ｡o �ｾ�鮟幢ｽｻ�ｿｽ b逶ｻ�ｼｽ',
    image: '/images/process/nung-lo.jpg'
  }
]

// Projects
const projects = [
  {
    id: 1,
    title: 'Nh�ｾ��ｿｽ c逶ｻ�ｿｽ �ｾ�閼��ｽｰ逶ｻ諡ｵg L�ｾ��ｽ｢m',
    category: 'Nh�ｾ��ｿｽ c逶ｻ�ｿｽ',
    image: '/images/projects/nha-co.jpg'
  },
  {
    id: 2,
    title: 'Resort An L�ｾ��ｽ｢m',
    category: 'Resort',
    image: '/images/projects/resort.jpg'
  },
  {
    id: 3,
    title: 'Ch�ｾ��ｽｹa B�ｾ��ｽ｡i �ｾ�髱呻ｽｭnh',
    category: 'Ch�ｾ��ｽｹa',
    image: '/images/projects/chua.jpg'
  },
  {
    id: 4,
    title: 'Bi逶ｻ繽� th逶ｻ�ｽｱ Vinhomes',
    category: 'Bi逶ｻ繽� th逶ｻ�ｽｱ',
    image: '/images/projects/biet-thu.jpg'
  }
]

// Testimonials
const testimonials = [
  {
    id: 1,
    name: 'Nguy逶ｻ�ｿｽn V�ｾ�繝� Minh',
    role: 'Ki陂ｯ�ｽｿn tr�ｾ��ｽｺc s�ｾ��ｽｰ',
    content: 'Ch陂ｯ�ｽ･t l�ｾ��ｽｰ逶ｻ�ｽ｣ng g陂ｯ�ｽ｡ch ng�ｾ��ｽｳi r陂ｯ�ｽ･t t逶ｻ螂�, m�ｾ��ｿｽu s陂ｯ�ｽｯc �ｾ�鮟幢ｽｺ�ｽｹp v�ｾ��ｿｽ �ｾ�鮟幢ｽｻ貂｡g �ｾ�鮟幢ｽｻ縲�. T�ｾ��ｽｴi �ｾ�螯･�ｽ｣ s逶ｻ�ｽｭ d逶ｻ�ｽ･ng cho nhi逶ｻ縲� d逶ｻ�ｽｱ �ｾ��ｽ｡n nh�ｾ��ｿｽ c逶ｻ�ｿｽ ph逶ｻ�ｽ･c d逶ｻ�ｽｱng.',
    avatar: 'NM'
  },
  {
    id: 2,
    name: 'Tr陂ｯ�ｽｧn Th逶ｻ�ｿｽ Hoa',
    role: 'Ch逶ｻ�ｽｧ resort',
    content: 'S陂ｯ�ｽ｣n ph陂ｯ�ｽｩm mang �ｾ�鮟幢ｽｺ�ｽｭm b陂ｯ�ｽ｣n s陂ｯ�ｽｯc Vi逶ｻ繽�, kh�ｾ��ｽ｡ch h�ｾ��ｿｽng qu逶ｻ逾� t陂ｯ�ｽｿ r陂ｯ�ｽ･t th�ｾ��ｽｭch. �ｾ�髮ｪ�ｽｻ蜀� ng�ｾ��ｽｩ t�ｾ��ｽｰ v陂ｯ�ｽ･n nhi逶ｻ繽� t�ｾ��ｽｬnh v�ｾ��ｿｽ chuy�ｾ��ｽｪn nghi逶ｻ緕�.',
    avatar: 'TH'
  },
  {
    id: 3,
    name: 'L�ｾ��ｽｪ �ｾ�髮ｪ�ｽｻ�ｽｩc Anh',
    role: 'Nh�ｾ��ｿｽ th陂ｯ�ｽｧu x�ｾ��ｽ｢y d逶ｻ�ｽｱng',
    content: 'G陂ｯ�ｽ｡ch ng�ｾ��ｽｳi b逶ｻ�ｼｽ, ch陂ｯ�ｽｯc, ch逶ｻ荳� �ｾ�譟��ｽｰ逶ｻ�ｽ｣c th逶ｻ諡ｱ ti陂ｯ�ｽｿt kh陂ｯ�ｽｯc nghi逶ｻ繽�. Gi�ｾ��ｽ｡ c陂ｯ�ｽ｣ h逶ｻ�ｽ｣p l�ｾ��ｽｽ, giao h�ｾ��ｿｽng �ｾ�螯･�ｽｺng h陂ｯ�ｽｹn.',
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
  const { config } = useSiteConfig()

  const displayTestimonials = config?.testimonials?.length
    ? config.testimonials.map((t, i) => ({ id: i + 1, ...t }))
    : testimonials

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>G陂ｯ�ｽ｡ch Ng�ｾ��ｽｳi Truy逶ｻ�ｼｽ Th逶ｻ蜑ｵg Vi逶ｻ繽� Nam | Tinh Hoa L�ｾ��ｿｽng Ngh逶ｻ�ｿｽ</title>
        <meta
          name='description'
          content='Chuy�ｾ��ｽｪn s陂ｯ�ｽ｣n xu陂ｯ�ｽ･t v�ｾ��ｿｽ cung c陂ｯ�ｽ･p g陂ｯ�ｽ｡ch ng�ｾ��ｽｳi truy逶ｻ�ｼｽ th逶ｻ蜑ｵg Vi逶ｻ繽� Nam. Ng�ｾ��ｽｳi �ｾ��ｽ｢m d�ｾ��ｽｰ�ｾ��ｽ｡ng, ng�ｾ��ｽｳi m�ｾ��ｽｩi h�ｾ��ｿｽi, g陂ｯ�ｽ｡ch l�ｾ��ｽ｡t s�ｾ��ｽ｢n - S陂ｯ�ｽ｣n xu陂ｯ�ｽ･t th逶ｻ�ｽｧ c�ｾ��ｽｴng, b逶ｻ�ｼｽ v逶ｻ�ｽｯng theo th逶ｻ諡ｱ gian.'
        />
      </Helmet>

      {/* Hero Section */}
      <section className='relative min-h-screen'>
        <div className='absolute inset-0'>
          <img
            src='/images/hero-bg.jpg'
            alt='M�ｾ��ｽ｡i ng�ｾ��ｽｳi truy逶ｻ�ｼｽ th逶ｻ蜑ｵg Vi逶ｻ繽� Nam'
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
              Di s陂ｯ�ｽ｣n l�ｾ��ｿｽng ngh逶ｻ�ｿｽ Vi逶ｻ繽� Nam
            </span>
            <h1 className='mb-6 font-serif text-4xl font-bold leading-tight text-cream-light text-balance sm:text-5xl md:text-6xl lg:text-7xl'>
              Tinh hoa g陂ｯ�ｽ｡ch ng�ｾ��ｽｳi truy逶ｻ�ｼｽ th逶ｻ蜑ｵg Vi逶ｻ繽�
            </h1>
            <p className='mx-auto mb-10 max-w-2xl text-lg text-cream-light/80 md:text-xl'>
              S陂ｯ�ｽ｣n xu陂ｯ�ｽ･t th逶ｻ�ｽｧ c�ｾ��ｽｴng - B逶ｻ�ｼｽ v逶ｻ�ｽｯng theo th逶ｻ諡ｱ gian
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Link
                to='/san-pham'
                className='group inline-flex items-center gap-2 rounded-lg bg-brick px-8 py-4 font-semibold text-cream-light transition-all hover:bg-brick-dark hover:scale-105'
              >
                Xem s陂ｯ�ｽ｣n ph陂ｯ�ｽｩm
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
                Li�ｾ��ｽｪn h逶ｻ�ｿｽ t�ｾ��ｽｰ v陂ｯ�ｽ･n
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
              <span className='text-sm'>Cu逶ｻ蜀｢ xu逶ｻ蜑ｵg</span>
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
                alt='Ngh逶ｻ�ｿｽ nh�ｾ��ｽ｢n l�ｾ��ｿｽm g陂ｯ�ｽ｡ch ng�ｾ��ｽｳi'
                className='h-full w-full object-cover'
              />
            </div>
            <div>
              <span className='mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-brick'>
                V逶ｻ�ｿｽ ch�ｾ��ｽｺng t�ｾ��ｽｴi
              </span>
              <h2 className='mb-6 font-serif text-3xl font-bold text-earth-dark md:text-4xl lg:text-5xl'>
                Gi逶ｻ�ｽｯ h逶ｻ貂｡ ki陂ｯ�ｽｿn tr�ｾ��ｽｺc Vi逶ｻ繽�
              </h2>
              <p className='mb-6 text-lg leading-relaxed text-earth/80'>
                V逶ｻ螫� h�ｾ��ｽ｡n 30 n�ｾ�繝� kinh nghi逶ｻ纃�, ch�ｾ��ｽｺng t�ｾ��ｽｴi t逶ｻ�ｽｱ h�ｾ��ｿｽo l�ｾ��ｿｽ �ｾ�譟��ｽ｡n v逶ｻ�ｿｽ h�ｾ��ｿｽng �ｾ�鮟幢ｽｺ�ｽｧu trong vi逶ｻ繻� s陂ｯ�ｽ｣n xu陂ｯ�ｽ･t 
                g陂ｯ�ｽ｡ch ng�ｾ��ｽｳi truy逶ｻ�ｼｽ th逶ｻ蜑ｵg. M逶ｻ謫� s陂ｯ�ｽ｣n ph陂ｯ�ｽｩm �ｾ�鮟幢ｽｻ縲� �ｾ�譟��ｽｰ逶ｻ�ｽ｣c l�ｾ��ｿｽm th逶ｻ�ｽｧ c�ｾ��ｽｴng b逶ｻ谿� nh逶ｻ�ｽｯng ngh逶ｻ�ｿｽ nh�ｾ��ｽ｢n 
                t�ｾ��ｽ｢m huy陂ｯ�ｽｿt, k陂ｯ�ｽｿ th逶ｻ�ｽｫa tinh hoa t逶ｻ�ｽｫ c�ｾ��ｽ｡c th陂ｯ�ｽｿ h逶ｻ�ｿｽ �ｾ�險ｴ tr�ｾ��ｽｰ逶ｻ雖ｩ.
              </p>
              <p className='mb-8 text-lg leading-relaxed text-earth/80'>
                Ch�ｾ��ｽｺng t�ｾ��ｽｴi kh�ｾ��ｽｴng ch逶ｻ�ｿｽ s陂ｯ�ｽ｣n xu陂ｯ�ｽ･t v陂ｯ�ｽｭt li逶ｻ緕｡ x�ｾ��ｽ｢y d逶ｻ�ｽｱng, m�ｾ��ｿｽ c�ｾ��ｽｲn g�ｾ��ｽｳp ph陂ｯ�ｽｧn b陂ｯ�ｽ｣o t逶ｻ貂｡ v�ｾ��ｿｽ ph�ｾ��ｽ｡t huy 
                gi�ｾ��ｽ｡ tr逶ｻ�ｿｽ v�ｾ�繝� h�ｾ��ｽｳa ki陂ｯ�ｽｿn tr�ｾ��ｽｺc truy逶ｻ�ｼｽ th逶ｻ蜑ｵg Vi逶ｻ繽� Nam.
              </p>
              <Link
                to='/gioi-thieu'
                className='group inline-flex items-center gap-2 font-semibold text-brick transition-colors hover:text-brick-dark'
              >
                T�ｾ��ｽｬm hi逶ｻ繝� th�ｾ��ｽｪm
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
              Danh m逶ｻ�ｽ･c s陂ｯ�ｽ｣n ph陂ｯ�ｽｩm
            </span>
            <h2 className='mb-4 font-serif text-3xl font-bold text-earth-dark md:text-4xl lg:text-5xl'>
              S陂ｯ�ｽ｣n ph陂ｯ�ｽｩm c逶ｻ�ｽｧa ch�ｾ��ｽｺng t�ｾ��ｽｴi
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-earth/70'>
              �ｾ�邏ｳ d陂ｯ�ｽ｡ng c�ｾ��ｽ｡c lo陂ｯ�ｽ｡i g陂ｯ�ｽ｡ch ng�ｾ��ｽｳi truy逶ｻ�ｼｽ th逶ｻ蜑ｵg, ph逶ｻ�ｽ･c v逶ｻ�ｽ･ m逶ｻ邨� nhu c陂ｯ�ｽｧu ki陂ｯ�ｽｿn tr�ｾ��ｽｺc
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
              Xem t陂ｯ�ｽ･t c陂ｯ�ｽ｣ s陂ｯ�ｽ｣n ph陂ｯ�ｽｩm
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Production Process Section */}
      <AnimatedSection id='quy-trinh' className='bg-earth-dark py-20 md:py-28'>
        <div className='container'>
          <div className='mb-16 text-center'>
            <span className='mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-gold'>
              Quy tr�ｾ��ｽｬnh s陂ｯ�ｽ｣n xu陂ｯ�ｽ･t
            </span>
            <h2 className='mb-4 font-serif text-3xl font-bold text-cream-light md:text-4xl lg:text-5xl'>
              Ngh逶ｻ�ｿｽ thu陂ｯ�ｽｭt th逶ｻ�ｽｧ c�ｾ��ｽｴng truy逶ｻ�ｼｽ th逶ｻ蜑ｵg
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-cream-light/70'>
              5 b�ｾ��ｽｰ逶ｻ雖ｩ t陂ｯ�ｽ｡o n�ｾ��ｽｪn nh逶ｻ�ｽｯng vi�ｾ��ｽｪn g陂ｯ�ｽ｡ch ng�ｾ��ｽｳi ho�ｾ��ｿｽn h陂ｯ�ｽ｣o
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
              D逶ｻ�ｽｱ �ｾ��ｽ｡n ti�ｾ��ｽｪu bi逶ｻ繝�
            </span>
            <h2 className='mb-4 font-serif text-3xl font-bold text-earth-dark md:text-4xl lg:text-5xl'>
              C�ｾ��ｽｴng tr�ｾ��ｽｬnh �ｾ�螯･�ｽ｣ th逶ｻ�ｽｱc hi逶ｻ繻ｻ
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-earth/70'>
              Nh逶ｻ�ｽｯng d逶ｻ�ｽｱ �ｾ��ｽ｡n ti�ｾ��ｽｪu bi逶ｻ繝� s逶ｻ�ｽｭ d逶ｻ�ｽ･ng s陂ｯ�ｽ｣n ph陂ｯ�ｽｩm g陂ｯ�ｽ｡ch ng�ｾ��ｽｳi c逶ｻ�ｽｧa ch�ｾ��ｽｺng t�ｾ��ｽｴi
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
              Xem t陂ｯ�ｽ･t c陂ｯ�ｽ｣ d逶ｻ�ｽｱ �ｾ��ｽ｡n
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection className='bg-cream py-20 md:py-28'>
        <div className='container'>
          <div className='mb-16 text-center'>
            <span className='mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-brick'>
              �ｾ�髱呻ｽ｡nh gi�ｾ��ｽ｡
            </span>
            <h2 className='mb-4 font-serif text-3xl font-bold text-earth-dark md:text-4xl lg:text-5xl'>
              Kh�ｾ��ｽ｡ch h�ｾ��ｿｽng n�ｾ��ｽｳi g�ｾ��ｽｬ v逶ｻ�ｿｽ ch�ｾ��ｽｺng t�ｾ��ｽｴi
            </h2>
          </div>

          <motion.div
            variants={staggerContainer}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'
          >
            {displayTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={fadeInUp}
                className='rounded-2xl bg-cream-light p-8 shadow-md'
              >
                <svg className='mb-4 h-10 w-10 text-brick/30' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
                </svg>
                <p className='mb-6 text-lg leading-relaxed text-earth/80'>{testimonial.content}</p>
                <div className='flex items-center gap-4'>
                  {testimonial.avatar?.startsWith('http') ? (
                    <img src={testimonial.avatar} alt={testimonial.name} className='h-12 w-12 rounded-full object-cover' />
                  ) : (
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-brick text-cream-light font-semibold'>
                      {testimonial.avatar || testimonial.name?.charAt(0)}
                    </div>
                  )}
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
            alt='X�ｾ��ｽｰ逶ｻ谿､g s陂ｯ�ｽ｣n xu陂ｯ�ｽ･t g陂ｯ�ｽ｡ch ng�ｾ��ｽｳi'
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
              B陂ｯ�ｽ｡n �ｾ�逍始g t�ｾ��ｽｬm v陂ｯ�ｽｭt li逶ｻ緕｡ mang gi�ｾ��ｽ｡ tr逶ｻ�ｿｽ truy逶ｻ�ｼｽ th逶ｻ蜑ｵg?
            </h2>
            <p className='mb-10 text-lg text-cream-light/80'>
              H�ｾ��ｽ｣y li�ｾ��ｽｪn h逶ｻ�ｿｽ v逶ｻ螫� ch�ｾ��ｽｺng t�ｾ��ｽｴi �ｾ�鮟幢ｽｻ�ｿｽ �ｾ�譟��ｽｰ逶ｻ�ｽ｣c t�ｾ��ｽｰ v陂ｯ�ｽ･n v�ｾ��ｿｽ b�ｾ��ｽ｡o gi�ｾ��ｽ｡ chi ti陂ｯ�ｽｿt nh陂ｯ�ｽ･t
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Link
                to='/lien-he'
                className='inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-4 font-semibold text-earth-dark transition-all hover:bg-gold-light hover:scale-105'
              >
                Li�ｾ��ｽｪn h逶ｻ�ｿｽ ngay
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
