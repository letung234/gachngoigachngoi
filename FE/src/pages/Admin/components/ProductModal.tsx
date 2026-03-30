import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import adminApi, { ProductBody, ProductSpecs, ProductReview } from 'src/apis/admin.api'
import categoryApi from 'src/apis/category.api'
import { toast } from 'react-toastify'
import { Product } from 'src/types/product.type'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
}

const specLabels: Record<keyof ProductSpecs, string> = {
  size: 'Kích thước',
  thickness: 'Độ dày',
  weight: 'Trọng lượng',
  material: 'Chất liệu',
  color: 'Màu sắc',
  waterAbsorption: 'Độ hút nước',
  bendingStrength: 'Độ uốn',
  compressiveStrength: 'Độ nén',
  technique: 'Kỹ thuật',
  origin: 'Xuất xứ'
}

const defaultSpecs: ProductSpecs = {
  size: '',
  thickness: '',
  weight: '',
  material: '',
  color: '',
  waterAbsorption: '',
  bendingStrength: '',
  compressiveStrength: '',
  technique: '',
  origin: ''
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'basic' | 'specs' | 'stats' | 'reviews'>('basic')

  // Form state
  const [formData, setFormData] = useState<ProductBody>({
    name: '',
    description: '',
    category: '',
    price: 0,
    price_before_discount: 0,
    quantity: 0,
    sold: 0,
    view: 0,
    featured: false,
    image: '',
    images: [],
    specs: defaultSpecs,
    reviews: []
  })

  // Image states
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string>('')
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  // Review form state
  const [newReview, setNewReview] = useState<ProductReview>({
    avatar: '',
    name: '',
    content: '',
    rating: 5
  })
  const [reviewAvatarFile, setReviewAvatarFile] = useState<File | null>(null)
  const [reviewAvatarPreview, setReviewAvatarPreview] = useState<string>('')

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })

  const categories = categoriesData?.data.data.categories || []

  // Set form data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category._id,
        price: product.price,
        price_before_discount: product.price_before_discount,
        quantity: product.quantity,
        sold: product.sold,
        view: product.view,
        featured: product.featured || false,
        image: product.image,
        images: product.images || [],
        specs: { ...defaultSpecs, ...product.specs },
        reviews: product.reviews || []
      })
      setMainImagePreview(product.image)
      setAdditionalImagePreviews(product.images || [])
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        price: 0,
        price_before_discount: 0,
        quantity: 0,
        sold: 0,
        view: 0,
        featured: false,
        image: '',
        images: [],
        specs: defaultSpecs,
        reviews: []
      })
      setMainImagePreview('')
      setAdditionalImagePreviews([])
    }
    setMainImageFile(null)
    setAdditionalImageFiles([])
    setActiveTab('basic')
  }, [product, isOpen])

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (mainImagePreview && mainImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(mainImagePreview)
      }
      additionalImagePreviews.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }
      })
      if (reviewAvatarPreview && reviewAvatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(reviewAvatarPreview)
      }
    }
  }, [])

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('image', file)
      return adminApi.uploadProductImage(formData)
    }
  })

  // Add/Update product mutation
  const saveProductMutation = useMutation({
    mutationFn: (data: { id?: string; body: ProductBody }) => {
      if (data.id) {
        return adminApi.updateProduct(data.id, data.body)
      }
      return adminApi.addProduct(data.body)
    },
    onSuccess: () => {
      toast.success(product ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      onClose()
    },
    onError: () => {
      toast.error(product ? 'Cập nhật sản phẩm thất bại' : 'Thêm sản phẩm thất bại')
    }
  })

  // Handle main image change
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImageFile(file)
      setMainImagePreview(URL.createObjectURL(file))
    }
  }

  // Handle additional images change
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + additionalImagePreviews.length > 5) {
      toast.error('Tối đa 5 ảnh phụ')
      return
    }
    setAdditionalImageFiles((prev) => [...prev, ...files])
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setAdditionalImagePreviews((prev) => [...prev, ...newPreviews])
  }

  // Remove additional image
  const removeAdditionalImage = (index: number) => {
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index))
    // If it's a new file, remove from files array too
    if (index >= (formData.images?.length || 0)) {
      const fileIndex = index - (formData.images?.length || 0)
      setAdditionalImageFiles((prev) => prev.filter((_, i) => i !== fileIndex))
    } else {
      // Remove from existing images
      setFormData((prev) => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index) || []
      }))
    }
  }

  // Handle review avatar change
  const handleReviewAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReviewAvatarFile(file)
      setReviewAvatarPreview(URL.createObjectURL(file))
    }
  }

  // Add review
  const addReview = async () => {
    if (!newReview.name || !newReview.content) {
      toast.error('Vui lòng nhập tên và nội dung đánh giá')
      return
    }

    let avatarUrl = newReview.avatar
    if (reviewAvatarFile) {
      try {
        const result = await uploadImageMutation.mutateAsync(reviewAvatarFile)
        avatarUrl = result.data.data
      } catch {
        toast.error('Upload avatar thất bại')
        return
      }
    }

    const review: ProductReview = {
      ...newReview,
      avatar: avatarUrl
    }

    setFormData((prev) => ({
      ...prev,
      reviews: [...(prev.reviews || []), review]
    }))

    // Reset review form
    setNewReview({ avatar: '', name: '', content: '', rating: 5 })
    setReviewAvatarFile(null)
    setReviewAvatarPreview('')
    toast.success('Đã thêm đánh giá')
  }

  // Remove review
  const removeReview = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      reviews: prev.reviews?.filter((_, i) => i !== index) || []
    }))
  }

  // Handle submit with improved validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error('Tên sản phẩm phải có ít nhất 2 ký tự')
      return
    }

    if (!formData.category) {
      toast.error('Vui lòng chọn danh mục')
      return
    }

    if (formData.price < 0) {
      toast.error('Giá sản phẩm không được âm')
      return
    }

    if (formData.price_before_discount < 0) {
      toast.error('Giá trước giảm không được âm')
      return
    }

    if (formData.price_before_discount > 0 && formData.price > formData.price_before_discount) {
      toast.error('Giá bán không được lớn hơn giá trước giảm')
      return
    }

    if (formData.quantity < 0) {
      toast.error('Số lượng không được âm')
      return
    }

    if (!formData.image && !mainImageFile) {
      toast.error('Vui lòng chọn ảnh chính cho sản phẩm')
      return
    }

    try {
      setUploading(true)
      let imageUrl = formData.image

      // Upload main image if new file selected
      if (mainImageFile) {
        const uploadResult = await uploadImageMutation.mutateAsync(mainImageFile)
        imageUrl = uploadResult.data.data
      }

      // Upload additional images
      let allImages = formData.images || []
      for (const file of additionalImageFiles) {
        const uploadResult = await uploadImageMutation.mutateAsync(file)
        allImages.push(uploadResult.data.data)
      }

      setUploading(false)

      // Save product with sanitized data
      await saveProductMutation.mutateAsync({
        id: product?._id,
        body: {
          ...formData,
          name: formData.name?.trim() || '',
          description: formData.description?.trim() || '',
          image: imageUrl,
          images: allImages
        }
      })
    } catch (error) {
      setUploading(false)
      console.error(error)
      toast.error('Có lỗi xảy ra')
    }
  }

  // Update spec field
  const updateSpec = (key: keyof ProductSpecs, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [key]: value
      }
    }))
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white'>
        {/* Header */}
        <div className='sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4'>
          <h2 className='text-2xl font-bold text-earth'>{product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button onClick={onClose} className='text-2xl text-cement-dark hover:text-earth'>
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className='flex border-b bg-cream-light'>
          {(['basic', 'specs', 'stats', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab ? 'border-b-2 border-brick bg-white text-brick' : 'text-earth hover:bg-white/50'
              }`}
            >
              {tab === 'basic' && 'Thông tin cơ bản'}
              {tab === 'specs' && 'Thông số kỹ thuật'}
              {tab === 'stats' && 'Thống kê'}
              {tab === 'reviews' && 'Đánh giá'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className='p-6'>
          {/* Basic Tab */}
          {activeTab === 'basic' && (
            <div className='space-y-6'>
              {/* Images Section */}
              <div className='rounded-lg border bg-cream-light/50 p-4'>
                <h3 className='mb-4 font-semibold text-earth'>Hình ảnh sản phẩm</h3>

                {/* Main Image */}
                <div className='mb-4'>
                  <label className='mb-2 block text-sm font-medium text-earth'>
                    Ảnh chính <span className='text-red-500'>*</span>
                  </label>
                  <div className='flex items-center gap-4'>
                    {mainImagePreview && (
                      <img src={mainImagePreview} alt='Preview' className='h-32 w-32 rounded object-cover' />
                    )}
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleMainImageChange}
                      className='w-full rounded-lg border border-cement-light bg-white px-4 py-2 text-sm focus:border-brick focus:outline-none'
                    />
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <label className='mb-2 block text-sm font-medium text-earth'>Ảnh phụ (tối đa 5 ảnh)</label>
                  <div className='mb-3 flex flex-wrap gap-3'>
                    {additionalImagePreviews.map((preview, index) => (
                      <div key={index} className='group relative'>
                        <img src={preview} alt={`Additional ${index + 1}`} className='h-24 w-24 rounded object-cover' />
                        <button
                          type='button'
                          onClick={() => removeAdditionalImage(index)}
                          className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100'
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {additionalImagePreviews.length < 5 && (
                      <label className='flex h-24 w-24 cursor-pointer items-center justify-center rounded border-2 border-dashed border-cement-light bg-white text-cement-dark hover:border-brick hover:text-brick'>
                        <span className='text-3xl'>+</span>
                        <input
                          type='file'
                          accept='image/*'
                          multiple
                          onChange={handleAdditionalImagesChange}
                          className='hidden'
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className='mb-2 block text-sm font-medium text-earth'>
                  Tên sản phẩm <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full rounded-lg border border-cement-light bg-cream-light px-4 py-2 text-sm focus:border-brick focus:outline-none'
                  placeholder='Nhập tên sản phẩm'
                />
              </div>

              {/* Category & Featured */}
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-earth'>
                    Danh mục <span className='text-red-500'>*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className='w-full rounded-lg border border-cement-light bg-cream-light px-4 py-2 text-sm focus:border-brick focus:outline-none'
                  >
                    <option value=''>Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='flex items-center gap-3 pt-7'>
                  <input
                    type='checkbox'
                    id='featured'
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className='h-4 w-4 rounded border-cement-light text-brick focus:ring-brick'
                  />
                  <label htmlFor='featured' className='text-sm font-medium text-earth'>
                    Sản phẩm nổi bật
                  </label>
                </div>
              </div>

              {/* Price & Discount */}
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-earth'>Giá bán (0 = Liên hệ)</label>
                  <input
                    type='number'
                    min='0'
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className='w-full rounded-lg border border-cement-light bg-cream-light px-4 py-2 text-sm focus:border-brick focus:outline-none'
                    placeholder='0'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-earth'>Giá trước giảm</label>
                  <input
                    type='number'
                    min='0'
                    value={formData.price_before_discount}
                    onChange={(e) => setFormData({ ...formData, price_before_discount: Number(e.target.value) })}
                    className='w-full rounded-lg border border-cement-light bg-cream-light px-4 py-2 text-sm focus:border-brick focus:outline-none'
                    placeholder='0'
                  />
                </div>
              </div>

              {/* Description with Rich Text */}
              <div>
                <label className='mb-2 block text-sm font-medium text-earth'>Mô tả sản phẩm</label>
                <ReactQuill
                  theme='snow'
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  modules={quillModules}
                  className='rounded-lg bg-white'
                  style={{ minHeight: '200px' }}
                />
              </div>
            </div>
          )}

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div className='space-y-4'>
              <p className='text-sm text-cement-dark'>Nhập các thông số kỹ thuật của sản phẩm</p>
              <div className='grid gap-4 md:grid-cols-2'>
                {(Object.keys(specLabels) as Array<keyof ProductSpecs>).map((key) => (
                  <div key={key}>
                    <label className='mb-2 block text-sm font-medium text-earth'>{specLabels[key]}</label>
                    <input
                      type='text'
                      value={formData.specs?.[key] || ''}
                      onChange={(e) => updateSpec(key, e.target.value)}
                      className='w-full rounded-lg border border-cement-light bg-cream-light px-4 py-2 text-sm focus:border-brick focus:outline-none'
                      placeholder={`Nhập ${specLabels[key].toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className='space-y-4'>
              <p className='text-sm text-cement-dark'>Cấu hình các số liệu thống kê</p>
              <div className='grid gap-4 md:grid-cols-3'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-earth'>Số lượng trong kho</label>
                  <input
                    type='number'
                    min='0'
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className='w-full rounded-lg border border-cement-light bg-cream-light px-4 py-2 text-sm focus:border-brick focus:outline-none'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-earth'>Đã bán</label>
                  <input
                    type='number'
                    min='0'
                    value={formData.sold}
                    onChange={(e) => setFormData({ ...formData, sold: Number(e.target.value) })}
                    className='w-full rounded-lg border border-cement-light bg-cream-light px-4 py-2 text-sm focus:border-brick focus:outline-none'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-earth'>Lượt xem</label>
                  <input
                    type='number'
                    min='0'
                    value={formData.view}
                    onChange={(e) => setFormData({ ...formData, view: Number(e.target.value) })}
                    className='w-full rounded-lg border border-cement-light bg-cream-light px-4 py-2 text-sm focus:border-brick focus:outline-none'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className='space-y-6'>
              {/* Add New Review */}
              <div className='rounded-lg border bg-cream-light/50 p-4'>
                <h3 className='mb-4 font-semibold text-earth'>Thêm đánh giá mới</h3>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-earth'>Avatar</label>
                    <div className='flex items-center gap-3'>
                      {reviewAvatarPreview && (
                        <img src={reviewAvatarPreview} alt='Avatar' className='h-12 w-12 rounded-full object-cover' />
                      )}
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleReviewAvatarChange}
                        className='w-full rounded-lg border border-cement-light bg-white px-4 py-2 text-sm focus:border-brick focus:outline-none'
                      />
                    </div>
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-earth'>
                      Tên khách hàng <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className='w-full rounded-lg border border-cement-light bg-white px-4 py-2 text-sm focus:border-brick focus:outline-none'
                      placeholder='Nhập tên khách hàng'
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <label className='mb-2 block text-sm font-medium text-earth'>
                    Nội dung đánh giá <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    className='w-full rounded-lg border border-cement-light bg-white px-4 py-2 text-sm focus:border-brick focus:outline-none'
                    placeholder='Nhập nội dung đánh giá'
                  />
                </div>
                <div className='mt-4 flex items-center gap-4'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-earth'>Đánh giá sao</label>
                    <div className='flex gap-1'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type='button'
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className={`text-2xl ${star <= (newReview.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={addReview}
                    className='ml-auto rounded-lg bg-brick px-4 py-2 text-sm font-medium text-white hover:bg-brick-dark'
                  >
                    Thêm đánh giá
                  </button>
                </div>
              </div>

              {/* Existing Reviews */}
              <div>
                <h3 className='mb-4 font-semibold text-earth'>Danh sách đánh giá ({formData.reviews?.length || 0})</h3>
                {formData.reviews && formData.reviews.length > 0 ? (
                  <div className='space-y-3'>
                    {formData.reviews.map((review, index) => (
                      <div key={index} className='flex items-start gap-3 rounded-lg border bg-white p-4'>
                        <img
                          src={review.avatar || '/images/user.svg'}
                          alt={review.name}
                          className='h-10 w-10 rounded-full object-cover'
                        />
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium text-earth'>{review.name}</span>
                            <div className='flex text-yellow-400'>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={star <= (review.rating || 5) ? '' : 'text-gray-300'}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className='mt-1 text-sm text-cement-dark'>{review.content}</p>
                        </div>
                        <button
                          type='button'
                          onClick={() => removeReview(index)}
                          className='text-red-500 hover:text-red-700'
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-cement-dark'>Chưa có đánh giá nào</p>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className='mt-6 flex justify-end gap-3 border-t pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-lg bg-cement-light px-6 py-2 font-medium text-earth transition-colors hover:bg-cement'
              disabled={uploading || saveProductMutation.isPending}
            >
              Hủy
            </button>
            <button
              type='submit'
              className='rounded-lg bg-brick px-6 py-2 font-medium text-white transition-colors hover:bg-brick-dark disabled:opacity-50'
              disabled={uploading || saveProductMutation.isPending}
            >
              {uploading ? 'Đang upload...' : saveProductMutation.isPending ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
