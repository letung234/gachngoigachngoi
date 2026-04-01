import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import configApi from 'src/apis/config.api'
import { SiteConfig } from 'src/types/config.type'

type SiteConfigContextType = {
  config: SiteConfig | null
  isLoading: boolean
  error: string | null
  refreshConfig: () => Promise<void>
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: null,
  isLoading: true,
  error: null,
  refreshConfig: async () => {}
})

type SiteConfigProviderProps = {
  children: ReactNode
}

const DEFAULT_CONFIG: SiteConfig = {
  _id: 'default',
  siteName: 'Gạch Ngói Store',
  siteSlogan: 'Chất lượng tạo nên khác biệt',
  logo: '',
  logoDark: '',
  favicon: '',
  contact: {
    email: '',
    phone: '',
    hotline: '',
    address: '',
    workingHours: '',
    mapEmbed: '',
  },
  social: {
    facebook: '',
    zalo: '',
    youtube: '',
    instagram: '',
    tiktok: '',
    twitter: '',
  },
  seo: {
    metaTitle: 'Gạch Ngói Store',
    metaDescription: 'Cửa hàng cung cấp gạch ngói chất lượng cao',
    metaKeywords: 'gạch, ngói, vật liệu xây dựng',
    ogImage: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
  },
  header: {
    navLinks: [
      { name: 'Trang chủ', path: '/', isEnabled: true },
      { name: 'Sản phẩm', path: '/san-pham', isEnabled: true },
      { name: 'Dự án', path: '/du-an', isEnabled: true },
      { name: 'Blog', path: '/blog', isEnabled: true },
      { name: 'Giới thiệu', path: '/gioi-thieu', isEnabled: true },
      { name: 'Liên hệ', path: '/lien-he', isEnabled: true },
    ],
    ctaText: 'Liên hệ tư vấn',
    ctaLink: '/lien-he',
    showAdminLink: true,
  },
  footer: {
    about: 'Cửa hàng cung cấp gạch ngói và vật liệu xây dựng chất lượng cao với giá cả hợp lý.',
    copyright: '\u00A9 2024 Gạch Ngói Store. Tất cả quyền được bảo lưu.',
    showSocialIcons: true,
    showNewsletter: false,
    brandName: 'Gạch Ngói Việt',
    brandSlogan: 'Tinh hoa làng nghề',
    productLinks: [],
    companyLinks: [],
  },
  aboutPage: {
    title: 'Về chúng tôi',
    subtitle: '',
    content: '',
    missionTitle: 'Sứ mệnh',
    missionContent: '',
    visionTitle: 'Tầm nhìn',
    visionContent: '',
    heroImage: '',
    teamMembers: [],
  },
  notification: {
    enabled: false,
    message: '',
    type: 'info',
    link: '',
    linkText: '',
    isDismissible: true,
  },
  homepage: {
    heroTitle: 'Chào mừng đến với Gạch Ngói Store',
    heroSubtitle: 'Cung cấp vật liệu xây dựng chất lượng cao',
    heroImage: '',
    heroButtonText: 'Khám phá ngay',
    heroButtonLink: '/san-pham',
    featuredCategoryIds: [],
    showBanner: true,
    bannerImages: [],
  },
  ecommerce: {
    currency: 'VND',
    currencySymbol: '\u20AB',
    taxRate: 10,
    freeShippingThreshold: 5000000,
    minOrderAmount: 0,
    showOutOfStock: true,
    enableReviews: true,
  },
  theme: {
    primaryColor: '#8B4513',
    secondaryColor: '#D2B48C',
    accentColor: '#DAA520',
    fontFamily: 'Be Vietnam Pro, sans-serif',
  },
  maintenance: {
    enabled: false,
    message: 'Website đang được bảo trì, vui lòng quay lại sau.',
    allowedIPs: [],
  },
  testimonials: [],
  companyProfile: {
    companyName: '',
    foundedYear: '',
    description: '',
    coreValues: [],
    achievements: [],
    clients: [],
    certifications: [],
    stats: [],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const SiteConfigProvider = ({ children }: SiteConfigProviderProps) => {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadConfig = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await configApi.getPublicConfig()
      setConfig(response.data.data)
    } catch (err) {
      console.error('Failed to load site config:', err)
      setError('Không thể tải cấu hình website')
      setConfig(DEFAULT_CONFIG)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshConfig = async () => {
    await loadConfig()
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const value: SiteConfigContextType = {
    config,
    isLoading,
    error,
    refreshConfig,
  }

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
}

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext)

  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider')
  }

  return context
}

export { SiteConfigContext }
