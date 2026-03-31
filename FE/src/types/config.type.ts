export type NavLinkConfig = {
  name: string
  path: string
  isEnabled: boolean
}

export type FooterLinkConfig = {
  name: string
  path: string
}

export type BannerImageConfig = {
  image: string
  link: string
  title: string
}

export type TeamMemberConfig = {
  name: string
  role: string
  avatar: string
}

export type TestimonialConfig = {
  name: string
  role: string
  content: string
  avatar: string
  rating: number
}

export type AchievementConfig = {
  title: string
  description: string
  icon: string
}

export type ClientConfig = {
  name: string
  logo: string
}

export type CertificationConfig = {
  name: string
  image: string
  year: string
}

export type CompanyStatConfig = {
  label: string
  value: string
  suffix: string
}

export type CompanyProfileConfig = {
  companyName: string
  foundedYear: string
  description: string
  coreValues: string[]
  achievements: AchievementConfig[]
  clients: ClientConfig[]
  certifications: CertificationConfig[]
  stats: CompanyStatConfig[]
}

export type SiteConfig = {
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

  // Header Settings
  header: {
    navLinks: NavLinkConfig[]
    ctaText: string
    ctaLink: string
    showAdminLink: boolean
  }

  // Footer Settings
  footer: {
    about: string
    copyright: string
    showSocialIcons: boolean
    showNewsletter: boolean
    brandName: string
    brandSlogan: string
    productLinks: FooterLinkConfig[]
    companyLinks: FooterLinkConfig[]
  }

  // About Page Settings
  aboutPage: {
    title: string
    subtitle: string
    content: string
    missionTitle: string
    missionContent: string
    visionTitle: string
    visionContent: string
    heroImage: string
    teamMembers: TeamMemberConfig[]
  }

  // Notification/Announcement Banner
  notification: {
    enabled: boolean
    message: string
    type: 'info' | 'warning' | 'success' | 'promotion'
    link: string
    linkText: string
    isDismissible: boolean
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
    bannerImages: BannerImageConfig[]
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

  // Testimonials
  testimonials: TestimonialConfig[]

  // Company Profile
  companyProfile: CompanyProfileConfig

  createdAt: string
  updatedAt: string
}
