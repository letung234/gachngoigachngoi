import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { useSiteConfig } from 'src/contexts/siteConfig.context'
import { Helmet } from 'react-helmet-async'

const teamMembers = [
  {
    name: 'Nguyễn Văn Minh',
    role: 'Nghệ nhân trưởng',
    experience: '40 năm kinh nghiệm',
    image: '/images/process/tao-hinh.jpg'
  },
  {
    name: 'Trần Thị Hoa',
    role: 'Quản lý sản xuất',
    experience: '25 năm kinh nghiệm',
    image: '/images/process/nhao-dat.jpg'
  },
  {
    name: 'Lê Văn Đức',
    role: 'Kỹ thuật nung lò',
    experience: '30 năm kinh nghiệm',
    image: '/images/process/nung-lo.jpg'
  }
]

const milestones = [
  { year: '1985', event: 'Thành lập xưởng sản xuất gạch ngói đầu tiên' },
  { year: '1995', event: 'Mở rộng quy mô, đầu tư lò nung hiện đại' },
  { year: '2005', event: 'Được công nhận là làng nghề truyền thống' },
  { year: '2010', event: 'Xuất khẩu sản phẩm sang các nước Đông Nam Á' },
  { year: '2015', event: 'Nhận giải thưởng Sản phẩm Thủ công Mỹ nghệ Việt Nam' },
  { year: '2020', event: 'Ứng dụng công nghệ kết hợp thủ công truyền thống' },
  { year: '2024', event: 'Ra mắt dòng sản phẩm cao cấp cho resort và biệt thự' }
]

const values = [
  {
    icon: (
      <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
      </svg>
    ),
    title: 'Chất Lượng',
    description: 'Cam kết sử dụng nguyên liệu tốt nhất, quy trình sản xuất nghiêm ngặt để tạo ra sản phẩm bền vững.'
  },
  {
    icon: (
      <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
      </svg>
    ),
    title: 'Truyền Thống',
    description: 'Gìn giữ và phát huy tinh hoa làng nghề hàng trăm năm của cha ông để lại.'
  },
  {
    icon: (
      <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
      </svg>
    ),
    title: 'Tận Tâm',
    description: 'Luôn lắng nghe và đáp ứng mọi yêu cầu của khách hàng một cách tận tình nhất.'
  },
  {
    icon: (
      <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
      </svg>
    ),
    title: 'Bền Vững',
    description: 'Sản xuất thân thiện với môi trường, sử dụng nguyên liệu tự nhiên và quy trình xanh.'
  }
]

