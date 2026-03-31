import mongoose, { Schema } from 'mongoose'

const SiteConfigSchema = new Schema(
  {
    // Basic Info
    siteName: { type: String, default: 'Gạch Ngói Shop' },
    siteSlogan: { type: String, default: 'Chất lượng tạo nên thương hiệu' },
    logo: { type: String, default: '' },
    logoDark: { type: String, default: '' },
    favicon: { type: String, default: '' },

    // Contact Info
    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      hotline: { type: String, default: '' },
      address: { type: String, default: '' },
      workingHours: { type: String, default: 'T2 - T7: 8:00 - 17:30' },
      mapEmbed: { type: String, default: '' }
    },

    // Social Media
    social: {
      facebook: { type: String, default: '' },
      zalo: { type: String, default: '' },
      youtube: { type: String, default: '' },
      instagram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      twitter: { type: String, default: '' }
    },

    // SEO Settings
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      metaKeywords: { type: String, default: '' },
      ogImage: { type: String, default: '' },
      googleAnalyticsId: { type: String, default: '' },
      facebookPixelId: { type: String, default: '' }
    },

    // Header Settings
    header: {
      navLinks: [{
        name: { type: String },
        path: { type: String },
        isEnabled: { type: Boolean, default: true },
      }],
      ctaText: { type: String, default: 'Liên hệ tư vấn' },
      ctaLink: { type: String, default: '/lien-he' },
      showAdminLink: { type: Boolean, default: true },
    },

    // Footer Settings
    footer: {
      about: { type: String, default: '' },
      copyright: { type: String, default: '\u00A9 2024 Gạch Ngói Shop. All rights reserved.' },
      showSocialIcons: { type: Boolean, default: true },
      showNewsletter: { type: Boolean, default: true },
      brandName: { type: String, default: 'Gạch Ngói Việt' },
      brandSlogan: { type: String, default: 'Tinh hoa làng nghề' },
      productLinks: [{
        name: { type: String },
        path: { type: String },
      }],
      companyLinks: [{
        name: { type: String },
        path: { type: String },
      }],
    },

    // About Page Settings
    aboutPage: {
      title: { type: String, default: 'Về chúng tôi' },
      subtitle: { type: String, default: '' },
      content: { type: String, default: '' },
      missionTitle: { type: String, default: 'Sứ mệnh' },
      missionContent: { type: String, default: '' },
      visionTitle: { type: String, default: 'Tầm nhìn' },
      visionContent: { type: String, default: '' },
      heroImage: { type: String, default: '' },
      teamMembers: [{
        name: { type: String },
        role: { type: String },
        avatar: { type: String },
      }],
    },

    // Notification/Announcement Banner
    notification: {
      enabled: { type: Boolean, default: false },
      message: { type: String, default: '' },
      type: { type: String, enum: ['info', 'warning', 'success', 'promotion'], default: 'info' },
      link: { type: String, default: '' },
      linkText: { type: String, default: '' },
      isDismissible: { type: Boolean, default: true },
    },

    // Homepage Settings
    homepage: {
      heroTitle: { type: String, default: '' },
      heroSubtitle: { type: String, default: '' },
      heroImage: { type: String, default: '' },
      heroButtonText: { type: String, default: 'Xem sản phẩm' },
      heroButtonLink: { type: String, default: '/san-pham' },
      featuredCategoryIds: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
      showBanner: { type: Boolean, default: true },
      bannerImages: [{
        image: { type: String },
        link: { type: String },
        title: { type: String }
      }],
    },

    // Testimonials
    testimonials: [{
      name: { type: String },
      role: { type: String },
      content: { type: String },
      avatar: { type: String },
      rating: { type: Number, default: 5 },
    }],

    // Company Profile
    companyProfile: {
      companyName: { type: String, default: '' },
      foundedYear: { type: String, default: '' },
      description: { type: String, default: '' },
      coreValues: [{ type: String }],
      achievements: [{
        title: { type: String },
        description: { type: String },
        icon: { type: String },
      }],
      clients: [{
        name: { type: String },
        logo: { type: String },
      }],
      certifications: [{
        name: { type: String },
        image: { type: String },
        year: { type: String },
      }],
      stats: [{
        label: { type: String },
        value: { type: String },
        suffix: { type: String },
      }],
    },

    // Theme Settings
    theme: {
      primaryColor: { type: String, default: '#8B4513' },
      secondaryColor: { type: String, default: '#D4A574' },
      accentColor: { type: String, default: '#FFD700' },
      fontFamily: { type: String, default: 'Inter' }
    },

    // E-commerce Settings
    ecommerce: {
      currency: { type: String, default: 'VND' },
      currencySymbol: { type: String, default: '₫' },
      taxRate: { type: Number, default: 0 },
      freeShippingThreshold: { type: Number, default: 500000 },
      minOrderAmount: { type: Number, default: 0 },
      showOutOfStock: { type: Boolean, default: true },
      enableReviews: { type: Boolean, default: true }
    },

    // Maintenance Mode
    maintenance: {
      enabled: { type: Boolean, default: false },
      message: { type: String, default: 'Website đang bảo trì, vui lòng quay lại sau.' },
      allowedIPs: [{ type: String }]
    }
  },
  {
    timestamps: true
  }
)

export const SiteConfigModel = mongoose.model('site_configs', SiteConfigSchema)
