import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteConfig } from 'src/contexts/siteConfig.context'

const DEFAULT_NAV_LINKS = [
  { name: 'Trang chủ', path: '/' },
  { name: 'Sản phẩm', path: '/san-pham' },
  { name: 'Dự án', path: '/du-an' },
  { name: 'Về chúng tôi', path: '/gioi-thieu' },
  { name: 'Liên hệ', path: '/lien-he' },
  { name: 'Hồ sơ năng lực', path: '/ho-so-nang-luc' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { config } = useSiteConfig()

  const navLinks = useMemo(() => {
    const headerLinks = config?.header?.navLinks

    if (headerLinks && headerLinks.length > 0) {
      return headerLinks.filter((link) => link.isEnabled)
    }

    return DEFAULT_NAV_LINKS
  }, [config?.header?.navLinks])

  const ctaText = config?.header?.ctaText || 'Liên hệ tư vấn'
  const ctaLink = config?.header?.ctaLink || '/lien-he'
  const isShowAdminLink = config?.header?.showAdminLink !== false

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 bg-earth-dark shadow-lg ${
        isScrolled ? 'py-3' : 'py-4'
      }`}
    >
      <div className='container'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-3'>
            {config?.logo ? (
              <img
                src={config.logo}
                alt={config.siteName}
                className='h-12 w-auto object-contain opacity-100'
              />
            ) : (
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-brick'>
                <svg viewBox='0 0 40 40' className='h-8 w-8 fill-cream-light'>
                  <path d='M20 4L4 12v16l16 8 16-8V12L20 4zm0 4l12 6v12l-12 6-12-6V14l12-6z' />
                  <rect x='14' y='16' width='12' height='8' rx='1' />
                </svg>
              </div>
            )}
            <div className='hidden sm:block'>
              <h1 className='font-serif text-xl font-bold text-cream-light'>
                {config?.siteName || 'Gạch Ngói Thủ công'}
              </h1>
              <p className='text-xs text-cream-light/80'>
                {config?.siteSlogan || 'Tinh hoa làng nghề'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden items-center gap-8 lg:flex'>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 px-1 text-sm font-medium transition-all duration-200 text-cream-light/90 hover:text-cream-light ${
                  location.pathname === link.path ? 'text-cream-light font-semibold' : ''
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId='activeNav'
                    className='absolute -bottom-1 left-1 right-1 h-1 rounded-full bg-gold'
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className='flex items-center gap-4'>
            {isShowAdminLink && (
              <Link
                to='/admin/dashboard'
                className='hidden rounded-lg px-3 py-2 text-xs font-semibold transition-all md:px-4 md:py-2.5 md:text-sm border bg-brick text-white border-brick hover:bg-brick-dark hover:border-brick-dark'
                title='Admin Panel'
              >
                Admin
              </Link>
            )}
            <Link
              to={ctaLink}
              className='hidden rounded-lg px-6 py-2.5 text-sm font-semibold transition-all hover:scale-105 sm:block bg-gold text-earth-dark hover:bg-gold-light'
            >
              {ctaText}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='flex h-10 w-10 items-center justify-center rounded-lg transition-colors lg:hidden bg-cream-light/20 text-cream-light'
              aria-label='Toggle menu'
            >
              <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                {isMobileMenuOpen ? (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                ) : (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='overflow-hidden bg-cream-light/95 backdrop-blur-sm lg:hidden'
          >
            <nav className='container flex flex-col gap-2 py-4'>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-brick text-cream-light'
                      : 'text-earth hover:bg-cream-dark'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to={ctaLink}
                className='mt-2 rounded-lg bg-gold px-4 py-3 text-center text-sm font-semibold text-earth-dark'
              >
                {ctaText}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
