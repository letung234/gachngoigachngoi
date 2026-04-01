import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  avatar?: string
  rating?: number
}

export const generateTestimonialsPDF = (testimonials: Testimonial[], companyInfo?: any) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20

  // Header
  doc.setFontSize(22)
  doc.setTextColor(139, 69, 19) // Brick color
  doc.text('KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI', pageWidth / 2, 20, { align: 'center' })

  // Company name if available
  if (companyInfo?.siteName) {
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(companyInfo.siteName, pageWidth / 2, 30, { align: 'center' })
  }

  // Add date
  doc.setFontSize(10)
  doc.setTextColor(150, 150, 150)
  const date = new Date().toLocaleDateString('vi-VN')
  doc.text(`Ngày xuất: ${date}`, pageWidth / 2, 38, { align: 'center' })

  let yPosition = 50

  // Testimonials
  testimonials.forEach((testimonial) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    // Box for each testimonial
    doc.setDrawColor(210, 180, 140)
    doc.setLineWidth(0.5)
    doc.roundedRect(margin, yPosition - 5, pageWidth - 2 * margin, 60, 3, 3)

    // Star rating
    if (testimonial.rating) {
      doc.setFontSize(10)
      doc.setTextColor(218, 165, 32) // Gold color
      const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating)
      doc.text(stars, margin + 5, yPosition + 2)
    }

    // Name
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(62, 39, 35) // Earth-dark color
    doc.text(testimonial.name, margin + 5, yPosition + 10)

    // Role
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(testimonial.role, margin + 5, yPosition + 16)

    // Content - wrap text
    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)
    const contentLines = doc.splitTextToSize(testimonial.content, pageWidth - 2 * margin - 10)
    doc.text(contentLines, margin + 5, yPosition + 25)

    yPosition += 70
  })

  // Footer
  const totalPages = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Trang ${i} / ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  // Save PDF
  const fileName = `danh-gia-khach-hang-${new Date().getTime()}.pdf`
  doc.save(fileName)
}

export const printTestimonials = () => {
  window.print()
}
