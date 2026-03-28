import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import adminApi from 'src/apis/admin.api'
import { Post, PostStatus } from 'src/types/post.type'
import { Category } from 'src/types/category.type'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'
import Button from 'src/components/Button'

export default function Posts() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnail: '',
    category: '',
    status: 'draft' as PostStatus
  })

  const { can } = usePermission()
  const canCreate = can(Permission.POST_CREATE)
  const canUpdate = can(Permission.POST_UPDATE)
  const canDelete = can(Permission.POST_DELETE)

  // Fetch posts
  const { data: postsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-posts', page, searchTerm, filterStatus],
    queryFn: () =>
      adminApi.getPosts({
        page,
        limit: 10,
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      })
  })

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.getCategories()
  })

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (data: any) => adminApi.addPost(data),
    onSuccess: () => {
      refetch()
      setIsModalOpen(false)
      resetForm()
      alert('Tạo bài viết thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi tạo bài viết')
    }
  })

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: (data: any) => adminApi.updatePost(selectedPost!._id, data),
    onSuccess: () => {
      refetch()
      setIsModalOpen(false)
      setSelectedPost(null)
      resetForm()
      alert('Cập nhật bài viết thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi cập nhật bài viết')
    }
  })

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: (id: string) => adminApi.deletePost(id),
    onSuccess: () => {
      refetch()
      setShowDeleteConfirm(null)
      alert('Xóa bài viết thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi xóa bài viết')
    }
  })

  const handleAddPost = () => {
    setSelectedPost(null)
    resetForm()
    setIsModalOpen(true)
  }

  const handleEditPost = (post: Post) => {
    setSelectedPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      thumbnail: post.thumbnail || '',
      category: post.category._id,
      status: post.status
    })
    setIsModalOpen(true)
  }

  const handleDeletePost = (id: string) => {
    if (showDeleteConfirm === id) {
      deletePostMutation.mutate(id)
    } else {
      setShowDeleteConfirm(id)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      thumbnail: '',
      category: '',
      status: 'draft'
    })
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.content || !formData.category) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    const postData = {
      title: formData.title,
      content: formData.content,
      thumbnail: formData.thumbnail,
      category: formData.category,
      status: formData.status
    }

    if (selectedPost) {
      updatePostMutation.mutate(postData)
    } else {
      createPostMutation.mutate(postData)
    }
  }

  const posts = postsData?.data.posts || []
  const categories = categoriesData?.data || []

  const statusColors: Record<PostStatus, string> = {
    draft: 'bg-gray-50 text-gray-700 border-gray-200',
    published: 'bg-green-50 text-green-700 border-green-200',
    archived: 'bg-slate-50 text-slate-700 border-slate-200'
  }

  const statusLabels: Record<PostStatus, string> = {
    draft: 'Nháp',
    published: 'Xuất bản',
    archived: 'Lưu trữ'
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-earth'>Quản lý bài viết</h1>
          <p className='mt-2 text-gray-600'>Tổng cộng {posts.length} bài viết</p>
        </div>
        {canCreate && (
          <button
            onClick={handleAddPost}
            className='rounded-lg bg-brick px-6 py-3 font-semibold text-white transition-all hover:bg-brick-dark hover:shadow-lg active:scale-95 flex items-center gap-2'
          >
            <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' clipRule='evenodd' />
            </svg>
            Viết bài mới
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className='rounded-xl bg-white p-6 shadow-sm border border-gray-100 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Tìm kiếm</label>
            <input
              type='text'
              placeholder='Nhập tiêu đề bài viết...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Trạng thái</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as any)
                setPage(1)
              }}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
            >
              <option value='all'>Tất cả</option>
              <option value='draft'>Nháp</option>
              <option value='published'>Xuất bản</option>
              <option value='archived'>Lưu trữ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100'>
        <div className='overflow-x-auto'>
          {isLoading ? (
            <div className='flex items-center justify-center py-16'>
              <div className='text-center'>
                <div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brick mb-4'></div>
                <div className='text-gray-600 font-medium'>Đang tải dữ liệu...</div>
              </div>
            </div>
          ) : (
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    Tiêu đề
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    Danh mục
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    Lượt xem
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    Trạng thái
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post._id} className='hover:bg-gray-50 transition-colors duration-200'>
                      <td className='px-6 py-5'>
                        <div className='flex items-start gap-4'>
                          {post.thumbnail && (
                            <img
                              src={post.thumbnail}
                              alt={post.title}
                              className='h-12 w-12 rounded-lg object-cover flex-shrink-0'
                            />
                          )}
                          <div className='flex-1'>
                            <p className='font-semibold text-gray-900'>{post.title}</p>
                            <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                              {post.content.substring(0, 100)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-5 text-gray-700'>{post.category.name}</td>
                      <td className='px-6 py-5 text-gray-700 font-medium'>{post.views || 0}</td>
                      <td className='px-6 py-5'>
                        <span
                          className={`inline-flex rounded-full px-4 py-2 text-xs font-bold border ${
                            statusColors[post.status]
                          }`}
                        >
                          {statusLabels[post.status]}
                        </span>
                      </td>
                      <td className='px-6 py-5 text-center'>
                        <div className='flex items-center justify-center gap-2'>
                          {canUpdate && (
                            <button
                              onClick={() => handleEditPost(post)}
                              className='rounded-lg bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors'
                            >
                              ✏️ Sửa
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className='rounded-lg bg-red-50 px-4 py-2 text-xs font-bold text-red-700 border border-red-200 hover:bg-red-100 transition-colors'
                            >
                              {showDeleteConfirm === post._id ? '✓ Xác nhận' : '🗑️ Xóa'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className='px-6 py-12 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <span className='text-3xl'>📝</span>
                        <span className='text-gray-500 font-medium'>Chưa có bài viết nào</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 space-y-6 my-8'>
            <div>
              <h2 className='text-2xl font-bold text-earth'>
                {selectedPost ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
              </h2>
            </div>

            <div className='space-y-6'>
              {/* Title */}
              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Tiêu đề *</label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                  placeholder='Nhập tiêu đề bài viết'
                />
              </div>

              {/* Category */}
              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Danh mục *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
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
                <input
                  type='url'
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                  placeholder='URL ảnh'
                />
                {formData.thumbnail && (
                  <img
                    src={formData.thumbnail}
                    alt='Thumbnail'
                    className='mt-3 h-32 w-full rounded-lg object-cover'
                  />
                )}
              </div>

              {/* Content */}
              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Nội dung *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-mono'
                  placeholder='Viết nội dung bài viết...'
                  rows={8}
                />
              </div>

              {/* Status */}
              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PostStatus })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                >
                  <option value='draft'>Nháp</option>
                  <option value='published'>Xuất bản</option>
                  <option value='archived'>Lưu trữ</option>
                </select>
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedPost(null)
                  resetForm()
                }}
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50'
              >
                Hủy
              </button>
              <Button
                onClick={handleSubmit}
                className='flex-1 bg-brick text-white hover:bg-brick-dark rounded-lg font-semibold py-2 transition-colors'
                isLoading={createPostMutation.isPending || updatePostMutation.isPending}
                disabled={createPostMutation.isPending || updatePostMutation.isPending}
              >
                {selectedPost ? 'Cập nhật' : 'Xuất bản'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
