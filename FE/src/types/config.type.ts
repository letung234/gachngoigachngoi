export interface SiteConfig {
  _id: string

  // Basic Info
  siteName: string
  siteSlogan: string
  logo: string
  logoDark: string
  favicon: string

  // Contact Info
  contact: {
    email: string
    phone: string
    hotline: string
    address: string
    workingHours: string
    mapEmbed: string
  }

  // Social Media
  social: {
    facebook: string
    zalo: string
    youtube: string
    instagram: string
    tiktok: string
    twitter: string
  }

  // SEO Settings
  seo: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    ogImage: string
    googleAnalyticsId: string
    facebookPixelId: string
  }

  // Footer Settings
  footer: {
    about: string
    copyright: string
    showSocialIcons: boolean
    showNewsletter: boolean
  }

  // Homepage Settings
  homepage: {
    heroTitle: string
    heroSubtitle: string
    heroImage: string
    heroButtonText: string
    heroButtonLink: string
    featuredCategoryIds: string[]
    showBanner: boolean
    bannerImages: {
      image: string
      link: string
      title: string
    }[]
  }

  // Theme Settings
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
  }

  // E-commerce Settings
  ecommerce: {
    currency: string
    currencySymbol: string
    taxRate: number
    freeShippingThreshold: number
    minOrderAmount: number
    showOutOfStock: boolean
    enableReviews: boolean
  }

  // Maintenance Mode
  maintenance: {
    enabled: boolean
    message: string
    allowedIPs: string[]
  }

  createdAt: string
  updatedAt: string
}
