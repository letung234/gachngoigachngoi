import { useState } from 'react'
import http from 'src/utils/http'

const contactInfo = [
  {
    icon: (
      <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
      </svg>
    ),
    title: 'ﾄ雪ｻ蟻 ch盻�',
    content: ['Lﾃ�ng ngh盻� g蘯｡ch ngﾃｳi Bﾃ｡t Trﾃ�ng', 'Gia Lﾃ｢m, Hﾃ� N盻冓, Vi盻㏄ Nam']
  },
  {
    icon: (
      <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
      </svg>
    ),
    title: 'ﾄ進盻㌻ tho蘯｡i',
    content: ['Hotline: 1900 xxxx', 'Di ﾄ黛ｻ冢g: 0912 345 678']
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
    title: 'Gi盻� lﾃ�m vi盻㌘',
    content: ['Th盻ｩ 2 - Th盻ｩ 7: 8:00 - 17:30', 'Ch盻ｧ nh蘯ｭt: 8:00 - 12:00']
  }
]

const faqs = [
  {
    question: 'Th盻拱 gian giao hﾃ�ng lﾃ� bao lﾃ｢u?',
    answer: 'Th盻拱 gian giao hﾃ�ng ph盻･ thu盻冂 vﾃ�o s盻� lﾆｰ盻｣ng ﾄ黛ｺｷt hﾃ�ng vﾃ� ﾄ黛ｻ蟻 ﾄ訴盻ノ giao. Thﾃｴng thﾆｰ盻拵g t盻ｫ 7-14 ngﾃ�y lﾃ�m vi盻㌘ cho ﾄ柁｡n hﾃ�ng trong nﾆｰ盻嫩 vﾃ� 30-45 ngﾃ�y cho ﾄ柁｡n hﾃ�ng xu蘯･t kh蘯ｩu.'
  },
  {
    question: 'Cﾃｳ h盻� tr盻｣ thi cﾃｴng l蘯ｯp ﾄ黛ｺｷt khﾃｴng?',
    answer: 'Cﾃｳ, chﾃｺng tﾃｴi cﾃｳ ﾄ黛ｻ冓 ngﾅｩ k盻ｹ thu蘯ｭt viﾃｪn giﾃ�u kinh nghi盻㍊ h盻� tr盻｣ tﾆｰ v蘯･n vﾃ� giﾃ｡m sﾃ｡t thi cﾃｴng. Chi phﾃｭ thi cﾃｴng s蘯ｽ ﾄ柁ｰ盻｣c bﾃ｡o giﾃ｡ riﾃｪng tﾃｹy theo cﾃｴng trﾃｬnh.'
  },
  {
    question: 'Chﾃｭnh sﾃ｡ch b蘯｣o hﾃ�nh nhﾆｰ th蘯ｿ nﾃ�o?',
    answer: 'T蘯･t c蘯｣ s蘯｣n ph蘯ｩm c盻ｧa chﾃｺng tﾃｴi ﾄ柁ｰ盻｣c b蘯｣o hﾃ�nh 10 nﾄノ v盻� ch蘯･t lﾆｰ盻｣ng v蘯ｭt li盻㎡. Riﾃｪng dﾃｲng s蘯｣n ph蘯ｩm cao c蘯･p ﾄ柁ｰ盻｣c b蘯｣o hﾃ�nh lﾃｪn ﾄ黛ｺｿn 25 nﾄノ.'
  },
  {
    question: 'Cﾃｳ nh蘯ｭn s蘯｣n xu蘯･t theo m蘯ｫu riﾃｪng khﾃｴng?',
    answer: 'Cﾃｳ, chﾃｺng tﾃｴi nh蘯ｭn s蘯｣n xu蘯･t theo yﾃｪu c蘯ｧu v盻嬖 s盻� lﾆｰ盻｣ng t盻訴 thi盻ブ 500mﾂｲ cho ngﾃｳi vﾃ� 200mﾂｲ cho g蘯｡ch. Vui lﾃｲng liﾃｪn h盻� ﾄ黛ｻ� ﾄ柁ｰ盻｣c tﾆｰ v蘯･n chi ti蘯ｿt.'
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
    
    try {
      await http.post('/contact', formData)
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('Submit contact error:', error)
    } finally {
      setIsSubmitting(false)
    }
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
            Liﾃｪn H盻�
          </h1>
          <p className='text-base md:text-xl max-w-2xl mx-auto opacity-90 animate-fade-in-up animation-delay-200'>
            Chﾃｺng tﾃｴi luﾃｴn s蘯ｵn sﾃ�ng l蘯ｯng nghe vﾃ� h盻� tr盻｣ b蘯｡n
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
              <span className='text-brick font-medium uppercase tracking-wider text-sm'>G盻ｭi Tin Nh蘯ｯn</span>
              <h2 className='font-serif text-2xl md:text-4xl font-bold text-earth-dark mt-2 mb-6 md:mb-8'>
                Liﾃｪn H盻� V盻嬖 Chﾃｺng Tﾃｴi
              </h2>

              {submitSuccess && (
                <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700'>
                  C蘯｣m ﾆ｡n b蘯｡n ﾄ妥｣ liﾃｪn h盻�! Chﾃｺng tﾃｴi s蘯ｽ ph蘯｣n h盻妬 trong th盻拱 gian s盻嬶 nh蘯･t.
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='grid sm:grid-cols-2 gap-5'>
                  <div>
                    <label className='block text-earth-dark font-medium mb-2 text-sm' htmlFor='name'>
                      H盻� vﾃ� tﾃｪn *
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-brick focus:ring-2 focus:ring-brick/20 outline-none transition-all text-sm'
                      placeholder='Nguy盻�n Vﾄハ A'
                    />
                  </div>
                  <div>
                    <label className='block text-earth-dark font-medium mb-2 text-sm' htmlFor='phone'>
                      S盻� ﾄ訴盻㌻ tho蘯｡i *
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
                    Ch盻ｧ ﾄ黛ｻ�
                  </label>
                  <select
                    id='subject'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    className='w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-brick focus:ring-2 focus:ring-brick/20 outline-none transition-all text-sm bg-white'
                  >
                    <option value=''>Ch盻肱 ch盻ｧ ﾄ黛ｻ�</option>
                    <option value='bao-gia'>Yﾃｪu c蘯ｧu bﾃ｡o giﾃ｡</option>
                    <option value='tu-van'>Tﾆｰ v蘯･n s蘯｣n ph蘯ｩm</option>
                    <option value='hop-tac'>H盻｣p tﾃ｡c kinh doanh</option>
                    <option value='khac'>Khﾃ｡c</option>
                  </select>
                </div>

                <div>
                  <label className='block text-earth-dark font-medium mb-2 text-sm' htmlFor='message'>
                    N盻冓 dung tin nh蘯ｯn *
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className='w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-brick focus:ring-2 focus:ring-brick/20 outline-none transition-all resize-none text-sm'
                    placeholder='Mﾃｴ t蘯｣ chi ti蘯ｿt yﾃｪu c蘯ｧu c盻ｧa b蘯｡n...'
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
                      ﾄ紳ng g盻ｭi...
                    </>
                  ) : (
                    <>
                      G盻ｭi Tin Nh蘯ｯn
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
              <span className='text-brick font-medium uppercase tracking-wider text-sm'>V盻� Trﾃｭ</span>
              <h2 className='font-serif text-2xl md:text-4xl font-bold text-earth-dark mt-2 mb-6 md:mb-8'>
                Tﾃｬm ﾄ雪ｺｿn Chﾃｺng Tﾃｴi
              </h2>
              <div className='rounded-xl overflow-hidden shadow-lg h-[300px] md:h-[450px]'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9386096308836!2d105.90668931540175!3d21.036726792829847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a5c1b9d2d0a1%3A0x9d9d9d9d9d9d9d9d!2zTMOgbmcgZ-G7kW0gQuDooyBUcsOgbmc!5e0!3m2!1svi!2s!4v1629876543210!5m2!1svi!2s'
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                  title='B蘯｣n ﾄ黛ｻ� v盻� trﾃｭ'
                ></iframe>
              </div>
              <div className='mt-6 p-4 md:p-6 bg-white rounded-xl shadow-md'>
                <h3 className='font-serif text-lg font-bold text-earth-dark mb-3'>Hﾆｰ盻嬾g d蘯ｫn ﾄ柁ｰ盻拵g ﾄ訴</h3>
                <p className='text-earth text-sm leading-relaxed'>
                  T盻ｫ trung tﾃ｢m Hﾃ� N盻冓, ﾄ訴 theo hﾆｰ盻嬾g c蘯ｧu Chﾆｰﾆ｡ng Dﾆｰﾆ｡ng, r蘯ｽ ph蘯｣i vﾃ�o qu盻祖 l盻� 5. 
                  ﾄ進 th蘯ｳng kho蘯｣ng 15km, r蘯ｽ trﾃ｡i t蘯｡i ngﾃ｣ ba Bﾃ｡t Trﾃ�ng. Xﾆｰ盻殤g s蘯｣n xu蘯･t n蘯ｱm bﾃｪn tay ph蘯｣i, 
                  cﾃ｡ch c盻貧g lﾃ�ng kho蘯｣ng 500m.
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
              Cﾃ｢u H盻淑 Thﾆｰ盻拵g G蘯ｷp
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
                C蘯ｧn tﾆｰ v蘯･n nhanh?
              </h3>
              <p className='text-white/80 text-sm md:text-base'>
                G盻絞 ngay hotline ﾄ黛ｻ� ﾄ柁ｰ盻｣c h盻� tr盻｣ t盻ｩc thﾃｬ
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
