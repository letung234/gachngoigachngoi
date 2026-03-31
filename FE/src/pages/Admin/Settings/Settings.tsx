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
  { id: 'general', name: 'Th�ｾ��ｽｴng tin chung', icon: '﨟槫ｮｵ' },
  { id: 'header', name: 'Header', icon: '﨟樣ｧ�' },
  { id: 'footer', name: 'Footer', icon: '﨟槫愛' },
  { id: 'contact', name: 'Li�ｾ��ｽｪn h逶ｻ�ｿｽ', icon: '﨟槫芦' },
  { id: 'social', name: 'M陂ｯ�ｽ｡ng x�ｾ��ｽ｣ h逶ｻ蜀�', icon: '﨟槫ｹ' },
  { id: 'seo', name: 'SEO', icon: '﨟槫翁' },
  { id: 'homepage', name: 'Trang ch逶ｻ�ｽｧ', icon: '﨟槫権' },
  { id: 'about', name: 'Gi逶ｻ螫� thi逶ｻ緕｡', icon: '﨟槫ｽ�' },
  { id: 'notification', name: 'Th�ｾ��ｽｴng b�ｾ��ｽ｡o', icon: '﨟樒ｲ�' },
  { id: 'ecommerce', name: 'E-commerce', icon: '﨟槫ｰ�' },
  { id: 'theme', name: 'Giao di逶ｻ繻ｻ', icon: '﨟櫁ｳ' },
  { id: 'testimonials', name: 'Testimonials', icon: '邂晢ｿｽ' },
  { id: 'company', name: 'H逶ｻ�ｿｽ s�ｾ��ｽ｡ c�ｾ��ｽｴng ty', icon: '﨟槫小' },
  { id: 'maintenance', name: 'B陂ｯ�ｽ｣o tr�ｾ��ｽｬ', icon: '﨟櫁ｌ' },
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
      toast.success('C陂ｯ�ｽｭp nh陂ｯ�ｽｭt c陂ｯ�ｽ･u h�ｾ��ｽｬnh th�ｾ��ｿｽnh c�ｾ��ｽｴng')
      queryClient.invalidateQueries({ queryKey: ['admin-config'] })
      setIsDirty(false)
    },
    onError: () => {
      toast.error('C陂ｯ�ｽｭp nh陂ｯ�ｽｭt c陂ｯ�ｽ･u h�ｾ��ｽｬnh th陂ｯ�ｽ･t b陂ｯ�ｽ｡i')
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

      toast.success('Upload 陂ｯ�ｽ｣nh th�ｾ��ｿｽnh c�ｾ��ｽｴng')
    },
    onError: () => {
      toast.error('Upload 陂ｯ�ｽ｣nh th陂ｯ�ｽ･t b陂ｯ�ｽ｡i')
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
            {isUploading ? '�ｾ�邏ｳng t陂ｯ�ｽ｣i...' : value ? 'Thay �ｾ�鮟幢ｽｻ蜩�' : 'T陂ｯ�ｽ｣i l�ｾ��ｽｪn'}
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
          <label className='block text-sm font-medium text-earth'>Li�ｾ��ｽｪn k陂ｯ�ｽｿt �ｾ�險ｴ逶ｻ縲� h�ｾ��ｽｰ逶ｻ螫ｾg</label>
          {canUpdate && (
            <button
              type='button'
              onClick={handleAddNavLink}
              className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'
            >+ Th�ｾ��ｽｪm</button>
          )}
        </div>
        {navLinks.map((link, index) => (
          <div key={index} className='flex items-center gap-3 rounded-lg border border-cement-light p-3'>
            <input
              type='text'
              className={`${inputClasses} flex-1`}
              placeholder='T�ｾ��ｽｪn hi逶ｻ繝� th逶ｻ�ｿｽ'
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
              {link.isEnabled ? 'B陂ｯ�ｽｭt' : 'T陂ｯ�ｽｯt'}
            </button>
            {canUpdate && (
              <button
                type='button'
                onClick={() => handleRemoveNavLink(index)}
                className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'
              >
                隨ｨ�ｿｽ
              </button>
            )}
          </div>
        ))}
        {navLinks.length === 0 && (
          <p className='text-sm text-cement-dark'>Ch�ｾ��ｽｰa c�ｾ��ｽｳ li�ｾ��ｽｪn k陂ｯ�ｽｿt n�ｾ��ｿｽo.</p>
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
            >+ Th�ｾ��ｽｪm</button>
          )}
        </div>
        {links.map((link, index) => (
          <div key={index} className='flex items-center gap-3'>
            <input
              type='text'
              className={`${inputClasses} flex-1`}
              placeholder='T�ｾ��ｽｪn hi逶ｻ繝� th逶ｻ�ｿｽ'
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
                隨ｨ�ｿｽ
              </button>
            )}
          </div>
        ))}
        {links.length === 0 && (
          <p className='text-sm text-cement-dark'>Ch�ｾ��ｽｰa c�ｾ��ｽｳ li�ｾ��ｽｪn k陂ｯ�ｽｿt n�ｾ��ｿｽo.</p>
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
          <label className='block text-sm font-medium text-earth'>Th�ｾ��ｿｽnh vi�ｾ��ｽｪn �ｾ�鮟幢ｽｻ蜀� ng�ｾ��ｽｩ</label>
          {canUpdate && (
            <button
              type='button'
              onClick={handleAdd}
              className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'
            >+ Th�ｾ��ｽｪm</button>
          )}
        </div>
        {members.map((member, index) => (
          <div key={index} className='flex items-center gap-3 rounded-lg border border-cement-light p-3'>
            <input
              type='text'
              className={`${inputClasses} flex-1`}
              placeholder='T�ｾ��ｽｪn'
              value={member.name || ''}
              onChange={(e) => handleUpdate(index, 'name', e.target.value)}
              disabled={!canUpdate}
            />
            <input
              type='text'
              className={`${inputClasses} flex-1`}
              placeholder='Ch逶ｻ�ｽｩc v逶ｻ�ｽ･'
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
                隨ｨ�ｿｽ
              </button>
            )}
          </div>
        ))}
        {members.length === 0 && (
          <p className='text-sm text-cement-dark'>Ch�ｾ��ｽｰa c�ｾ��ｽｳ th�ｾ��ｿｽnh vi�ｾ��ｽｪn n�ｾ��ｿｽo.</p>
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
          <label className='block text-sm font-medium text-earth'>�ｾ�髱呻ｽ｡nh gi�ｾ��ｽ｡ kh�ｾ��ｽ｡ch h�ｾ��ｿｽng</label>
          {canUpdate && (
            <button type='button' onClick={handleAdd} className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'>
              + Th�ｾ��ｽｪm
            </button>
          )}
        </div>
        {testimonials.map((t, i) => (
          <div key={i} className='space-y-3 rounded-lg border border-cement-light p-4'>
            <div className='grid gap-3 md:grid-cols-2'>
              <input type='text' className={inputClasses} placeholder='T�ｾ��ｽｪn kh�ｾ��ｽ｡ch h�ｾ��ｿｽng' value={t.name || ''} onChange={(e) => handleUpdate(i, 'name', e.target.value)} disabled={!canUpdate} />
              <input type='text' className={inputClasses} placeholder='Ch逶ｻ�ｽｩc v逶ｻ�ｽ･ / C�ｾ��ｽｴng ty' value={t.role || ''} onChange={(e) => handleUpdate(i, 'role', e.target.value)} disabled={!canUpdate} />
            </div>
            <textarea className={inputClasses} placeholder='N逶ｻ蜀� dung �ｾ�螯･�ｽ｡nh gi�ｾ��ｽ｡...' rows={2} value={t.content || ''} onChange={(e) => handleUpdate(i, 'content', e.target.value)} disabled={!canUpdate} />
            <div className='flex items-center gap-3'>
              <input type='text' className={`${inputClasses} flex-1`} placeholder='URL avatar' value={t.avatar || ''} onChange={(e) => handleUpdate(i, 'avatar', e.target.value)} disabled={!canUpdate} />
              <input type='number' className={`${inputClasses} w-20`} placeholder='Rating' min={1} max={5} value={t.rating || 5} onChange={(e) => handleUpdate(i, 'rating', Number(e.target.value))} disabled={!canUpdate} />
              {canUpdate && (
                <button type='button' onClick={() => handleRemove(i)} className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'>隨ｨ�ｿｽ</button>
              )}
            </div>
          </div>
        ))}
        {testimonials.length === 0 && <p className='text-sm text-cement-dark'>Ch�ｾ��ｽｰa c�ｾ��ｽｳ �ｾ�螯･�ｽ｡nh gi�ｾ��ｽ｡ n�ｾ��ｿｽo.</p>}
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
          <label className='block text-sm font-medium text-earth'>Th逶ｻ蜑ｵg k�ｾ��ｽｪ c�ｾ��ｽｴng ty</label>
          {canUpdate && (
            <button type='button' onClick={handleAdd} className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'>+ Th�ｾ��ｽｪm</button>
          )}
        </div>
        {stats.map((s, i) => (
          <div key={i} className='flex items-center gap-3'>
            <input type='text' className={`${inputClasses} flex-1`} placeholder='Nh�ｾ��ｽ｣n (vd: N�ｾ�繝� KN)' value={s.label || ''} onChange={(e) => handleUpdate(i, 'label', e.target.value)} disabled={!canUpdate} />
            <input type='text' className={`${inputClasses} w-24`} placeholder='Gi�ｾ��ｽ｡ tr逶ｻ�ｿｽ' value={s.value || ''} onChange={(e) => handleUpdate(i, 'value', e.target.value)} disabled={!canUpdate} />
            <input type='text' className={`${inputClasses} w-16`} placeholder='+' value={s.suffix || ''} onChange={(e) => handleUpdate(i, 'suffix', e.target.value)} disabled={!canUpdate} />
            {canUpdate && <button type='button' onClick={() => handleRemove(i)} className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'>隨ｨ�ｿｽ</button>}
          </div>
        ))}
        {stats.length === 0 && <p className='text-sm text-cement-dark'>Ch�ｾ��ｽｰa c�ｾ��ｽｳ th逶ｻ蜑ｵg k�ｾ��ｽｪ.</p>}
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
          <label className='block text-sm font-medium text-earth'>Th�ｾ��ｿｽnh t逶ｻ�ｽｱu</label>
          {canUpdate && (
            <button type='button' onClick={handleAdd} className='rounded-lg bg-brick px-3 py-1 text-xs font-medium text-white hover:bg-brick/90'>+ Th�ｾ��ｽｪm</button>
          )}
        </div>
        {achievements.map((a, i) => (
          <div key={i} className='flex items-start gap-3 rounded-lg border border-cement-light p-3'>
            <input type='text' className={`${inputClasses} w-16`} placeholder='Icon' value={a.icon || ''} onChange={(e) => handleUpdate(i, 'icon', e.target.value)} disabled={!canUpdate} />
            <div className='flex-1 space-y-2'>
              <input type='text' className={inputClasses} placeholder='Ti�ｾ��ｽｪu �ｾ�鮟幢ｽｻ�ｿｽ' value={a.title || ''} onChange={(e) => handleUpdate(i, 'title', e.target.value)} disabled={!canUpdate} />
              <input type='text' className={inputClasses} placeholder='M�ｾ��ｽｴ t陂ｯ�ｽ｣' value={a.description || ''} onChange={(e) => handleUpdate(i, 'description', e.target.value)} disabled={!canUpdate} />
            </div>
            {canUpdate && <button type='button' onClick={() => handleRemove(i)} className='rounded-lg bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100'>隨ｨ�ｿｽ</button>}
          </div>
        ))}
        {achievements.length === 0 && <p className='text-sm text-cement-dark'>Ch�ｾ��ｽｰa c�ｾ��ｽｳ th�ｾ��ｿｽnh t逶ｻ�ｽｱu n�ｾ��ｿｽo.</p>}
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Th�ｾ��ｽｴng tin c�ｾ��ｽ｡ b陂ｯ�ｽ｣n</h3>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('T�ｾ��ｽｪn website', 'siteName', 'text', 'G陂ｯ�ｽ｡ch Ng�ｾ��ｽｳi Store')}
              {renderInput('Slogan', 'siteSlogan', 'text', 'Ch陂ｯ�ｽ･t l�ｾ��ｽｰ逶ｻ�ｽ｣ng t陂ｯ�ｽ｡o n�ｾ��ｽｪn kh�ｾ��ｽ｡c bi逶ｻ繽�')}
            </div>
            <div className='grid gap-6 md:grid-cols-3'>
              {renderImageUpload('Logo', 'logo', 'Logo hi逶ｻ繝� th逶ｻ�ｿｽ tr�ｾ��ｽｪn header')}
              {renderImageUpload('Logo t逶ｻ險ｴ', 'logoDark', 'Logo cho dark mode')}
              {renderImageUpload('Favicon', 'favicon', 'Icon hi逶ｻ繝� th逶ｻ�ｿｽ tr�ｾ��ｽｪn tab tr�ｾ��ｽｬnh duy逶ｻ繽�')}
            </div>
          </div>
        )

      case 'header':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>C�ｾ��ｿｽi �ｾ�鮟幢ｽｺ�ｽｷt Header</h3>
            <div className='rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <p className='text-sm text-cement-dark'>
                Qu陂ｯ�ｽ｣n l�ｾ��ｽｽ c�ｾ��ｽ｡c li�ｾ��ｽｪn k陂ｯ�ｽｿt �ｾ�險ｴ逶ｻ縲� h�ｾ��ｽｰ逶ｻ螫ｾg v�ｾ��ｿｽ n�ｾ��ｽｺt CTA tr�ｾ��ｽｪn thanh header. B陂ｯ�ｽ｡n c�ｾ��ｽｳ th逶ｻ�ｿｽ th�ｾ��ｽｪm, s逶ｻ�ｽｭa, x�ｾ��ｽｳa, ho陂ｯ�ｽｷc 陂ｯ�ｽｩn/hi逶ｻ繻ｻ t逶ｻ�ｽｫng li�ｾ��ｽｪn k陂ｯ�ｽｿt.
              </p>
            </div>
            {renderNavLinksEditor()}
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Text n�ｾ��ｽｺt CTA', 'header.ctaText', 'text', 'Li�ｾ��ｽｪn h逶ｻ�ｿｽ t�ｾ��ｽｰ v陂ｯ�ｽ･n')}
              {renderInput('Link n�ｾ��ｽｺt CTA', 'header.ctaLink', 'text', '/lien-he')}
            </div>
            {renderToggle('Hi逶ｻ繝� th逶ｻ�ｿｽ n�ｾ��ｽｺt Admin', 'header.showAdminLink', 'Hi逶ｻ繝� th逶ｻ�ｿｽ li�ｾ��ｽｪn k陂ｯ�ｽｿt v�ｾ��ｿｽo admin panel tr�ｾ��ｽｪn header')}
          </div>
        )

      case 'footer':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>C�ｾ��ｿｽi �ｾ�鮟幢ｽｺ�ｽｷt Footer</h3>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('T�ｾ��ｽｪn th�ｾ��ｽｰ�ｾ��ｽ｡ng hi逶ｻ緕｡', 'footer.brandName', 'text', 'G陂ｯ�ｽ｡ch Ng�ｾ��ｽｳi Vi逶ｻ繽�')}
              {renderInput('Slogan footer', 'footer.brandSlogan', 'text', 'Tinh hoa l�ｾ��ｿｽng ngh逶ｻ�ｿｽ')}
            </div>
            {renderInput('Gi逶ｻ螫� thi逶ｻ緕｡ ng陂ｯ�ｽｯn', 'footer.about', 'textarea', 'M�ｾ��ｽｴ t陂ｯ�ｽ｣ ng陂ｯ�ｽｯn v逶ｻ�ｿｽ c�ｾ��ｽｴng ty...')}
            {renderInput('B陂ｯ�ｽ｣n quy逶ｻ�ｼｽ', 'footer.copyright', 'text', '�ｾゑｽｩ 2024 G陂ｯ�ｽ｡ch Ng�ｾ��ｽｳi. All rights reserved.')}
            {renderToggle('Hi逶ｻ繝� th逶ｻ�ｿｽ icon m陂ｯ�ｽ｡ng x�ｾ��ｽ｣ h逶ｻ蜀�', 'footer.showSocialIcons')}
            {renderToggle('Hi逶ｻ繝� th逶ｻ�ｿｽ �ｾ�諠ｰ繝夙 k�ｾ��ｽｽ newsletter', 'footer.showNewsletter')}
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>C逶ｻ蜀ｲ li�ｾ��ｽｪn k陂ｯ�ｽｿt s陂ｯ�ｽ｣n ph陂ｯ�ｽｩm</h4>
              {renderFooterLinksEditor('Links s陂ｯ�ｽ｣n ph陂ｯ�ｽｩm', 'footer.productLinks')}
            </div>
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>C逶ｻ蜀ｲ li�ｾ��ｽｪn k陂ｯ�ｽｿt c�ｾ��ｽｴng ty</h4>
              {renderFooterLinksEditor('Links c�ｾ��ｽｴng ty', 'footer.companyLinks')}
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Th�ｾ��ｽｴng tin li�ｾ��ｽｪn h逶ｻ�ｿｽ</h3>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Email', 'contact.email', 'email', 'contact@example.com')}
              {renderInput('S逶ｻ�ｿｽ �ｾ�險ｴ逶ｻ繻ｻ tho陂ｯ�ｽ｡i', 'contact.phone', 'text', '0123 456 789')}
              {renderInput('Hotline', 'contact.hotline', 'text', '1800 xxxx')}
              {renderInput('Gi逶ｻ�ｿｽ l�ｾ��ｿｽm vi逶ｻ繻�', 'contact.workingHours', 'text', '8:00 - 17:00, Th逶ｻ�ｽｩ 2 - Th逶ｻ�ｽｩ 7')}
            </div>
            {renderInput('�ｾ�髮ｪ�ｽｻ陝ｻ ch逶ｻ�ｿｽ', 'contact.address', 'text', '123 �ｾ�閼��ｽｰ逶ｻ諡ｵg ABC, Qu陂ｯ�ｽｭn XYZ, TP.HCM')}
            {renderInput('Nh�ｾ��ｽｺng Google Maps', 'contact.mapEmbed', 'textarea', '<iframe src="..."></iframe>')}
          </div>
        )

      case 'social':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Li�ｾ��ｽｪn k陂ｯ�ｽｿt m陂ｯ�ｽ｡ng x�ｾ��ｽ｣ h逶ｻ蜀�</h3>
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
            <h3 className='text-lg font-semibold text-earth'>C�ｾ��ｿｽi �ｾ�鮟幢ｽｺ�ｽｷt SEO</h3>
            {renderInput('Meta Title', 'seo.metaTitle', 'text', 'G陂ｯ�ｽ｡ch Ng�ｾ��ｽｳi - V陂ｯ�ｽｭt li逶ｻ緕｡ x�ｾ��ｽ｢y d逶ｻ�ｽｱng ch陂ｯ�ｽ･t l�ｾ��ｽｰ逶ｻ�ｽ｣ng')}
            {renderInput('Meta Description', 'seo.metaDescription', 'textarea', 'M�ｾ��ｽｴ t陂ｯ�ｽ｣ ng陂ｯ�ｽｯn v逶ｻ�ｿｽ website...')}
            {renderInput('Meta Keywords', 'seo.metaKeywords', 'text', 'g陂ｯ�ｽ｡ch, ng�ｾ��ｽｳi, v陂ｯ�ｽｭt li逶ｻ緕｡ x�ｾ��ｽ｢y d逶ｻ�ｽｱng')}
            {renderImageUpload('OG Image', 'seo.ogImage', '陂ｯ�ｽ｢nh hi逶ｻ繝� th逶ｻ�ｿｽ khi chia s陂ｯ�ｽｻ tr�ｾ��ｽｪn m陂ｯ�ｽ｡ng x�ｾ��ｽ｣ h逶ｻ蜀�')}
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Google Analytics ID', 'seo.googleAnalyticsId', 'text', 'UA-XXXXXXXXX-X')}
              {renderInput('Facebook Pixel ID', 'seo.facebookPixelId', 'text', 'XXXXXXXXXXXXXXXX')}
            </div>
          </div>
        )

      case 'homepage':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>C�ｾ��ｿｽi �ｾ�鮟幢ｽｺ�ｽｷt trang ch逶ｻ�ｽｧ</h3>
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Hero Section</h4>
              <div className='grid gap-4 md:grid-cols-2'>
                {renderInput('Ti�ｾ��ｽｪu �ｾ�鮟幢ｽｻ�ｿｽ Hero', 'homepage.heroTitle', 'text', 'Ch�ｾ��ｿｽo m逶ｻ�ｽｫng �ｾ�鮟幢ｽｺ�ｽｿn v逶ｻ螫�...')}
                {renderInput('Ph逶ｻ�ｽ･ �ｾ�鮟幢ｽｻ�ｿｽ Hero', 'homepage.heroSubtitle', 'text', 'D�ｾ��ｽｲng ch逶ｻ�ｽｯ ph逶ｻ�ｽ･...')}
              </div>
              {renderImageUpload('陂ｯ�ｽ｢nh Hero', 'homepage.heroImage', '陂ｯ�ｽ｢nh n逶ｻ�ｼｽ cho hero section')}
              <div className='grid gap-4 md:grid-cols-2'>
                {renderInput('Text n�ｾ��ｽｺt CTA', 'homepage.heroButtonText', 'text', 'Kh�ｾ��ｽ｡m ph�ｾ��ｽ｡ ngay')}
                {renderInput('Link n�ｾ��ｽｺt CTA', 'homepage.heroButtonLink', 'text', '/san-pham')}
              </div>
            </div>
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>Banner</h4>
              {renderToggle('Hi逶ｻ繝� th逶ｻ�ｿｽ banner', 'homepage.showBanner', 'B陂ｯ�ｽｭt/t陂ｯ�ｽｯt hi逶ｻ繝� th逶ｻ�ｿｽ banner tr�ｾ��ｽｪn trang ch逶ｻ�ｽｧ')}
            </div>
          </div>
        )

      case 'about':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Trang Gi逶ｻ螫� thi逶ｻ緕｡</h3>
            <div className='rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <p className='text-sm text-cement-dark'>
                Qu陂ｯ�ｽ｣n l�ｾ��ｽｽ n逶ｻ蜀� dung hi逶ｻ繝� th逶ｻ�ｿｽ tr�ｾ��ｽｪn trang "Gi逶ｻ螫� thi逶ｻ緕｡" c逶ｻ�ｽｧa website.
              </p>
            </div>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Ti�ｾ��ｽｪu �ｾ�鮟幢ｽｻ�ｿｽ', 'aboutPage.title', 'text', 'V逶ｻ�ｿｽ ch�ｾ��ｽｺng t�ｾ��ｽｴi')}
              {renderInput('Ph逶ｻ�ｽ･ �ｾ�鮟幢ｽｻ�ｿｽ', 'aboutPage.subtitle', 'text', 'C�ｾ��ｽ｢u chuy逶ｻ繻ｻ c逶ｻ�ｽｧa ch�ｾ��ｽｺng t�ｾ��ｽｴi')}
            </div>
            {renderInput('N逶ｻ蜀� dung ch�ｾ��ｽｭnh', 'aboutPage.content', 'textarea', 'Gi逶ｻ螫� thi逶ｻ緕｡ v逶ｻ�ｿｽ c�ｾ��ｽｴng ty...')}
            {renderImageUpload('陂ｯ�ｽ｢nh hero', 'aboutPage.heroImage', '陂ｯ�ｽ｢nh �ｾ�鮟幢ｽｺ�ｽ｡i di逶ｻ繻ｻ cho trang gi逶ｻ螫� thi逶ｻ緕｡')}
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>S逶ｻ�ｽｩ m逶ｻ繻ｻh & T陂ｯ�ｽｧm nh�ｾ��ｽｬn</h4>
              <div className='grid gap-4 md:grid-cols-2'>
                {renderInput('Ti�ｾ��ｽｪu �ｾ�鮟幢ｽｻ�ｿｽ s逶ｻ�ｽｩ m逶ｻ繻ｻh', 'aboutPage.missionTitle', 'text', 'S逶ｻ�ｽｩ m逶ｻ繻ｻh')}
                {renderInput('Ti�ｾ��ｽｪu �ｾ�鮟幢ｽｻ�ｿｽ t陂ｯ�ｽｧm nh�ｾ��ｽｬn', 'aboutPage.visionTitle', 'text', 'T陂ｯ�ｽｧm nh�ｾ��ｽｬn')}
              </div>
              {renderInput('N逶ｻ蜀� dung s逶ｻ�ｽｩ m逶ｻ繻ｻh', 'aboutPage.missionContent', 'textarea', 'S逶ｻ�ｽｩ m逶ｻ繻ｻh c逶ｻ�ｽｧa ch�ｾ��ｽｺng t�ｾ��ｽｴi...')}
              {renderInput('N逶ｻ蜀� dung t陂ｯ�ｽｧm nh�ｾ��ｽｬn', 'aboutPage.visionContent', 'textarea', 'T陂ｯ�ｽｧm nh�ｾ��ｽｬn c逶ｻ�ｽｧa ch�ｾ��ｽｺng t�ｾ��ｽｴi...')}
            </div>
            <div className='space-y-4 rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <h4 className='font-medium text-earth'>�ｾ�髮ｪ�ｽｻ蜀� ng�ｾ��ｽｩ</h4>
              {renderTeamMembersEditor()}
            </div>
          </div>
        )

      case 'notification':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Thanh th�ｾ��ｽｴng b�ｾ��ｽ｡o</h3>
            <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
              <p className='text-sm text-blue-800'>
                Thanh th�ｾ��ｽｴng b�ｾ��ｽ｡o s陂ｯ�ｽｽ hi逶ｻ繝� th逶ｻ�ｿｽ 逶ｻ�ｿｽ �ｾ�鮟幢ｽｺ�ｽｧu trang cho t陂ｯ�ｽ･t c陂ｯ�ｽ｣ kh�ｾ��ｽ｡ch truy c陂ｯ�ｽｭp. Th�ｾ��ｽｭch h逶ｻ�ｽ｣p cho khuy陂ｯ�ｽｿn m�ｾ��ｽ｣i,
                th�ｾ��ｽｴng b�ｾ��ｽ｡o quan tr逶ｻ閧ｱg, ho陂ｯ�ｽｷc s逶ｻ�ｽｱ ki逶ｻ繻ｻ.
              </p>
            </div>
            {renderToggle('B陂ｯ�ｽｭt thanh th�ｾ��ｽｴng b�ｾ��ｽ｡o', 'notification.enabled', 'Hi逶ｻ繝� th逶ｻ�ｿｽ th�ｾ��ｽｴng b�ｾ��ｽ｡o tr�ｾ��ｽｪn �ｾ�鮟幢ｽｺ�ｽｧu trang')}
            {renderInput('N逶ｻ蜀� dung th�ｾ��ｽｴng b�ｾ��ｽ｡o', 'notification.message', 'textarea', 'N逶ｻ蜀� dung th�ｾ��ｽｴng b�ｾ��ｽ｡o...')}
            {renderSelect('Lo陂ｯ�ｽ｡i th�ｾ��ｽｴng b�ｾ��ｽ｡o', 'notification.type', [
              { value: 'info', label: 'Th�ｾ��ｽｴng tin' },
              { value: 'warning', label: 'C陂ｯ�ｽ｣nh b�ｾ��ｽ｡o' },
              { value: 'success', label: 'Th�ｾ��ｿｽnh c�ｾ��ｽｴng' },
              { value: 'promotion', label: 'Khuy陂ｯ�ｽｿn m�ｾ��ｽ｣i' },
            ])}
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Link li�ｾ��ｽｪn k陂ｯ�ｽｿt', 'notification.link', 'text', '/san-pham')}
              {renderInput('Text li�ｾ��ｽｪn k陂ｯ�ｽｿt', 'notification.linkText', 'text', 'Xem ngay')}
            </div>
            {renderToggle('Cho ph�ｾ��ｽｩp t陂ｯ�ｽｯt', 'notification.isDismissible', 'Ng�ｾ��ｽｰ逶ｻ諡ｱ d�ｾ��ｽｹng c�ｾ��ｽｳ th逶ｻ�ｿｽ t陂ｯ�ｽｯt th�ｾ��ｽｴng b�ｾ��ｽ｡o')}
          </div>
        )

      case 'ecommerce':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>C�ｾ��ｿｽi �ｾ�鮟幢ｽｺ�ｽｷt E-commerce</h3>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('Ti逶ｻ�ｼｽ t逶ｻ�ｿｽ', 'ecommerce.currency', 'text', 'VND')}
              {renderInput('K�ｾ��ｽｽ hi逶ｻ緕｡ ti逶ｻ�ｼｽ t逶ｻ�ｿｽ', 'ecommerce.currencySymbol', 'text', '遶��ｽｫ')}
              {renderInput('Thu陂ｯ�ｽｿ (%)', 'ecommerce.taxRate', 'number')}
              {renderInput('M�ｾ��ｿｽu ph逶ｻ�ｽ･', 'ecommerce.freeShippingThreshold', 'number')}
              {renderInput('�ｾ�閼��ｽ｡n h�ｾ��ｿｽng t逶ｻ險ｴ thi逶ｻ繝�', 'ecommerce.minOrderAmount', 'number')}
            </div>
            <div className='space-y-4'>
              {renderToggle('Hi逶ｻ繝� th逶ｻ�ｿｽ s陂ｯ�ｽ｣n ph陂ｯ�ｽｩm h陂ｯ�ｽｿt h�ｾ��ｿｽng', 'ecommerce.showOutOfStock')}
              {renderToggle('Cho ph�ｾ��ｽｩp �ｾ�螯･�ｽ｡nh gi�ｾ��ｽ｡ s陂ｯ�ｽ｣n ph陂ｯ�ｽｩm', 'ecommerce.enableReviews')}
            </div>
          </div>
        )

      case 'theme':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>C�ｾ��ｿｽi �ｾ�鮟幢ｽｺ�ｽｷt giao di逶ｻ繻ｻ</h3>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('M�ｾ��ｿｽu ch�ｾ��ｽｭnh', 'theme.primaryColor', 'color')}
              {renderInput('M�ｾ��ｿｽu ph逶ｻ�ｽ･', 'theme.secondaryColor', 'color')}
              {renderInput('M�ｾ��ｿｽu nh陂ｯ�ｽ･n', 'theme.accentColor', 'color')}
              {renderInput('Font ch逶ｻ�ｽｯ', 'theme.fontFamily', 'text', 'Be Vietnam Pro, sans-serif')}
            </div>
            <div className='rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <p className='text-sm text-cement-dark'>
                <span className='font-medium'>Ghi ch�ｾ��ｽｺ:</span> Thay �ｾ�鮟幢ｽｻ蜩� m�ｾ��ｿｽu s陂ｯ�ｽｯc s陂ｯ�ｽｽ �ｾ��ｽ｡p d逶ｻ�ｽ･ng cho to�ｾ��ｿｽn b逶ｻ�ｿｽ website. Vui l�ｾ��ｽｲng ki逶ｻ繝� tra k逶ｻ�ｽｹ tr�ｾ��ｽｰ逶ｻ雖ｩ khi l�ｾ��ｽｰu.
              </p>
            </div>
          </div>
        )

      case 'testimonials':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Kh�ｾ��ｽ｡ch h�ｾ��ｿｽng n�ｾ��ｽｳi g�ｾ��ｽｬ v逶ｻ�ｿｽ ch�ｾ��ｽｺng t�ｾ��ｽｴi</h3>
            <div className='rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <p className='text-sm text-cement-dark'>Qu陂ｯ�ｽ｣n l�ｾ��ｽｽ c�ｾ��ｽ｡c �ｾ�螯･�ｽ｡nh gi�ｾ��ｽ｡ c逶ｻ�ｽｧa kh�ｾ��ｽ｡ch h�ｾ��ｿｽng hi逶ｻ繝� th逶ｻ�ｿｽ tr�ｾ��ｽｪn trang ch逶ｻ�ｽｧ.</p>
            </div>
            {renderTestimonialsEditor()}
          </div>
        )
      case 'company':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>H逶ｻ�ｿｽ s�ｾ��ｽ｡ n�ｾ�繝夙 l逶ｻ�ｽｱc c�ｾ��ｽｴng ty</h3>
            <div className='rounded-lg border border-cement-light bg-cream-light/50 p-4'>
              <p className='text-sm text-cement-dark'>C陂ｯ�ｽ･u h�ｾ��ｽｬnh n逶ｻ蜀� dung trang H逶ｻ�ｿｽ s�ｾ��ｽ｡ n�ｾ�繝夙 l逶ｻ�ｽｱc.</p>
            </div>
            <div className='grid gap-6 md:grid-cols-2'>
              {renderInput('T�ｾ��ｽｪn c�ｾ��ｽｴng ty', 'companyProfile.companyName', 'text', 'G陂ｯ�ｽ｡ch Ng�ｾ��ｽｳi Vi逶ｻ繽�')}
              {renderInput('N�ｾ�繝� th�ｾ��ｿｽnh l陂ｯ�ｽｭp', 'companyProfile.foundedYear', 'text', '1995')}
            </div>
            {renderInput('M�ｾ��ｽｴ t陂ｯ�ｽ｣ c�ｾ��ｽｴng ty', 'companyProfile.description', 'textarea', 'Gi逶ｻ螫� thi逶ｻ緕｡ v逶ｻ�ｿｽ c�ｾ��ｽｴng ty...')}
            {renderCompanyStatsEditor()}
            {renderCompanyAchievementsEditor()}
          </div>
        )
      case 'maintenance':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-earth'>Ch陂ｯ�ｽｿ �ｾ�鮟幢ｽｻ�ｿｽ b陂ｯ�ｽ｣o tr�ｾ��ｽｬ</h3>
            <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
              <p className='text-sm text-yellow-800'>
                <span className='font-medium'>C陂ｯ�ｽ｣nh b�ｾ��ｽ｡o:</span> Khi b陂ｯ�ｽｭt ch陂ｯ�ｽｿ �ｾ�鮟幢ｽｻ�ｿｽ b陂ｯ�ｽ｣o tr�ｾ��ｽｬ, website s陂ｯ�ｽｽ kh�ｾ��ｽｴng th逶ｻ�ｿｽ truy c陂ｯ�ｽｭp �ｾ�譟��ｽｰ逶ｻ�ｽ｣c cho kh�ｾ��ｽ｡ch h�ｾ��ｿｽng.
              </p>
            </div>
            {renderToggle('B陂ｯ�ｽｭt ch陂ｯ�ｽｿ �ｾ�鮟幢ｽｻ�ｿｽ b陂ｯ�ｽ｣o tr�ｾ��ｽｬ', 'maintenance.enabled', 'Website s陂ｯ�ｽｽ t陂ｯ�ｽ｡m ng逶ｻ�ｽｫng ho陂ｯ�ｽ｡t �ｾ�鮟幢ｽｻ蜀｢g')}
            {renderInput(
              'Th�ｾ��ｽｴng b�ｾ��ｽ｡o b陂ｯ�ｽ｣o tr�ｾ��ｽｬ',
              'maintenance.message',
              'textarea',
              'Website �ｾ�逍始g �ｾ�譟��ｽｰ逶ｻ�ｽ｣c b陂ｯ�ｽ｣o tr�ｾ��ｽｬ, vui l�ｾ��ｽｲng quay l陂ｯ�ｽ｡i sau...'
            )}
            {renderInput(
              'IP �ｾ�譟��ｽｰ逶ｻ�ｽ｣c ph�ｾ��ｽｩp truy c陂ｯ�ｽｭp',
              'maintenance.allowedIPs',
              'text',
              'Nh陂ｯ�ｽｭp c�ｾ��ｽ｡c IP c�ｾ��ｽ｡ch nhau b陂ｯ�ｽｱng d陂ｯ�ｽ･u ph陂ｯ�ｽｩy'
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
          <h1 className='text-2xl font-bold text-earth sm:text-3xl'>C�ｾ��ｿｽi �ｾ�鮟幢ｽｺ�ｽｷt</h1>
          <p className='mt-1 text-sm text-cement-dark sm:mt-2 sm:text-base'>Qu陂ｯ�ｽ｣n l�ｾ��ｽｽ to�ｾ��ｿｽn b逶ｻ�ｿｽ c陂ｯ�ｽ･u h�ｾ��ｽｬnh website</p>
        </div>
        {canUpdate && (
          <button
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
            className='w-full rounded-lg bg-brick px-6 py-2 font-medium text-white transition-colors hover:bg-brick/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
          >
            {updateMutation.isPending ? '�ｾ�邏ｳng l�ｾ��ｽｰu...' : 'L�ｾ��ｽｰu thay �ｾ�鮟幢ｽｻ蜩�'}
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
