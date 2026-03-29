import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import adminApi from 'src/apis/admin.api'
import { PostStatus } from 'src/types/post.type'
import { Category } from 'src/types/category.type'
import Button from 'src/components/Button'
import { toast } from 'react-toastify'
import path from 'src/constants/path'

// Rich text editor configuration
const blogQuillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    [{ color: [] }, { background: [] }],
    ['code-block'],
    ['clean']
  ]
}

export default function PostForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnail: '',
    category: '',
    status: 'draft' as PostStatus
  })

  // Image upload states
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  // Fetch post detail if editing
  const { data: postData, isPending: isLoadingPost } = useQuery({
    queryKey: ['admin-post', id],
    queryFn: () => adminApi.getPost(id!),
    enabled: isEditMode
  })

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.getCategories()
  })

  // Set form data when editing
  useEffect(() => {
    if (postData?.data.data) {
      const post = postData.data.data
      setFormData({
        title: post.title,
        content: post.content,
        thumbnail: post.thumbnail || '',
        category: post.category._id,
        status: post.status
      })
      setThumbnailPreview(post.thumbnail || '')
    }
  }, [postData])

  // Upload thumbnail mutation
  const uploadThumbnailMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('image', file)
      return adminApi.uploadPostThumbnail(formData)
    }
  })

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (data: any) => adminApi.addPost(data),
    onSuccess: () => {
      toast.success('Tạo bài viết thành công')
      navigate(path.adminPosts)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Lỗi tạo bài viết')
    }
  })

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: (data: any) => adminApi.updatePost(id!, data),
    onSuccess: () => {
      toast.success('Cập nhật bài viết thành công')
      navigate(path.adminPosts)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Lỗi cập nhật bài viết')
    }
  })

  // Handle thumbnail image change
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Enhanced form validation
    if (!formData.title || formData.title.trim().length < 3) {
      toast.error('Tiêu đề phải có ít nhất 3 ký tự')
      return
    }

    if (!formData.content || formData.content.trim().length < 10) {
      toast.error('Nội dung phải có ít nhất 10 ký tự')
      return
    }

    if (!formData.category) {
      toast.error('Vui lòng chọn danh mục')
      return
    }

    try {
      setUploading(true)
      let thumbnailUrl = formData.thumbnail

      // Upload thumbnail if new file selected
      if (thumbnailFile) {
        const uploadResult = await uploadThumbnailMutation.mutateAsync(thumbnailFile)
        thumbnailUrl = uploadResult.data.data
      }

      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        thumbnail: thumbnailUrl || undefined,
        category: formData.category,
        status: formData.status
      }

      setUploading(false)

      if (isEditMode) {
        updatePostMutation.mutate(postData)
      } else {
        createPostMutation.mutate(postData)
      }
    } catch {
      setUploading(false)
      toast.error('Có lỗi xảy ra khi tải ảnh')
    }
  }

  const categories: Category[] = categoriesData?.data.data.categories || []

  if (isEditMode && isLoadingPost) {
    return (
      <div className='flex items-center justify-center py-16'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brick mb-4'></div>
          <div className='text-gray-600 font-medium'>Đang tải dữ liệu...</div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-earth'>
            {isEditMode ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
          </h1>
          <p className='mt-2 text-gray-600'>
            {isEditMode ? 'Cập nhật thông tin bài viết' : 'Tạo bài viết mới cho trang web'}
          </p>
        </div>
        <button
          onClick={() => navigate(path.adminPosts)}
          className='rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all'
        >
          ← Quay lại
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className='rounded-xl bg-white p-8 shadow-sm border border-gray-100'>
        <div className='space-y-6'>
          {/* Title */}
          <div>
            <label className='block text-sm font-semibold text-earth mb-2'>
              Tiêu đề <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brick focus:outline-none focus:ring-2 focus:ring-brick/20'
              placeholder='Nhập tiêu đề bài viết'
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className='block text-sm font-semibold text-earth mb-2'>
              Danh mục <span className='text-red-500'>*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brick focus:outline-none focus:ring-2 focus:ring-brick/20'
              required
            >
              <option value=''>Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Thumbnail */}
          <div>
            <label className='block text-sm font-semibold text-earth mb-2'>Ảnh đại diện</label>
            <div className='space-y-4'>
              {thumbnailPreview && (
                <div className='relative inline-block'>
                  <img src={thumbnailPreview} alt='Preview' className='h-48 w-auto rounded-lg object-cover border border-gray-200' />
                  <button
                    type='button'
                    onClick={() => {
                      setThumbnailPreview('')
                      setThumbnailFile(null)
                      setFormData({ ...formData, thumbnail: '' })
                    }}
                    className='absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600 transition-colors'
                  >
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
              )}
              <input
                type='file'
                accept='image/*'
                onChange={handleThumbnailChange}
                className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-brick focus:outline-none focus:ring-2 focus:ring-brick/20'
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className='block text-sm font-semibold text-earth mb-2'>
              Nội dung <span className='text-red-500'>*</span>
            </label>
            <ReactQuill
              theme='snow'
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              modules={blogQuillModules}
              className='rounded-lg bg-white'
              style={{ minHeight: '300px' }}
              placeholder='Viết nội dung bài viết...'
            />
          </div>

          {/* Status */}
          <div>
            <label className='block text-sm font-semibold text-earth mb-2'>Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PostStatus })}
              className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brick focus:outline-none focus:ring-2 focus:ring-brick/20'
            >
              <option value='draft'>Nháp</option>
              <option value='published'>Xuất bản</option>
              <option value='archived'>Lưu trữ</option>
            </select>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className='flex gap-3 mt-8 pt-6 border-t border-gray-200'>
          <button
            type='button'
            onClick={() => navigate(path.adminPosts)}
            className='flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors'
          >
            Hủy
          </button>
          <Button
            type='submit'
            className='flex-1 bg-brick text-white hover:bg-brick-dark rounded-lg font-semibold py-3 transition-colors'
            isLoading={createPostMutation.isPending || updatePostMutation.isPending || uploading}
            disabled={createPostMutation.isPending || updatePostMutation.isPending || uploading}
          >
            {uploading ? 'Đang tải ảnh...' : isEditMode ? 'Cập nhật bài viết' : 'Xuất bản bài viết'}
          </Button>
        </div>
      </form>
    </div>
  )
}
