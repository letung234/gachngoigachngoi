import { useState, useRef, ChangeEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import adminApi from 'src/apis/admin.api'
import { SiteConfig, NavLinkConfig, FooterLinkConfig, TeamMemberConfig, TestimonialConfig, CompanyStatConfig, AchievementConfig } from 'src/types/config.type'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'

type TabId =
  | 'general'
  | 'header'
  | 'contact'
  | 'social'
  | 'seo'
  | 'homepage'
  | 'footer'
  | 'about'
  | 'notification'
  | 'ecommerce'
  | 'theme'
  | 'testimonials'
  | 'company'
  | 'maintenance'

type Tab = {
  id: TabId
  name: string
  icon: string
}

const TABS: Tab[] = [
  { id: 'general', name: 'Thông tin chung', icon: '⚙️' },
  { id: 'header', name: 'Header', icon: '📋' },
  { id: 'footer', name: 'Footer', icon: '📄' },
  { id: 'contact', name: 'Liên hệ', icon: '📞' },
  { id: 'social', name: 'Mạng xã hội', icon: '🌐' },
  { id: 'seo', name: 'SEO', icon: '🔍' },
  { id: 'homepage', name: 'Trang chủ', icon: '🏠' },
  { id: 'about', name: 'Giới thiệu', icon: 'ℹ️' },
  { id: 'notification', name: 'Thông báo', icon: '🔔' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'theme', name: 'Giao diện', icon: '🎨' },
  { id: 'testimonials', name: 'Testimonials', icon: '💬' },
  { id: 'company', name: 'Hồ sơ công ty', icon: '🏢' },
  { id: 'maintenance', name: 'Bảo trì', icon: '🔧' },
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

  const { data: configData, isLoading: isPending } = useQuery({
    queryKey: ['admin-config'],
    queryFn: () => adminApi.getConfig(),
    staleTime: 5 * 60 * 1000,
  })

  const config = configData?.data.data

  const updateMutation = useMutation({
    mutationFn: (data: Partial<SiteConfig>) => adminApi.updateConfig(data),
    onSuccess: () => {
      toast.success('Cập nhật cấu hình thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-config'] })
      setIsDirty(false)
    },
    onError: () => {
      toast.error('Cập nhật cấu hình thất bại')
    },
  })

  const uploadMutation = useMutation({
    mutationFn: (data: FormData) => adminApi.uploadConfigImage(data),
    onSuccess: (data) => {
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
    },
  })

  const handleNestedChange = (path: string, value: unknown) => {
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

  const getValue = (path: string): unknown => {
    const keys = path.split('.')
    let current: unknown = formData

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key]
      } else {
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

    return current
  }

  const getStringValue = (path: string): string => String(getValue(path) || '')
  const getBoolValue = (path: string): boolean => Boolean(getValue(path))

  const getNestedArray = (path: string): unknown[] => {
    const keys = path.split('.')
    let current: unknown = formData

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key]
      } else {
        current = config

        for (const k of keys) {
          if (current && typeof current === 'object' && k in current) {
            current = (current as Record<string, unknown>)[k]
          } else {
            return []
          }
        }

        break
      }
    }

    return Array.isArray(current) ? current : []
  }

  const handleImageUpload = (field: string) => {
    setUploadingField(field)
    fileInputRef.current?.click()
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const data = new FormData()
      data.append('image', file)
      uploadMutation.mutate(data)
    }

    e.target.value = ''
  }

  const handleSave = () => {
    updateMutation.mutate({ ...formData })
  }

  if (isPending) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-brick border-t-transparent' />
      </div>
    )
  }

  const inputClasses =
    'w-full rounded-lg border border-cement-light px-4 py-2 text-earth focus:border-brick focus:outline-none disabled:bg-cement-light disabled:cursor-not-allowed'

  const renderInput = (
    label: string,
    path: string,
    type: 'text' | 'email' | 'number' | 'textarea' | 'color' = 'text',
    placeholder = ''
  ) => {
    const value = getValue(path)

    return (
      <div>
        <label className='mb-2 block text-sm font-medium text-earth'>{label}</label>
        {type === 'textarea' ? (
          <textarea
            className={`${inputClasses} min-h-[100px]`}
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
              className={inputClasses}
              value={String(value || '')}
              placeholder='#000000'
              onChange={(e) => handleNestedChange(path, e.target.value)}
              disabled={!canUpdate}
            />
          </div>
        ) : (
          <input
            type={type}
            className={inputClasses}
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
    const value = getBoolValue(path)

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

  const renderSelect = (label: string, path: string, options: { value: string; label: string }[]) => {
    const value = getStringValue(path)

    return (
      <div>
        <label className='mb-2 block text-sm font-medium text-earth'>{label}</label>
        <select
          className={inputClasses}
          value={value}
          onChange={(e) => handleNestedChange(path, e.target.value)}
          disabled={!canUpdate}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  // ---- Render nav links editor ----
  const renderNavLinksEditor = () => {
    const navLinks = (getNestedArray('header.navLinks') as NavLinkConfig[]) || []

    const handleUpdateNavLink = (index: number, field: keyof NavLinkConfig, value: string | boolean) => {
      const updatedList = navLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
      handleNestedChange('header.navLinks', updatedList)
    }

    const handleAddNavLink = () => {
      const updatedList = [...navLinks, { name: '', path: '/', isEnabled: true }]
      handleNestedChange('header.navLinks', updatedList)
    }

    const handleRemoveNavLink = (index: number) => {
      const updatedList = navLinks.filter((_, i) => i !== index)
      handleNestedChange('header.navLinks', updatedList)
    }

    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-earth'>Liên kết menu header</label>
          {canUpdate && (
            <button
              type='button'
              onClick={handleAddNavLink}
              className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'
            >+ Thêm</button>
          )}
        </div>
        {navLinks.map((link, index) => (
          <div key={index} className='flex items-center gap-3 rounded-lg border border-cement-light p-3'>
            <input
              type='text'
              className={`${inputClasses} flex-1`}
              placeholder='Tên hiển thị'
              value={link.name || ''}
              onChange={(e) => handleUpdateNavLink(index, 'name', e.target.value)}
              disabled={!canUpdate}
            />
            <input
              type='text'
              className={`${inputClasses} flex-1`}
              placeholder='/duong-dan'
              value={link.path || ''}
              onChange={(e) => handleUpdateNavLink(index, 'path', e.target.value)}
              disabled={!canUpdate}
            />
            <button
              type='button'
              onClick={() => handleUpdateNavLink(index, 'isEnabled', !link.isEnabled)}
              disabled={!canUpdate}
              className={`rounded-lg px-3 py-2 text-xs font-medium ${
                link.isEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {link.isEnabled ? 'Bật' : 'Tắt'}
            </button>
            {canUpdate && (
              <button
                type='button'
                onClick={() => handleRemoveNavLink(index)}
                className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'
              >
                Xóa
              </button>
            )}
          </div>
        ))}
        {navLinks.length === 0 && (
          <p className='text-sm text-cement-dark'>Chưa có liên kết menu nào.</p>
        )}
      </div>
    )
  }

  // ---- Render footer links editor ----
  const renderFooterLinksEditor = (label: string, path: string) => {
    const links = (getNestedArray(path) as FooterLinkConfig[]) || []

    const handleUpdate = (index: number, field: keyof FooterLinkConfig, value: string) => {
      const updatedList = links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
      handleNestedChange(path, updatedList)
    }

    const handleAdd = () => {
      handleNestedChange(path, [...links, { name: '', path: '/' }])
    }

    const handleRemove = (index: number) => {
      handleNestedChange(path, links.filter((_, i) => i !== index))
    }

    return (
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-earth'>{label}</label>
          {canUpdate && (
            <button
              type='button'
              onClick={handleAdd}
              className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'
            >+ Thêm</button>
          )}
        </div>
        {links.map((link, index) => (
          <div key={index} className='flex items-center gap-3'>
            <input
              type='text'
              className={`${inputClasses} flex-1`}
              placeholder='Tên hiển thị cho liên kết'
              value={link.name || ''}
              onChange={(e) => handleUpdate(index, 'name', e.target.value)}
              disabled={!canUpdate}
            />
            <input
              type='text'
              className={`${inputClasses} flex-1`}
              placeholder='/duong-dan'
              value={link.path || ''}
              onChange={(e) => handleUpdate(index, 'path', e.target.value)}
              disabled={!canUpdate}
            />
            {canUpdate && (
              <button
                type='button'
                onClick={() => handleRemove(index)}
                className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'
              >
                Xóa
              </button>
            )}
          </div>
        ))}
        {links.length === 0 && (
          <p className='text-sm text-cement-dark'>Chưa có liên kết menu nào.</p>
        )}
      </div>
    )
  }

  // ---- Render team members editor ----
  const renderTeamMembersEditor = () => {
    const members = (getNestedArray('aboutPage.teamMembers') as TeamMemberConfig[]) || []

    const handleUpdate = (index: number, field: keyof TeamMemberConfig, value: string) => {
      const updatedList = members.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      )
      handleNestedChange('aboutPage.teamMembers', updatedList)
    }

    const handleAdd = () => {
      handleNestedChange('aboutPage.teamMembers', [...members, { name: '', role: '', avatar: '' }])
    }

    const handleRemove = (index: number) => {
      handleNestedChange('aboutPage.teamMembers', members.filter((_, i) => i !== index))
    }

    return (
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-earth'>Thành viên</label>
          {canUpdate && (
            <button
              type='button'
              onClick={handleAdd}
              className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'
            >+ Thêm</button>
          )}
        </div>
        {members.map((member, index) => (
          <div key={index} className='flex items-center gap-3 rounded-lg border border-cement-light p-3'>
            <input
              type='text'
              className={`${inputClasses} flex-1`}
              placeholder='Tên'
              value={member.name || ''}
              onChange={(e) => handleUpdate(index, 'name', e.target.value)}
              disabled={!canUpdate}
            />
            <input
              type='text'
              className={`${inputClasses} flex-1`}
              placeholder='Chức vụ'
              value={member.role || ''}
              onChange={(e) => handleUpdate(index, 'role', e.target.value)}
              disabled={!canUpdate}
            />
            <input
              type='text'
              className={`${inputClasses} flex-1`}
              placeholder='URL avatar'
              value={member.avatar || ''}
              onChange={(e) => handleUpdate(index, 'avatar', e.target.value)}
              disabled={!canUpdate}
            />
            {canUpdate && (
              <button
                type='button'
                onClick={() => handleRemove(index)}
                className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'
              >
                Xóa
              </button>
            )}
          </div>
        ))}
        {members.length === 0 && (
          <p className='text-sm text-cement-dark'>Chưa có thành viên nào.</p>
        )}
      </div>
    )
  }

  const renderTestimonialsEditor = () => {
    const testimonials = (getNestedArray('testimonials') as TestimonialConfig[]) || []

    const handleUpdate = (index: number, field: keyof TestimonialConfig, value: string | number) => {
      const updated = testimonials.map((t, i) => (i === index ? { ...t, [field]: value } : t))
      handleNestedChange('testimonials', updated)
    }

    const handleAdd = () => {
      handleNestedChange('testimonials', [...testimonials, { name: '', role: '', content: '', avatar: '', rating: 5 }])
    }

    const handleRemove = (index: number) => {
      handleNestedChange('testimonials', testimonials.filter((_, i) => i !== index))
    }

    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-earth'>Đánh giá</label>
          {canUpdate && (
            <button type='button' onClick={handleAdd} className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'>
              + Thêm
            </button>
          )}
        </div>
        {testimonials.map((t, i) => (
          <div key={i} className='space-y-3 rounded-lg border border-cement-light p-4'>
            <div className='grid gap-3 md:grid-cols-2'>
              <input type='text' className={inputClasses} placeholder='Tên khách hàng' value={t.name || ''} onChange={(e) => handleUpdate(i, 'name', e.target.value)} disabled={!canUpdate} />
              <input type='text' className={inputClasses} placeholder='Chức vụ / Công ty' value={t.role || ''} onChange={(e) => handleUpdate(i, 'role', e.target.value)} disabled={!canUpdate} />
            </div>
            <textarea className={inputClasses} placeholder='Nội dung đánh giá...' rows={2} value={t.content || ''} onChange={(e) => handleUpdate(i, 'content', e.target.value)} disabled={!canUpdate} />
            <div className='flex items-center gap-3'>
              <input type='text' className={`${inputClasses} flex-1`} placeholder='URL avatar' value={t.avatar || ''} onChange={(e) => handleUpdate(i, 'avatar', e.target.value)} disabled={!canUpdate} />
              <input type='number' className={`${inputClasses} w-20`} placeholder='Rating' min={1} max={5} value={t.rating || 5} onChange={(e) => handleUpdate(i, 'rating', Number(e.target.value))} disabled={!canUpdate} />
              {canUpdate && (
                <button type='button' onClick={() => handleRemove(i)} className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'>Xóa</button>
              )}
            </div>
          </div>
        ))}
        {testimonials.length === 0 && <p className='text-sm text-cement-dark'>Chưa có đánh giá nào.</p>}
      </div>
    )
  }

  const renderCompanyStatsEditor = () => {
    const stats = (getNestedArray('companyProfile.stats') as CompanyStatConfig[]) || []

    const handleUpdate = (index: number, field: keyof CompanyStatConfig, value: string) => {
      const updated = stats.map((s, i) => (i === index ? { ...s, [field]: value } : s))
      handleNestedChange('companyProfile.stats', updated)
    }

    const handleAdd = () => {
      handleNestedChange('companyProfile.stats', [...stats, { label: '', value: '', suffix: '' }])
    }

    const handleRemove = (index: number) => {
      handleNestedChange('companyProfile.stats', stats.filter((_, i) => i !== index))
    }

    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-earth'>Thống kê công ty</label>
          {canUpdate && (
            <button type='button' onClick={handleAdd} className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'>+ Thêm</button>
          )}
        </div>
        {stats.map((s, i) => (
          <div key={i} className='flex items-center gap-3'>
            <input type='text' className={`${inputClasses} flex-1`} placeholder='Nhãn (vd: Số lượng KN)' value={s.label || ''} onChange={(e) => handleUpdate(i, 'label', e.target.value)} disabled={!canUpdate} />
            <input type='text' className={`${inputClasses} w-24`} placeholder='Giá trị' value={s.value || ''} onChange={(e) => handleUpdate(i, 'value', e.target.value)} disabled={!canUpdate} />
            <input type='text' className={`${inputClasses} w-16`} placeholder='+' value={s.suffix || ''} onChange={(e) => handleUpdate(i, 'suffix', e.target.value)} disabled={!canUpdate} />
            {canUpdate && <button type='button' onClick={() => handleRemove(i)} className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'>Xóa</button>}
          </div>
        ))}
        {stats.length === 0 && <p className='text-sm text-cement-dark'>Chưa có thống kê nào.</p>}
      </div>
    )
  }

  const renderCompanyAchievementsEditor = () => {
    const achievements = (getNestedArray('companyProfile.achievements') as AchievementConfig[]) || []

    const handleUpdate = (index: number, field: keyof AchievementConfig, value: string) => {
      const updated = achievements.map((a, i) => (i === index ? { ...a, [field]: value } : a))
      handleNestedChange('companyProfile.achievements', updated)
    }

    const handleAdd = () => {
      handleNestedChange('companyProfile.achievements', [...achievements, { title: '', description: '', icon: '' }])
    }

    const handleRemove = (index: number) => {
      handleNestedChange('companyProfile.achievements', achievements.filter((_, i) => i !== index))
    }

    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-earth'>Thành tựu công ty</label>
          {canUpdate && (
            <button type='button' onClick={handleAdd} className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'>+ Thêm</button>
          )}
        </div>
        {achievements.map((a, i) => (
          <div key={i} className='flex items-start gap-3 rounded-lg border border-cement-light p-3'>
            <input type='text' className={`${inputClasses} w-16`} placeholder='Icon' value={a.icon || ''} onChange={(e) => handleUpdate(i, 'icon', e.target.value)} disabled={!canUpdate} />
            <div className='flex-1 space-y-2'>
              <input type='text' className={inputClasses} placeholder='Tiêu đề' value={a.title || ''} onChange={(e) => handleUpdate(i, 'title', e.target.value)} disabled={!canUpdate} />
              <input type='text' className={inputClasses} placeholder='Mô tả' value={a.description || ''} onChange={(e) => handleUpdate(i, 'description', e.target.value)} disabled={!canUpdate} />
            </div>
            {canUpdate && <button type='button' onClick={() => handleRemove(i)} className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'>Xóa</button>}
          </div>
        ))}
        {achievements.length === 0 && <p className='text-sm text-cement-dark'>Chưa có thành tựu nào.</p>}
      </div>
    )
  }

  const renderCoreValuesEditor = () => {
    const coreValues = (getNestedArray('companyProfile.coreValues') as string[]) || []

    const handleUpdate = (index: number, value: string) => {
      const updated = coreValues.map((v, i) => (i === index ? value : v))
      handleNestedChange('companyProfile.coreValues', updated)
    }

    const handleAdd = () => {
      handleNestedChange('companyProfile.coreValues', [...coreValues, ''])
    }

    const handleRemove = (index: number) => {
      handleNestedChange('companyProfile.coreValues', coreValues.filter((_, i) => i !== index))
    }

    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-earth'>Giá trị cốt lõi</label>
          {canUpdate && (
            <button type='button' onClick={handleAdd} className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'>+ Thêm</button>
          )}
        </div>
        {coreValues.map((v, i) => (
          <div key={i} className='flex items-center gap-3'>
            <input type='text' className={`${inputClasses} flex-1`} placeholder='Giá trị cốt lõi (vd: Chất lượng)' value={v || ''} onChange={(e) => handleUpdate(i, e.target.value)} disabled={!canUpdate} />
            {canUpdate && <button type='button' onClick={() => handleRemove(i)} className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'>Xóa</button>}
          </div>
        ))}
        {coreValues.length === 0 && <p className='text-sm text-cement-dark'>Chưa có giá trị cốt lõi nào.</p>}
      </div>
    )
  }

  const renderClientsEditor = () => {
    const clients = (getNestedArray('companyProfile.clients') as { name: string; logo: string }[]) || []

    const handleUpdate = (index: number, field: 'name' | 'logo', value: string) => {
      const updated = clients.map((c, i) => (i === index ? { ...c, [field]: value } : c))
      handleNestedChange('companyProfile.clients', updated)
    }

    const handleAdd = () => {
      handleNestedChange('companyProfile.clients', [...clients, { name: '', logo: '' }])
    }

    const handleRemove = (index: number) => {
      handleNestedChange('companyProfile.clients', clients.filter((_, i) => i !== index))
    }

    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-earth'>Khách hàng tiêu biểu</label>
          {canUpdate && (
            <button type='button' onClick={handleAdd} className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'>+ Thêm</button>
          )}
        </div>
        {clients.map((c, i) => (
          <div key={i} className='flex items-center gap-3'>
            <input type='text' className={`${inputClasses} flex-1`} placeholder='Tên khách hàng' value={c.name || ''} onChange={(e) => handleUpdate(i, 'name', e.target.value)} disabled={!canUpdate} />
            <input type='text' className={`${inputClasses} flex-1`} placeholder='URL logo' value={c.logo || ''} onChange={(e) => handleUpdate(i, 'logo', e.target.value)} disabled={!canUpdate} />
            {canUpdate && <button type='button' onClick={() => handleRemove(i)} className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'>Xóa</button>}
          </div>
        ))}
        {clients.length === 0 && <p className='text-sm text-cement-dark'>Chưa có khách hàng nào.</p>}
      </div>
    )
  }

  const renderCertificationsEditor = () => {
    const certifications = (getNestedArray('companyProfile.certifications') as { name: string; image: string; year: string }[]) || []

    const handleUpdate = (index: number, field: 'name' | 'image' | 'year', value: string) => {
      const updated = certifications.map((c, i) => (i === index ? { ...c, [field]: value } : c))
      handleNestedChange('companyProfile.certifications', updated)
    }

    const handleAdd = () => {
      handleNestedChange('companyProfile.certifications', [...certifications, { name: '', image: '', year: '' }])
    }

    const handleRemove = (index: number) => {
      handleNestedChange('companyProfile.certifications', certifications.filter((_, i) => i !== index))
    }

    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-earth'>Chứng nhận & Giải thưởng</label>
          {canUpdate && (
            <button type='button' onClick={handleAdd} className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'>+ Thêm</button>
          )}
        </div>
        {certifications.map((c, i) => (
          <div key={i} className='flex items-center gap-3'>
            <input type='text' className={`${inputClasses} flex-1`} placeholder='Tên chứng nhận' value={c.name || ''} onChange={(e) => handleUpdate(i, 'name', e.target.value)} disabled={!canUpdate} />
            <input type='text' className={`${inputClasses} flex-1`} placeholder='URL hình ảnh' value={c.image || ''} onChange={(e) => handleUpdate(i, 'image', e.target.value)} disabled={!canUpdate} />
            <input type='text' className={`${inputClasses} w-24`} placeholder='Năm' value={c.year || ''} onChange={(e) => handleUpdate(i, 'year', e.target.value)} disabled={!canUpdate} />
            {canUpdate && <button type='button' onClick={() => handleRemove(i)} className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'>Xóa</button>}
          </div>
        ))}
        {certifications.length === 0 && <p className='text-sm text-cement-dark'>Chưa có chứng nhận nào.</p>}
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Tổng quan</h3>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Tên website', 'siteName', 'text', 'Giang Ngoc Store')}
              {renderInput('Slogan', 'siteSlogan', 'text', 'Chuyên cung cấp những sản phẩm độc đáo')}
            </div>
            <div className='grid gap-6 md:grid-cols-3'>
              {renderImageUpload('Logo', 'logo', 'Logo cho light mode')}
              {renderImageUpload('Logo tối', 'logoDark', 'Logo cho dark mode')}
              {renderImageUpload('Favicon', 'favicon', 'Icon hiển thị trên tab trình duyệt')}
            </div>
          </div>
        )

      case 'header':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Header</h3>
            <div className='rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <p className='text-sm text-cement-dark'>
                Quản lý các liên kết trong thanh header. Bạn có thể thêm, sửa, xóa hoặc ẩn/hiện các liên kết.
              </p>
            </div>
            {renderNavLinksEditor()}
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Text nút CTA', 'header.ctaText', 'text', 'Liên hệ tư vấn')}
              {renderInput('Link nút CTA', 'header.ctaLink', 'text', '/lien-he')}
            </div>
            {renderToggle('Hiển thị nút Admin', 'header.showAdminLink', 'Hiển thị liên kết vào admin panel trên header')}
          </div>
        )

      case 'footer':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Cài đặt Footer</h3>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Tên thương hiệu', 'footer.brandName', 'text', 'Gạch Ngói Việt')}
              {renderInput('Slogan footer', 'footer.brandSlogan', 'text', 'Tinh hoa làng nghề')}
            </div>
            {renderInput('Giới thiệu ngắn', 'footer.about', 'textarea', 'Mô tả ngắn về công ty...')}
            {renderInput('Bản quyền', 'footer.copyright', 'text', '© 2024 Gạch Ngói. All rights reserved.')}
            {renderToggle('Hiển thị icon mạng xã hội', 'footer.showSocialIcons')}
            {renderToggle('Hiển thị đăng ký newsletter', 'footer.showNewsletter')}
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Cột liên kết sản phẩm</h4>
              {renderFooterLinksEditor('Links sản phẩm', 'footer.productLinks')}
            </div>
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Cột liên kết công ty</h4>
              {renderFooterLinksEditor('Links công ty', 'footer.companyLinks')}
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

      case 'about':
        return (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-earth'>Trang Giới thiệu</h3>
              <a
                href='/gioi-thieu'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-lg bg-brick px-4 py-2 text-sm font-medium text-white hover:bg-brick/90'
              >
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                </svg>
                Xem trang
              </a>
            </div>
            <div className='rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <p className='text-sm text-cement-dark'>
                Quản lý nội dung hiển thị trên trang "Giới thiệu" của website.
              </p>
            </div>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Tiêu đề', 'aboutPage.title', 'text', 'Về chúng tôi')}
              {renderInput('Phụ đề', 'aboutPage.subtitle', 'text', 'Câu chuyện của chúng tôi')}
            </div>
            {renderInput('Nội dung chính', 'aboutPage.content', 'textarea', 'Giới thiệu về công ty...')}
            {renderImageUpload('Ảnh hero', 'aboutPage.heroImage', 'Ảnh đại diện cho trang giới thiệu')}
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Sứ mệnh & Tầm nhìn</h4>
              <div className='grid gap-4 md:grid-cols-2'>
                {renderInput('Tiêu đề sứ mệnh', 'aboutPage.missionTitle', 'text', 'Sứ mệnh')}
                {renderInput('Tiêu đề tầm nhìn', 'aboutPage.visionTitle', 'text', 'Tầm nhìn')}
              </div>
              {renderInput('Nội dung sứ mệnh', 'aboutPage.missionContent', 'textarea', 'Sứ mệnh của chúng tôi...')}
              {renderInput('Nội dung tầm nhìn', 'aboutPage.visionContent', 'textarea', 'Tầm nhìn của chúng tôi...')}
            </div>
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Đội ngũ</h4>
              {renderTeamMembersEditor()}
            </div>
          </div>
        )

      case 'notification':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Thanh thông báo</h3>
            <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
              <p className='text-sm text-blue-800'>
                Thanh thông báo sẽ hiển thị ở đầu trang cho tất cả khách truy cập. Thích hợp cho khuyến mãi,
                thông báo quan trọng, hoặc sự kiện.
              </p>
            </div>
            {renderToggle('Bật thanh thông báo', 'notification.enabled', 'Hiển thị thông báo trên đầu trang')}
            {renderInput('Nội dung thông báo', 'notification.message', 'textarea', 'Nội dung thông báo...')}
            {renderSelect('Loại thông báo', 'notification.type', [
              { value: 'info', label: 'Thông tin' },
              { value: 'warning', label: 'Cảnh báo' },
              { value: 'success', label: 'Thành công' },
              { value: 'promotion', label: 'Khuyến mãi' },
            ])}
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Link liên kết', 'notification.link', 'text', '/san-pham')}
              {renderInput('Text liên kết', 'notification.linkText', 'text', 'Xem ngay')}
            </div>
            {renderToggle('Cho phép tắt', 'notification.isDismissible', 'Người dùng có thể tắt thông báo')}
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
              {renderInput('Miễn phí ship', 'ecommerce.freeShippingThreshold', 'number')}
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
                <span className='font-medium'>Ghi chú:</span> Thay đổi màu sắc sẽ áp dụng cho toàn bộ website. Vui lòng kiểm tra kỹ trước khi lưu.
              </p>
            </div>
          </div>
        )

      case 'testimonials':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Khách hàng nói gì về chúng tôi</h3>
            <div className='rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <p className='text-sm text-cement-dark'>Quản lý các đánh giá của khách hàng hiển thị trên trang chủ.</p>
            </div>
            {renderTestimonialsEditor()}
          </div>
        )
      case 'company':
        return (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-earth'>Hồ sơ năng lực công ty</h3>
              <a
                href='/ho-so-nang-luc'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-lg bg-brick px-4 py-2 text-sm font-medium text-white hover:bg-brick/90'
              >
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                </svg>
                Xem trang
              </a>
            </div>
            <div className='rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <p className='text-sm text-cement-dark'>
                Cấu hình nội dung trang Hồ sơ năng lực. Trang này có thể xuất PDF và hiển thị QR code để khách hàng quét xem.
              </p>
            </div>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Tên công ty', 'companyProfile.companyName', 'text', 'Gạch Ngói Việt')}
              {renderInput('Năm thành lập', 'companyProfile.foundedYear', 'text', '1995')}
            </div>
            {renderInput('Mô tả công ty', 'companyProfile.description', 'textarea', 'Giới thiệu về công ty...')}
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Giá trị cốt lõi</h4>
              {renderCoreValuesEditor()}
            </div>
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Thống kê công ty</h4>
              {renderCompanyStatsEditor()}
            </div>
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Thành tựu nổi bật</h4>
              {renderCompanyAchievementsEditor()}
            </div>
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Khách hàng tiêu biểu</h4>
              {renderClientsEditor()}
            </div>
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Chứng nhận & Giải thưởng</h4>
              {renderCertificationsEditor()}
            </div>
          </div>
        )
      case 'maintenance':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Chế độ bảo trì</h3>
            <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
              <p className='text-sm text-yellow-800'>
                <span className='font-medium'>Cảnh báo:</span> Khi bật chế độ bảo trì, website sẽ không thể truy cập được cho khách hàng.
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
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-earth sm:text-3xl'>Cài đặt</h1>
          <p className='mt-1 text-sm text-cement-dark sm:mt-2 sm:text-base'>Quản lý toàn bộ cấu hình website</p>
        </div>
        {canUpdate && (
          <button
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
            className='w-full rounded-lg bg-brick px-6 py-2 font-medium text-white transition-colors hover:bg-brick/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
          >
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        )}
      </div>

      {/* Tabs and content */}
      <div className='grid gap-6 lg:grid-cols-[240px_1fr]'>
        {/* Tab navigation - horizontal scroll on mobile, vertical sidebar on desktop */}
        <div className='rounded-lg bg-white p-2 shadow-sm'>
          <nav className='flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:space-y-1 lg:overflow-x-visible lg:pb-0'>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-left transition-colors lg:w-full lg:gap-3 lg:py-3 ${
                  activeTab === tab.id
                    ? 'bg-brick font-medium text-white'
                    : 'text-earth hover:bg-cream-light'
                }`}
              >
                <span>{tab.icon}</span>
                <span className='text-sm'>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className='rounded-lg bg-white p-4 shadow-sm sm:p-6'>{renderTabContent()}</div>
      </div>
    </div>
  )
}
