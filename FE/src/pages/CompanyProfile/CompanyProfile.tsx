import { useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useSiteConfig } from 'src/contexts/siteConfig.context'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export default function CompanyProfile() {
  const { config } = useSiteConfig()
  const profileRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const cp = config?.companyProfile

  const companyName = cp?.companyName || config?.siteName || 'Gạch Ngói Việt'
  const foundedYear = cp?.foundedYear || '1995'
  const description = cp?.description || 'Chuyên sản xuất và cung cấp gạch ngói truyền thống Việt Nam với hơn 30 năm kinh nghiệm.'
  const coreValues = cp?.coreValues?.length ? cp.coreValues : ['Chất lượng', 'Uy tín', 'Sáng tạo', 'Bền vững']
  const achievements = cp?.achievements?.length ? cp.achievements : [
    { title: 'ISO 9001:2015', description: 'Chứng nhận hệ thống quản lý chất lượng', icon: '⭐' },
    { title: '500+ Dự án', description: 'Đã hoàn thành trên toàn quốc', icon: '🏗️' },
    { title: 'Top 10 Thương hiệu', description: 'Vật liệu xây dựng Việt Nam', icon: '🏆' },
  ]
  const companyStats = cp?.stats?.length ? cp.stats : [
    { label: 'Năm kinh nghiệm', value: '30', suffix: '+' },
    { label: 'Dự án hoàn thành', value: '500', suffix: '+' },
    { label: 'Khách hàng', value: '1000', suffix: '+' },
    { label: 'Tỉnh thành', value: '63', suffix: '' },
  ]
  const clients = cp?.clients?.length ? cp.clients : []
  const certifications = cp?.certifications?.length ? cp.certifications : []

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleExportPDF = async () => {
    if (!profileRef.current) return
    setIsExporting(true)

    try {
      const canvas = await html2canvas(profileRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FEFCF3',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      let heightLeft = pdfHeight
      let position = 0
      const pageHeight = pdf.internal.pageSize.getHeight()

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
        heightLeft -= pageHeight
      }

      pdf.save('ho-so-nang-luc-' + companyName.replace(/\s+/g, '-').toLowerCase() + '.pdf')
    } catch (err) {
      console.error('PDF export error:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Hồ sơ năng lực - {companyName}</title>
      </Helmet>

      {/* Action bar */}
      <div className='sticky top-0 z-30 bg-earth-dark/95 backdrop-blur-sm'>
        <div className='container flex items-center justify-between py-3'>
          <h2 className='text-sm font-semibold text-cream-light md:text-base'>Hồ sơ năng lực công ty</h2>
          <div className='flex items-center gap-3'>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className='inline-flex items-center gap-2 rounded-lg bg-brick px-3 py-1.5 text-xs font-medium text-white hover:bg-brick-dark disabled:opacity-50 md:px-4 md:py-2 md:text-sm'
            >
              {isExporting ? 'Đang xuất...' : 'Xuất PDF'}
            </button>
            <div className='hidden items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 md:flex'>
              <QRCodeSVG value={currentUrl} size={28} bgColor='transparent' fgColor='#FEFCF3' />
              <span className='text-xs text-cream-light/70'>Quét QR</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={profileRef}>
        {/* Hero */}
        <section className='relative overflow-hidden bg-gradient-to-br from-earth-dark via-earth to-brick-dark py-20 md:py-32'>
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute -left-20 -top-20 h-80 w-80 rounded-full bg-gold' />
            <div className='absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-brick' />
          </div>
          <div className='container relative text-center'>
            <motion.div initial='hidden' animate='visible' variants={fadeInUp}>
              {config?.logo && (
                <img src={config.logo} alt={companyName} className='mx-auto mb-6 h-16 w-auto md:h-20' />
              )}
              <h1 className='mb-4 font-serif text-3xl font-bold text-cream-light md:text-5xl lg:text-6xl'>
                {companyName}
              </h1>
              <p className='mx-auto max-w-2xl text-lg text-cream-light/80'>
                {description}
              </p>
              <div className='mt-4 text-sm text-gold'>
                Thành lập năm {foundedYear}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className='bg-cream-light py-12 md:py-16'>
          <div className='container'>
            <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
              {companyStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className='text-center'
                >
                  <div className='text-3xl font-bold text-brick md:text-4xl'>
                    {stat.value}<span className='text-gold'>{stat.suffix}</span>
                  </div>
                  <p className='mt-1 text-sm text-earth/70'>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className='bg-white py-12 md:py-20'>
          <div className='container'>
            <h2 className='mb-10 text-center font-serif text-2xl font-bold text-earth-dark md:text-3xl'>
              Giá trị cốt lõi
            </h2>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {coreValues.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className='rounded-xl border border-cream-dark bg-cream-light p-6 text-center'
                >
                  <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brick/10 text-xl'>
                    {i === 0 ? '⭐' : i === 1 ? '🤝' : i === 2 ? '💡' : '🌿'}
                  </div>
                  <h3 className='font-semibold text-earth-dark'>{value}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        {achievements.length > 0 && (
          <section className='bg-earth-dark py-12 md:py-20'>
            <div className='container'>
              <h2 className='mb-10 text-center font-serif text-2xl font-bold text-cream-light md:text-3xl'>
                Thành tựu nổi bật
              </h2>
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {achievements.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className='rounded-xl bg-earth/30 p-6'
                  >
                    <div className='mb-3 text-3xl'>{item.icon}</div>
                    <h3 className='mb-2 text-lg font-semibold text-cream-light'>{item.title}</h3>
                    <p className='text-sm text-cream-light/70'>{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Clients */}
        {clients.length > 0 && (
          <section className='bg-cream-light py-12 md:py-20'>
            <div className='container'>
              <h2 className='mb-10 text-center font-serif text-2xl font-bold text-earth-dark md:text-3xl'>
                Khách hàng tiêu biểu
              </h2>
              <div className='grid grid-cols-3 gap-6 md:grid-cols-4 lg:grid-cols-6'>
                {clients.map((client, i) => (
                  <div key={i} className='flex items-center justify-center rounded-lg bg-white p-4 shadow-sm'>
                    {client.logo ? (
                      <img src={client.logo} alt={client.name} className='h-12 w-auto object-contain' />
                    ) : (
                      <span className='text-sm font-medium text-earth'>{client.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className='bg-white py-12 md:py-20'>
            <div className='container'>
              <h2 className='mb-10 text-center font-serif text-2xl font-bold text-earth-dark md:text-3xl'>
                Chứng nhận & Giải thưởng
              </h2>
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {certifications.map((cert, i) => (
                  <div key={i} className='rounded-xl border border-cream-dark p-6 text-center'>
                    {cert.image && <img src={cert.image} alt={cert.name} className='mx-auto mb-4 h-20 w-auto' />}
                    <h3 className='font-semibold text-earth-dark'>{cert.name}</h3>
                    {cert.year && <p className='mt-1 text-sm text-earth/60'>{cert.year}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* QR Section */}
        <section className='bg-gradient-to-r from-brick to-brick-dark py-12 md:py-16'>
          <div className='container text-center'>
            <h2 className='mb-6 font-serif text-2xl font-bold text-cream-light md:text-3xl'>
              Quét mã QR để xem hồ sơ
            </h2>
            <div className='mx-auto inline-block rounded-xl bg-white p-4'>
              <QRCodeSVG value={currentUrl} size={180} level='H' />
            </div>
            <p className='mt-4 text-sm text-cream-light/70'>
              Quét mã QR để xem hồ sơ năng lực trên thiết bị di động
            </p>
          </div>
        </section>

        {/* Contact info */}
        <section className='bg-earth-dark py-12'>
          <div className='container text-center'>
            <h3 className='mb-4 font-serif text-xl font-bold text-cream-light'>Liên hệ</h3>
            <div className='flex flex-wrap justify-center gap-6 text-sm text-cream-light/70'>
              {config?.contact?.phone && <span>☎ {config.contact.phone}</span>}
              {config?.contact?.email && <span>✉ {config.contact.email}</span>}
              {config?.contact?.address && <span>📍 {config.contact.address}</span>}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
