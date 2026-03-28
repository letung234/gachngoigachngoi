import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import adminApi from 'src/apis/admin.api'
import { Category } from 'src/types/category.type'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'
import Button from 'src/components/Button'

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: ''
  })

  const { can } = usePermission()
  const canCreate = can(Permission.CATEGORY_CREATE)
  const canUpdate = can(Permission.CATEGORY_UPDATE)
  const canDelete = can(Permission.CATEGORY_DELETE)

  // Fetch categories
  const { data: categoriesData, isLoading, refetch } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.getCategories()
  })

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (data: any) => adminApi.addCategory(data),
    onSuccess: () => {
      refetch()
      setIsModalOpen(false)
      resetForm()
      alert('Tạo danh mục thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi tạo danh mục')
    }
  })

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: (data: any) => adminApi.updateCategory(selectedCategory!._id, data),
    onSuccess: () => {
      refetch()
      setIsModalOpen(false)
      setSelectedCategory(null)
      resetForm()
      alert('Cập nhật danh mục thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi cập nhật danh mục')
    }
  })

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      refetch()
      setShowDeleteConfirm(null)
      alert('Xóa danh mục thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi xóa danh mục. Danh mục có thể đang được sử dụng.')
    }
  })

  const handleAddCategory = () => {
    setSelectedCategory(null)
    resetForm()
    setIsModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      slug: category.slug
    })
    setIsModalOpen(true)
  }

  const handleDeleteCategory = (id: string) => {
    if (showDeleteConfirm === id) {
      deleteCategoryMutation.mutate(id)
    } else {
      setShowDeleteConfirm(id)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      slug: ''
    })
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = () => {
    if (!formData.name) {
      alert('Vui lòng nhập tên danh mục')
      return
    }

    const slug = formData.slug || generateSlug(formData.name)

    if (selectedCategory) {
      updateCategoryMutation.mutate({
        name: formData.name,
        description: formData.description,
        slug
      })
    } else {
      createCategoryMutation.mutate({
        name: formData.name,
        description: formData.description,
        slug
      })
    }
  }

  const categories = categoriesData?.data || []

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-earth'>Quản lý danh mục</h1>
          <p className='mt-2 text-gray-600'>Tổng cộng {categories.length} danh mục</p>
        </div>
        {canCreate && (
          <button
            onClick={handleAddCategory}
            className='rounded-lg bg-brick px-6 py-3 font-semibold text-white transition-all hover:bg-brick-dark hover:shadow-lg active:scale-95 flex items-center gap-2'
          >
            <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' clipRule='evenodd' />
            </svg>
            Thêm danh mục
          </button>
        )}
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
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Tên danh mục</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Slug</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Mô tả</th>
                  <th className='px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Thao tác</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category._id} className='hover:bg-gray-50 transition-colors duration-200'>
                      <td className='px-6 py-5 font-semibold text-gray-900'>{category.name}</td>
                      <td className='px-6 py-5 text-gray-700'>
                        <code className='bg-gray-100 rounded px-2 py-1'>{category.slug}</code>
                      </td>
                      <td className='px-6 py-5 text-gray-700 max-w-xs truncate'>
                        {category.description || '—'}
                      </td>
                      <td className='px-6 py-5 text-center'>
                        <div className='flex items-center justify-center gap-2'>
                          {canUpdate && (
                            <button
                              onClick={() => handleEditCategory(category)}
                              className='rounded-lg bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors'
                            >
                              ✏️ Sửa
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className='rounded-lg bg-red-50 px-4 py-2 text-xs font-bold text-red-700 border border-red-200 hover:bg-red-100 transition-colors'
                            >
                              {showDeleteConfirm === category._id ? '✓ Xác nhận' : '🗑️ Xóa'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className='px-6 py-12 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <span className='text-3xl'>🏷️</span>
                        <span className='text-gray-500 font-medium'>Không tìm thấy danh mục nào</span>
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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6'>
            <div>
              <h2 className='text-2xl font-bold text-earth'>
                {selectedCategory ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
              </h2>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Tên danh mục *</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                  placeholder='Tên danh mục'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Slug</label>
                <input
                  type='text'
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                  placeholder='Slug (tự động nếu để trống)'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                  placeholder='Mô tả danh mục'
                  rows={4}
                />
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedCategory(null)
                  resetForm()
                }}
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50'
              >
                Hủy
              </button>
              <Button
                onClick={handleSubmit}
                className='flex-1 bg-brick text-white hover:bg-brick-dark rounded-lg font-semibold py-2 transition-colors'
                isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              >
                {selectedCategory ? 'Cập nhật' : 'Tạo'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
