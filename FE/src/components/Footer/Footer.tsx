import { Link } from 'react-router-dom'

const footerLinks = {
  products: [
    { name: 'Ngói âm dương', path: '/san-pham/ngoi-am-duong' },
    { name: 'Ngói mũi hài', path: '/san-pham/ngoi-mui-hai' },
    { name: 'Gạch lát sân', path: '/san-pham/gach-lat-san' },
    { name: 'Gạch xây cổ', path: '/san-pham/gach-xay-co' },
    { name: 'Gạch trang trí', path: '/san-pham/gach-trang-tri' }
  ],
  company: [
    { name: 'Về chúng tôi', path: '/gioi-thieu' },
    { name: 'Dự án', path: '/du-an' },
    { name: 'Quy trình sản xuất', path: '/#quy-trinh' },
    { name: 'Liên hệ', path: '/lien-he' }
  ]
}

export default function Footer() {
  return (
    <footer className='bg-earth-dark text-cream-light'>
      {/* Main Footer */}
      <div className='container py-12 md:py-16'>
        <div className='grid grid-cols-1 gap-8 sm:gap-10 md:gap-12 md:grid-cols-2 lg:grid-cols-4'>
          {/* Brand Column */}
          <div className='sm:col-span-1 md:col-span-2 lg:col-span-1'>
            <Link to='/' className='mb-6 inline-flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-brick flex-shrink-0'>
                <svg viewBox='0 0 40 40' className='h-8 w-8 fill-cream-light'>
                  <path d='M20 4L4 12v16l16 8 16-8V12L20 4zm0 4l12 6v12l-12 6-12-6V14l12-6z' />
                  <rect x='14' y='16' width='12' height='8' rx='1' />
                </svg>
              </div>
              <div>
                <h2 className='font-serif text-lg md:text-xl font-bold'>Gạch Ngói Việt</h2>
                <p className='text-xs text-cream-light/70'>Tinh hoa làng nghề</p>
              </div>
            </Link>
            <p className='mb-6 text-sm leading-relaxed text-cream-light/80'>
              Kế thừa và phát huy tinh hoa nghề làm gạch ngói truyền thống Việt Nam. 
              Sản phẩm thủ công, bền vững theo thời gian.
            </p>
            {/* Social Links */}
            <div className='flex gap-3'>
              <a
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-lg bg-cream-light/10 transition-colors hover:bg-brick'
                aria-label='Facebook'
              >
                <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
              </a>
              <a
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-lg bg-cream-light/10 transition-colors hover:bg-brick'
                aria-label='Zalo'
              >
                <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12.49 10.272v-.45h1.347v6.322h-.77a.576.576 0 01-.577-.573v-.166a2.987 2.987 0 01-1.837.621c-1.809 0-3.275-1.613-3.275-3.602 0-1.99 1.466-3.602 3.275-3.602a2.99 2.99 0 011.837.621v-.171zm-1.756 4.865c1.157 0 1.965-.896 1.965-2.035 0-1.138-.808-2.034-1.965-2.034-1.157 0-2.035.896-2.035 2.034 0 1.139.878 2.035 2.035 2.035z' />
                </svg>
              </a>
              <a
                href='#'
                className='flex h-10 w-10 items-center justify-center rounded-lg bg-cream-light/10 transition-colors hover:bg-brick'
                aria-label='YouTube'
              >
                <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                </svg>
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div className='sm:col-span-1 md:col-span-1'>
            <h3 className='mb-4 font-serif text-base md:text-lg font-semibold text-gold'>Sản phẩm</h3>
            <ul className='space-y-2'>
              {footerLinks.products.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className='text-sm text-cream-light/70 transition-colors hover:text-cream-light'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className='sm:col-span-1 md:col-span-1'>
            <h3 className='mb-4 font-serif text-base md:text-lg font-semibold text-gold'>Công ty</h3>
            <ul className='space-y-2'>
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className='text-sm text-cream-light/70 transition-colors hover:text-cream-light'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className='sm:col-span-1 md:col-span-2 lg:col-span-1'>
            <h3 className='mb-4 font-serif text-base md:text-lg font-semibold text-gold'>Liên hệ</h3>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3'>
                <svg className='mt-1 h-5 w-5 flex-shrink-0 text-brick' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
                <span className='text-sm text-cream-light/70'>
                  Làng nghề Bát Tràng, Gia Lâm, Hà Nội
                </span>
              </li>
              <li className='flex items-center gap-3'>
                <svg className='h-5 w-5 flex-shrink-0 text-brick' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
                <a href='tel:0987654321' className='text-sm text-cream-light/70 hover:text-cream-light'>
                  0987 654 321
                </a>
              </li>
              <li className='flex items-center gap-3'>
                <svg className='h-5 w-5 flex-shrink-0 text-brick' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                <a href='mailto:info@gachngoiviet.vn' className='text-sm text-cream-light/70 hover:text-cream-light'>
                  info@gachngoiviet.vn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-cream-light/10'>
        <div className='container flex flex-col items-center justify-between gap-3 py-4 md:py-6 text-center sm:flex-row sm:text-left'>
          <p className='text-xs md:text-sm text-cream-light/60'>
            &copy; {new Date().getFullYear()} Gạch Ngói Việt. Tất cả quyền được bảo lưu.
          </p>
          <p className='text-xs md:text-sm text-cream-light/60'>
            Giữ gìn và phát huy giá trị truyền thống Việt Nam
          </p>
        </div>
      </div>
    </footer>
  )
}
