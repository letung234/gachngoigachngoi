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
  siteName: 'G蘯｡ch Ngﾃｳi Store',
  siteSlogan: 'Ch蘯･t lﾆｰ盻｣ng t蘯｡o nﾃｪn khﾃ｡c bi盻㏄',
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
    metaTitle: 'G蘯｡ch Ngﾃｳi Store',
    metaDescription: 'C盻ｭa hﾃ�ng cung c蘯･p g蘯｡ch ngﾃｳi ch蘯･t lﾆｰ盻｣ng cao',
    metaKeywords: 'g蘯｡ch, ngﾃｳi, v蘯ｭt li盻㎡ xﾃ｢y d盻ｱng',
    ogImage: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
  },
  header: {
    navLinks: [
      { name: 'Trang ch盻ｧ', path: '/', isEnabled: true },
      { name: 'S蘯｣n ph蘯ｩm', path: '/san-pham', isEnabled: true },
      { name: 'D盻ｱ ﾃ｡n', path: '/du-an', isEnabled: true },
      { name: 'Blog', path: '/blog', isEnabled: true },
      { name: 'Gi盻嬖 thi盻㎡', path: '/gioi-thieu', isEnabled: true },
      { name: 'Liﾃｪn h盻�', path: '/lien-he', isEnabled: true },
    ],
    ctaText: 'Liﾃｪn h盻� tﾆｰ v蘯･n',
    ctaLink: '/lien-he',
    showAdminLink: true,
  },
  footer: {
    about: 'C盻ｭa hﾃ�ng cung c蘯･p g蘯｡ch ngﾃｳi vﾃ� v蘯ｭt li盻㎡ xﾃ｢y d盻ｱng ch蘯･t lﾆｰ盻｣ng cao v盻嬖 giﾃ｡ c蘯｣ h盻｣p lﾃｽ.',
    copyright: '\u00A9 2024 G蘯｡ch Ngﾃｳi Store. T蘯･t c蘯｣ quy盻］ ﾄ柁ｰ盻｣c b蘯｣o lﾆｰu.',
    showSocialIcons: true,
    showNewsletter: false,
    brandName: 'G蘯｡ch Ngﾃｳi Vi盻㏄',
    brandSlogan: 'Tinh hoa lﾃ�ng ngh盻�',
    productLinks: [],
    companyLinks: [],
  },
  aboutPage: {
    title: 'V盻� chﾃｺng tﾃｴi',
    subtitle: '',
    content: '',
    missionTitle: 'S盻ｩ m盻㌻h',
    missionContent: '',
    visionTitle: 'T蘯ｧm nhﾃｬn',
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
    heroTitle: 'Chﾃ�o m盻ｫng ﾄ黛ｺｿn v盻嬖 G蘯｡ch Ngﾃｳi Store',
    heroSubtitle: 'Cung c蘯･p v蘯ｭt li盻㎡ xﾃ｢y d盻ｱng ch蘯･t lﾆｰ盻｣ng cao',
    heroImage: '',
    heroButtonText: 'Khﾃ｡m phﾃ｡ ngay',
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
    message: 'Website ﾄ疎ng ﾄ柁ｰ盻｣c b蘯｣o trﾃｬ, vui lﾃｲng quay l蘯｡i sau.',
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
      setError('Khﾃｴng th盻� t蘯｣i c蘯･u hﾃｬnh website')
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
