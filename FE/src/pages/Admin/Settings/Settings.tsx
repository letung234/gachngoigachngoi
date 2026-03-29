import { useState, useRef, ChangeEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import adminApi from 'src/apis/admin.api'
import { SiteConfig } from 'src/types/config.type'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'

type TabId = 'general' | 'contact' | 'social' | 'seo' | 'homepage' | 'ecommerce' | 'theme' | 'maintenance'

interface Tab {
  id: TabId
  name: string
  icon: string
}

const tabs: Tab[] = [
  { id: 'general', name: 'Thông tin chung', icon: '🏪' },
  { id: 'contact', name: 'Liên hệ', icon: '📞' },
  { id: 'social', name: 'Mạng xã hội', icon: '🌐' },
  { id: 'seo', name: 'SEO', icon: '🔍' },
  { id: 'homepage', name: 'Trang chủ', icon: '🏠' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'theme', name: 'Giao diện', icon: '🎨' },
  { id: 'maintenance', name: 'Bảo trì', icon: '🔧' }
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>('general')
  const [formData, setFormData] = useState<Partial<SiteConfig>>({})
  const [isDirty, setIsDirty] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { can } = usePermission()
  const canUpdate = can(Permission.CONFIG_UPDATE)

  // Fetch config
  const { data: configData, isLoading: isPending } = useQuery({
    queryKey: ['admin-config'],
    queryFn: () => adminApi.getConfig(),
    staleTime: 5 * 60 * 1000
  })

  const config = configData?.data.data

  // Update config mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<SiteConfig>) => adminApi.updateConfig(data),
    onSuccess: () => {
      toast.success('Cập nhật cấu hình thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-config'] })
      setIsDirty(false)
    },
    onError: () => {
      toast.error('Cập nhật cấu hình thất bại')
    }
  })

  // Upload image mutation
  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => adminApi.uploadConfigImage(formData),
    onSuccess: (data, _variables) => {
      const imageUrl = data.data.data
      if (uploadingField) {
        handleNestedChange(uploadingField, imageUrl)
        setUploadingField(null)
      }
      toast.success('Upload ảnh thành công')
    },
    onError: () => {
      toast.error('Upload ảnh thất bại')
      setUploadingField(null)
    }
  })

  const handleChange = (field: keyof SiteConfig, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleNestedChange = (path: string, value: string | number | boolean | string[]) => {
    const keys = path.split('.')
    setFormData((prev) => {
      const newData = { ...prev }
      let current: Record<string, unknown> = newData as Record<string, unknown>

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {}
        }
        current = current[key] as Record<string, unknown>
      }

      current[keys[keys.length - 1]] = value
      return newData
    })
    setIsDirty(true)
  }

  const getValue = (path: string): string | number | boolean => {
    const keys = path.split('.')
    let current: unknown = formData

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key]
      } else {
        // Fall back to config data
        current = config
        for (const k of keys) {
          if (current && typeof current === 'object' && k in current) {
            current = (current as Record<string, unknown>)[k]
          } else {
            return ''
          }
        }
        break
      }
    }

    return current as string | number | boolean
  }

  const handleImageUpload = (field: string) => {
    setUploadingField(field)
    fileInputRef.current?.click()
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('image', file)
      uploadMutation.mutate(formData)
    }
    e.target.value = ''
  }

  const handleSave = () => {
    const dataToSave = { ...formData }
    updateMutation.mutate(dataToSave)
  }

  if (isPending) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-brick border-t-transparent' />
      </div>
    )
  }

  const renderInput = (
    label: string,
    path: string,
    type: 'text' | 'email' | 'number' | 'textarea' | 'color' = 'text',
    placeholder = ''
  ) => {
    const value = getValue(path)
    const commonClasses =
      'w-full rounded-lg border border-cement-light px-4 py-2 text-earth focus:border-brick focus:outline-none disabled:bg-cement-light disabled:cursor-not-allowed'

    return (
      <div>
        <label className='mb-2 block text-sm font-medium text-earth'>{label}</label>
        {type === 'textarea' ? (
          <textarea
            className={`${commonClasses} min-h-[100px]`}
            value={String(value || '')}
            placeholder={placeholder}
            onChange={(e) => handleNestedChange(path, e.target.value)}
            disabled={!canUpdate}
          />
        ) : type === 'color' ? (
          <div className='flex items-center gap-3'>
            <input
              type='color'
              className='h-10 w-20 cursor-pointer rounded border border-cement-light'
              value={String(value || '#000000')}
              onChange={(e) => handleNestedChange(path, e.target.value)}
              disabled={!canUpdate}
            />
            <input
              type='text'
              className={commonClasses}
              value={String(value || '')}
              placeholder='#000000'
              onChange={(e) => handleNestedChange(path, e.target.value)}
              disabled={!canUpdate}
            />
          </div>
        ) : (
          <input
            type={type}
            className={commonClasses}
            value={type === 'number' ? (value as number) : String(value || '')}
            placeholder={placeholder}
            onChange={(e) =>
              handleNestedChange(path, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)
            }
            disabled={!canUpdate}
          />
        )}
      </div>
    )
  }

  const renderImageUpload = (label: string, path: string, description = '') => {
    const value = getValue(path)
    const isUploading = uploadingField === path && uploadMutation.isPending

    return (
      <div>
        <label className='mb-2 block text-sm font-medium text-earth'>{label}</label>
        {description && <p className='mb-2 text-xs text-cement-dark'>{description}</p>}
        <div className='flex items-center gap-4'>
          {value && (
            <img
              src={String(value)}
              alt={label}
              className='h-16 w-16 rounded-lg border border-cement-light object-cover'
            />
          )}
          <button
            type='button'
            onClick={() => handleImageUpload(path)}
            disabled={!canUpdate || isUploading}
            className='rounded-lg border border-cement-light bg-white px-4 py-2 text-sm text-earth transition-colors hover:bg-cream-light disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isUploading ? 'Đang tải...' : value ? 'Thay đổi' : 'Tải lên'}
          </button>
        </div>
      </div>
    )
  }

  const renderToggle = (label: string, path: string, description = '') => {
    const value = getValue(path)

    return (
      <div className='flex items-center justify-between'>
        <div>
          <label className='block text-sm font-medium text-earth'>{label}</label>
          {description && <p className='text-xs text-cement-dark'>{description}</p>}
        </div>
        <button
          type='button'
          onClick={() => handleNestedChange(path, !value)}
          disabled={!canUpdate}
          className={`relative h-6 w-11 rounded-full transition-colors disabled:cursor-not-allowed ${
            value ? 'bg-brick' : 'bg-cement-light'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              value ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Thông tin cơ bản</h3>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Tên website', 'siteName', 'text', 'Gạch Ngói Store')}
              {renderInput('Slogan', 'siteSlogan', 'text', 'Chất lượng tạo nên khác biệt')}
            </div>
            <div className='grid gap-6 md:grid-cols-3'>
              {renderImageUpload('Logo', 'logo', 'Logo hiển thị trên header')}
              {renderImageUpload('Logo tối', 'logoDark', 'Logo cho dark mode')}
              {renderImageUpload('Favicon', 'favicon', 'Icon hiển thị trên tab trình duyệt')}
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Thông tin liên hệ</h3>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Email', 'contact.email', 'email', 'contact@example.com')}
              {renderInput('Số điện thoại', 'contact.phone', 'text', '0123 456 789')}
              {renderInput('Hotline', 'contact.hotline', 'text', '1800 xxxx')}
              {renderInput('Giờ làm việc', 'contact.workingHours', 'text', '8:00 - 17:00, Thứ 2 - Thứ 7')}
            </div>
            {renderInput('Địa chỉ', 'contact.address', 'text', '123 Đường ABC, Quận XYZ, TP.HCM')}
            {renderInput('Nhúng Google Maps', 'contact.mapEmbed', 'textarea', '<iframe src="..."></iframe>')}
          </div>
        )

      case 'social':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Liên kết mạng xã hội</h3>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Facebook', 'social.facebook', 'text', 'https://facebook.com/...')}
              {renderInput('Zalo', 'social.zalo', 'text', 'https://zalo.me/...')}
              {renderInput('YouTube', 'social.youtube', 'text', 'https://youtube.com/...')}
              {renderInput('Instagram', 'social.instagram', 'text', 'https://instagram.com/...')}
              {renderInput('TikTok', 'social.tiktok', 'text', 'https://tiktok.com/@...')}
              {renderInput('Twitter/X', 'social.twitter', 'text', 'https://x.com/...')}
            </div>
          </div>
        )

      case 'seo':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Cài đặt SEO</h3>
            {renderInput('Meta Title', 'seo.metaTitle', 'text', 'Gạch Ngói - Vật liệu xây dựng chất lượng')}
            {renderInput('Meta Description', 'seo.metaDescription', 'textarea', 'Mô tả ngắn về website...')}
            {renderInput('Meta Keywords', 'seo.metaKeywords', 'text', 'gạch, ngói, vật liệu xây dựng')}
            {renderImageUpload('OG Image', 'seo.ogImage', 'Ảnh hiển thị khi chia sẻ trên mạng xã hội')}
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Google Analytics ID', 'seo.googleAnalyticsId', 'text', 'UA-XXXXXXXXX-X')}
              {renderInput('Facebook Pixel ID', 'seo.facebookPixelId', 'text', 'XXXXXXXXXXXXXXXX')}
            </div>
          </div>
        )

      case 'homepage':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Cài đặt trang chủ</h3>
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Hero Section</h4>
              <div className='grid gap-4 md:grid-cols-2'>
                {renderInput('Tiêu đề Hero', 'homepage.heroTitle', 'text', 'Chào mừng đến với...')}
                {renderInput('Phụ đề Hero', 'homepage.heroSubtitle', 'text', 'Dòng chữ phụ...')}
              </div>
              {renderImageUpload('Ảnh Hero', 'homepage.heroImage', 'Ảnh nền cho hero section')}
              <div className='grid gap-4 md:grid-cols-2'>
                {renderInput('Text nút CTA', 'homepage.heroButtonText', 'text', 'Khám phá ngay')}
                {renderInput('Link nút CTA', 'homepage.heroButtonLink', 'text', '/san-pham')}
              </div>
            </div>
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Banner</h4>
              {renderToggle('Hiển thị banner', 'homepage.showBanner', 'Bật/tắt hiển thị banner trên trang chủ')}
            </div>
          </div>
        )

      case 'ecommerce':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Cài đặt E-commerce</h3>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Tiền tệ', 'ecommerce.currency', 'text', 'VND')}
              {renderInput('Ký hiệu tiền tệ', 'ecommerce.currencySymbol', 'text', '₫')}
              {renderInput('Thuế (%)', 'ecommerce.taxRate', 'number')}
              {renderInput('Miễn phí ship từ', 'ecommerce.freeShippingThreshold', 'number')}
              {renderInput('Đơn hàng tối thiểu', 'ecommerce.minOrderAmount', 'number')}
            </div>
            <div className='space-y-4'>
              {renderToggle('Hiển thị sản phẩm hết hàng', 'ecommerce.showOutOfStock')}
              {renderToggle('Cho phép đánh giá sản phẩm', 'ecommerce.enableReviews')}
            </div>
          </div>
        )

      case 'theme':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Cài đặt giao diện</h3>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Màu chính', 'theme.primaryColor', 'color')}
              {renderInput('Màu phụ', 'theme.secondaryColor', 'color')}
              {renderInput('Màu nhấn', 'theme.accentColor', 'color')}
              {renderInput('Font chữ', 'theme.fontFamily', 'text', 'Be Vietnam Pro, sans-serif')}
            </div>
            <div className='rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <p className='text-sm text-cement-dark'>
                <span className='font-medium'>Ghi chú:</span> Thay đổi màu sắc sẽ áp dụng cho toàn bộ website. Vui lòng
                kiểm tra kỹ trước khi lưu.
              </p>
            </div>
          </div>
        )

      case 'maintenance':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Chế độ bảo trì</h3>
            <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
              <p className='text-sm text-yellow-800'>
                <span className='font-medium'>Cảnh báo:</span> Khi bật chế độ bảo trì, website sẽ không thể truy cập
                được cho khách hàng.
              </p>
            </div>
            {renderToggle('Bật chế độ bảo trì', 'maintenance.enabled', 'Website sẽ tạm ngừng hoạt động')}
            {renderInput(
              'Thông báo bảo trì',
              'maintenance.message',
              'textarea',
              'Website đang được bảo trì, vui lòng quay lại sau...'
            )}
            {renderInput(
              'IP được phép truy cập',
              'maintenance.allowedIPs',
              'text',
              'Nhập các IP cách nhau bằng dấu phẩy'
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className='space-y-6'>
      {/* Hidden file input */}
      <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={onFileChange} />

      {/* Page header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-earth'>Cài đặt</h1>
          <p className='mt-2 text-cement-dark'>Quản lý cấu hình website</p>
        </div>
        {canUpdate && (
          <button
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
            className='rounded-lg bg-brick px-6 py-2 font-medium text-white transition-colors hover:bg-brick/90 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        )}
      </div>

      {/* Tabs and content */}
      <div className='grid gap-6 lg:grid-cols-[240px_1fr]'>
        {/* Tab navigation */}
        <div className='rounded-lg bg-white p-2 shadow-sm'>
          <nav className='space-y-1'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brick font-medium text-white'
                    : 'text-earth hover:bg-cream-light'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className='rounded-lg bg-white p-6 shadow-sm'>{renderTabContent()}</div>
      </div>
    </div>
  )
}
