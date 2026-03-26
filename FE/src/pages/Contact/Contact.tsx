import { useState } from 'react'

const contactInfo = [
  {
    icon: (
      <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
      </svg>
    ),
    title: 'Địa chỉ',
    content: ['Làng nghề gạch ngói Bát Tràng', 'Gia Lâm, Hà Nội, Việt Nam']
  },
  {
    icon: (
      <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
      </svg>
    ),
    title: 'Điện thoại',
    content: ['Hotline: 1900 xxxx', 'Di động: 0912 345 678']
  },
  {
    icon: (
      <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
      </svg>
    ),
    title: 'Email',
    content: ['info@gachngoiviet.com', 'sales@gachngoiviet.com']
  },
  {
    icon: (
      <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
      </svg>
    ),
    title: 'Giờ làm việc',
    content: ['Thứ 2 - Thứ 7: 8:00 - 17:30', 'Chủ nhật: 8:00 - 12:00']
  }
]

const faqs = [
  {
    question: 'Thời gian giao hàng là bao lâu?',
    answer: 'Thời gian giao hàng phụ thuộc vào số lượng đặt hàng và địa điểm giao. Thông thường từ 7-14 ngày làm việc cho đơn hàng trong nước và 30-45 ngày cho đơn hàng xuất khẩu.'
  },
  {
    question: 'Có hỗ trợ thi công lắp đặt không?',
    answer: 'Có, chúng tôi có đội ngũ kỹ thuật viên giàu kinh nghiệm hỗ trợ tư vấn và giám sát thi công. Chi phí thi công sẽ được báo giá riêng tùy theo công trình.'
  },
  {
    question: 'Chính sách bảo hành như thế nào?',
    answer: 'Tất cả sản phẩm của chúng tôi được bảo hành 10 năm về chất lượng vật liệu. Riêng dòng sản phẩm cao cấp được bảo hành lên đến 25 năm.'
  },
  {
    question: 'Có nhận sản xuất theo mẫu riêng không?',
    answer: 'Có, chúng tôi nhận sản xuất theo yêu cầu với số lượng tối thiểu 500m² cho ngói và 200m² cho gạch. Vui lòng liên hệ để được tư vấn chi tiết.'
  }
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className='bg-cream-light'>
      {/* Hero Section */}
      <section className='relative h-[40vh] md:h-[50vh] flex items-center justify-center'>
        <div 
          className='absolute inset-0 bg-cover bg-center'
          style={{ backgroundImage: 'url(/images/cta-bg.jpg)' }}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-earth-dark/90 to-earth/70'></div>
        </div>
        <div className='relative z-10 text-center text-white px-4'>
          <h1 className='font-serif text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-fade-in-up'>
            Liên Hệ
          </h1>
          <p className='text-base md:text-xl max-w-2xl mx-auto opacity-90 animate-fade-in-up animation-delay-200'>
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className='py-12 md:py-16'>
        <div className='container'>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 -mt-16 md:-mt-20 relative z-20'>
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className='bg-white p-5 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow'
              >
                <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-brick/10 text-brick mb-4'>
                  {info.icon}
                </div>
                <h3 className='font-serif text-lg font-bold text-earth-dark mb-2'>{info.title}</h3>
                {info.content.map((line, i) => (
                  <p key={i} className='text-earth text-sm'>{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className='py-12 md:py-20'>
        <div className='container'>
          <div className='grid lg:grid-cols-2 gap-8 md:gap-12'>
            {/* Contact Form */}
            <div>
              <span className='text-brick font-medium uppercase tracking-wider text-sm'>Gửi Tin Nhắn</span>
              <h2 className='font-serif text-2xl md:text-4xl font-bold text-earth-dark mt-2 mb-6 md:mb-8'>
                Liên Hệ Với Chúng Tôi
              </h2>

              {submitSuccess && (
                <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700'>
                  Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='grid sm:grid-cols-2 gap-5'>
                  <div>
                    <label className='block text-earth-dark font-medium mb-2 text-sm' htmlFor='name'>
                      Họ và tên *
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-brick focus:ring-2 focus:ring-brick/20 outline-none transition-all text-sm'
                      placeholder='Nguyễn Văn A'
                    />
                  </div>
                  <div>
                    <label className='block text-earth-dark font-medium mb-2 text-sm' htmlFor='phone'>
                      Số điện thoại *
                    </label>
                    <input
                      type='tel'
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-brick focus:ring-2 focus:ring-brick/20 outline-none transition-all text-sm'
                      placeholder='0912 345 678'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-earth-dark font-medium mb-2 text-sm' htmlFor='email'>
                    Email *
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-brick focus:ring-2 focus:ring-brick/20 outline-none transition-all text-sm'
                    placeholder='email@example.com'
                  />
                </div>

                <div>
                  <label className='block text-earth-dark font-medium mb-2 text-sm' htmlFor='subject'>
                    Chủ đề
                  </label>
                  <select
                    id='subject'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    className='w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-brick focus:ring-2 focus:ring-brick/20 outline-none transition-all text-sm bg-white'
                  >
                    <option value=''>Chọn chủ đề</option>
                    <option value='bao-gia'>Yêu cầu báo giá</option>
                    <option value='tu-van'>Tư vấn sản phẩm</option>
                    <option value='hop-tac'>Hợp tác kinh doanh</option>
                    <option value='khac'>Khác</option>
                  </select>
                </div>

                <div>
                  <label className='block text-earth-dark font-medium mb-2 text-sm' htmlFor='message'>
                    Nội dung tin nhắn *
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className='w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-brick focus:ring-2 focus:ring-brick/20 outline-none transition-all resize-none text-sm'
                    placeholder='Mô tả chi tiết yêu cầu của bạn...'
                  ></textarea>
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full sm:w-auto px-8 py-3 bg-brick text-white font-semibold rounded-lg hover:bg-brick-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm'
                >
                  {isSubmitting ? (
                    <>
                      <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      Gửi Tin Nhắn
                      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map */}
            <div>
              <span className='text-brick font-medium uppercase tracking-wider text-sm'>Vị Trí</span>
              <h2 className='font-serif text-2xl md:text-4xl font-bold text-earth-dark mt-2 mb-6 md:mb-8'>
                Tìm Đến Chúng Tôi
              </h2>
              <div className='rounded-xl overflow-hidden shadow-lg h-[300px] md:h-[450px]'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9386096308836!2d105.90668931540175!3d21.036726792829847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a5c1b9d2d0a1%3A0x9d9d9d9d9d9d9d9d!2zTMOgbmcgZ-G7kW0gQuDooyBUcsOgbmc!5e0!3m2!1svi!2s!4v1629876543210!5m2!1svi!2s'
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                  title='Bản đồ vị trí'
                ></iframe>
              </div>
              <div className='mt-6 p-4 md:p-6 bg-white rounded-xl shadow-md'>
                <h3 className='font-serif text-lg font-bold text-earth-dark mb-3'>Hướng dẫn đường đi</h3>
                <p className='text-earth text-sm leading-relaxed'>
                  Từ trung tâm Hà Nội, đi theo hướng cầu Chương Dương, rẽ phải vào quốc lộ 5. 
                  Đi thẳng khoảng 15km, rẽ trái tại ngã ba Bát Tràng. Xưởng sản xuất nằm bên tay phải, 
                  cách cổng làng khoảng 500m.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-12 md:py-20 bg-white'>
        <div className='container'>
          <div className='text-center mb-10 md:mb-16'>
            <span className='text-brick font-medium uppercase tracking-wider text-sm'>FAQ</span>
            <h2 className='font-serif text-2xl md:text-4xl font-bold text-earth-dark mt-2'>
              Câu Hỏi Thường Gặp
            </h2>
          </div>

          <div className='max-w-3xl mx-auto space-y-4'>
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className='border border-cream-dark rounded-xl overflow-hidden'
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className='w-full flex items-center justify-between p-4 md:p-5 text-left bg-cream-light hover:bg-cream transition-colors'
                >
                  <span className='font-semibold text-earth-dark pr-4 text-sm md:text-base'>{faq.question}</span>
                  <svg 
                    className={`w-5 h-5 text-brick flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} 
                    fill='none' 
                    viewBox='0 0 24 24' 
                    stroke='currentColor'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className='p-4 md:p-5 bg-white border-t border-cream-dark'>
                    <p className='text-earth leading-relaxed text-sm md:text-base'>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className='py-12 md:py-16 bg-earth-dark'>
        <div className='container'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
            <div className='text-center md:text-left'>
              <h3 className='font-serif text-xl md:text-2xl font-bold text-white mb-2'>
                Cần tư vấn nhanh?
              </h3>
              <p className='text-white/80 text-sm md:text-base'>
                Gọi ngay hotline để được hỗ trợ tức thì
              </p>
            </div>
            <a 
              href='tel:1900xxxx'
              className='inline-flex items-center gap-3 bg-brick text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-brick-light transition-colors text-sm md:text-base'
            >
              <svg className='w-5 h-5 md:w-6 md:h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
              </svg>
              1900 XXXX
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