export default function About() {
  const { config } = useSiteConfig()

  // Get data from config with fallbacks
  const title = config?.aboutPage?.title || 'Về Chúng Tôi'
  const subtitle = config?.aboutPage?.subtitle || 'Gần 40 năm gìn giữ và phát triển nghề gạch ngói truyền thống'
  const heroImage = config?.aboutPage?.heroImage || '/images/craftsman.jpg'
  const content = config?.aboutPage?.content ||
    'Khởi nguồn từ một xưởng sản xuất nhỏ tại làng nghề truyền thống, chúng tôi đã không ngừng phát triển và hoàn thiện qua gần 4 thập kỷ.'

  const missionTitle = config?.aboutPage?.missionTitle || 'Sứ Mệnh'
  const missionContent = config?.aboutPage?.missionContent ||
    'Gìn giữ và phát huy giá trị văn hóa truyền thống, mang đến những sản phẩm gạch ngói chất lượng cao cho mọi công trình.'

  const visionTitle = config?.aboutPage?.visionTitle || 'Tầm Nhìn'
  const visionContent = config?.aboutPage?.visionContent ||
    'Trở thành thương hiệu gạch ngói truyền thống hàng đầu Việt Nam, góp phần bảo tồn và phát triển làng nghề.'

  const teamMembersFromConfig = config?.aboutPage?.teamMembers || []
  const hasTeamMembers = teamMembersFromConfig.length > 0

  const displayTeamMembers = hasTeamMembers ? teamMembersFromConfig : teamMembers

  return (
    <div className='bg-cream-light'>
      <Helmet>
        <title>{title} | {config?.siteName || 'Gạch Ngói Việt'}</title>
        <meta name='description' content={subtitle} />
      </Helmet>
      {/* Hero Section */}
      <section className='relative h-[50vh] md:h-[60vh] flex items-center justify-center'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-earth-dark/90 to-earth/70'></div>
        </div>
        <div className='relative z-10 text-center text-white px-4'>
          <h1 className='font-serif text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-fade-in-up'>
            {title}
          </h1>
          <p className='text-base md:text-xl max-w-2xl mx-auto opacity-90 animate-fade-in-up animation-delay-200'>
            {subtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className='py-12 md:py-20'>
        <div className='container'>
          <div className='grid lg:grid-cols-2 gap-8 md:gap-16 items-center'>
            <div className='order-2 lg:order-1'>
              <span className='text-brick font-medium uppercase tracking-wider text-sm'>Câu Chuyện Của Chúng Tôi</span>
              <h2 className='font-serif text-2xl md:text-4xl font-bold text-earth-dark mt-2 mb-4 md:mb-6'>
                Từ Làng Nghề Đến Thương Hiệu Uy Tín
              </h2>
              <div className='space-y-4 text-earth leading-relaxed text-sm md:text-base'>
                {content.split('\n').map((paragraph, index) =>
                  paragraph.trim() ? (
                    <p key={index}>{paragraph.trim()}</p>
                  ) : null
                )}
              </div>
            </div>
            <div className='order-1 lg:order-2'>
              <div className='relative'>
                <img
                  src='/images/hero-bg.jpg'
                  alt='Làng nghề gạch ngói truyền thống'
                  className='rounded-2xl shadow-2xl w-full'
                />
                <div className='absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-brick text-white p-4 md:p-6 rounded-xl shadow-lg'>
                  <div className='text-3xl md:text-4xl font-bold font-serif'>40+</div>
                  <div className='text-xs md:text-sm opacity-90'>Năm Kinh Nghiệm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className='py-12 md:py-20 bg-white'>
        <div className='container'>
          <div className='text-center mb-10 md:mb-16'>
            <span className='text-brick font-medium uppercase tracking-wider text-sm'>Giá Trị Cốt Lõi</span>
            <h2 className='font-serif text-2xl md:text-4xl font-bold text-earth-dark mt-2'>
              Những Điều Chúng Tôi Trân Trọng
            </h2>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'>
            {values.map((value, index) => (
              <div
                key={index}
                className='text-center p-6 md:p-8 rounded-2xl bg-cream-light hover:bg-cream transition-colors duration-300'
              >
                <div className='inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-brick/10 text-brick mb-4 md:mb-6'>
                  {value.icon}
                </div>
                <h3 className='font-serif text-lg md:text-xl font-bold text-earth-dark mb-2 md:mb-3'>{value.title}</h3>
                <p className='text-earth text-sm leading-relaxed'>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className='py-12 md:py-20'>
        <div className='container'>
          <div className='grid md:grid-cols-2 gap-8 md:gap-12'>
            {/* Mission */}
            <div className='rounded-2xl bg-gradient-to-br from-brick to-brick-dark text-white p-8 md:p-10 shadow-xl'>
              <div className='mb-6'>
                <svg className='w-12 h-12 md:w-16 md:h-16 opacity-80' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                </svg>
              </div>
              <h3 className='font-serif text-2xl md:text-3xl font-bold mb-4'>{missionTitle}</h3>
              <p className='text-cream-light/90 leading-relaxed'>{missionContent}</p>
            </div>

            {/* Vision */}
            <div className='rounded-2xl bg-gradient-to-br from-gold to-gold-dark text-white p-8 md:p-10 shadow-xl'>
              <div className='mb-6'>
                <svg className='w-12 h-12 md:w-16 md:h-16 opacity-80' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                </svg>
              </div>
              <h3 className='font-serif text-2xl md:text-3xl font-bold mb-4'>{visionTitle}</h3>
              <p className='text-white/90 leading-relaxed'>{visionContent}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className='py-12 md:py-20'>
        <div className='container'>
          <div className='text-center mb-10 md:mb-16'>
            <span className='text-brick font-medium uppercase tracking-wider text-sm'>Hành Trình Phát Triển</span>
            <h2 className='font-serif text-2xl md:text-4xl font-bold text-earth-dark mt-2'>
              Các Cột Mốc Quan Trọng
            </h2>
          </div>
          <div className='relative'>
            {/* Timeline line */}
            <div className='absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-brick/20 transform md:-translate-x-1/2'></div>
            
            <div className='space-y-6 md:space-y-8'>
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Timeline dot */}
                  <div className='absolute left-4 md:left-1/2 w-4 h-4 bg-brick rounded-full transform -translate-x-1/2 z-10 border-4 border-cream-light'></div>
                  
                  {/* Content */}
                  <div className={`w-full md:w-1/2 pl-10 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className='bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow'>
                      <span className='text-brick font-bold text-lg md:text-xl'>{milestone.year}</span>
                      <p className='text-earth mt-2 text-sm md:text-base'>{milestone.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-12 md:py-20 bg-white'>
        <div className='container'>
          <div className='text-center mb-10 md:mb-16'>
            <span className='text-brick font-medium uppercase tracking-wider text-sm'>Đội Ngũ</span>
            <h2 className='font-serif text-2xl md:text-4xl font-bold text-earth-dark mt-2'>
              {hasTeamMembers ? 'Những Bàn Tay Vàng' : 'Đội Ngũ Nghệ Nhân'}
            </h2>
          </div>
          {displayTeamMembers.length > 0 ? (
            <div className='grid md:grid-cols-3 gap-6 md:gap-8'>
              {displayTeamMembers.map((member: any, index: number) => (
                <div
                  key={index}
                  className='group text-center'
                >
                  <div className='relative overflow-hidden rounded-2xl mb-4 md:mb-6'>
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className='w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-110'
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.src = '/images/process/tao-hinh.jpg'
                        }}
                      />
                    ) : (
                      <div className='w-full aspect-[4/5] bg-gradient-to-br from-brick to-brick-dark flex items-center justify-center'>
                        <span className='text-6xl font-bold text-white'>{member.name?.charAt(0) || '?'}</span>
                      </div>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-earth-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  </div>
                  <h3 className='font-serif text-lg md:text-xl font-bold text-earth-dark'>{member.name}</h3>
                  <p className='text-brick font-medium text-sm md:text-base'>{member.role}</p>
                  {member.experience && <p className='text-earth text-sm mt-1'>{member.experience}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className='rounded-2xl border-2 border-dashed border-cement/30 bg-cream-light/50 p-12 text-center'>
              <svg className='mx-auto mb-4 h-16 w-16 text-cement/40' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
              </svg>
              <h3 className='mb-2 text-xl font-semibold text-earth/70'>Chưa có thông tin đội ngũ</h3>
              <p className='text-earth/50'>Thông tin về đội ngũ sẽ được cập nhật sớm</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-12 md:py-20 bg-brick'>
        <div className='container text-center'>
          <h2 className='font-serif text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6'>
            Hãy Để Chúng Tôi Đồng Hành Cùng Bạn
          </h2>
          <p className='text-white/90 max-w-2xl mx-auto mb-6 md:mb-8 text-sm md:text-base'>
            Dù bạn đang xây dựng ngôi nhà mơ ước hay trùng tu công trình di sản, 
            chúng tôi luôn sẵn sàng tư vấn và cung cấp giải pháp tốt nhất.
          </p>
          <Link 
            to={path.contact}
            className='inline-flex items-center gap-2 bg-white text-brick px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-cream transition-colors text-sm md:text-base'
          >
            Liên Hệ Ngay
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
