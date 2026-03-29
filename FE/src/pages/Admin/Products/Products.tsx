import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import adminApi from 'src/apis/admin.api'
import { toast } from 'react-toastify'
import ProductModal from '../components/ProductModal'
import { Product } from 'src/types/product.type'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'
import { AdminPagination } from 'src/components/Pagination'

export default function AdminProducts() {
  const queryClient = useQueryClient()
  const { can } = usePermission()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const limit = 20
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Check permissions
  const canCreate = can(Permission.PRODUCT_CREATE)
  const canUpdate = can(Permission.PRODUCT_UPDATE)
  const canDelete = can(Permission.PRODUCT_DELETE)

  // Fetch categories for filter
  const { data: categoriesData, error: categoriesError } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.getCategories()
  })

  // Fetch products with server-side filtering
  const { data: productsData, isPending, error } = useQuery({
    queryKey: ['admin-products', page, searchTerm, filterCategory, priceMin, priceMax, sortBy, order],
    queryFn: () =>
      adminApi.getProducts({
        page,
        limit,
        name: searchTerm || undefined,
        category: filterCategory || undefined,
        price_min: priceMin ? Number(priceMin) : undefined,
        price_max: priceMax ? Number(priceMax) : undefined,
        sort_by: sortBy,
        order: order
      })
  })

  // Show error toasts if queries fail
  if (error) {
    toast.error('Lỗi tải dữ liệu sản phẩm')
  }
  if (categoriesError) {
    toast.error('Lỗi tải dữ liệu danh mục')
  }

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => adminApi.deleteProduct(productId),
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
    onError: () => {
      toast.error('Xóa sản phẩm thất bại')
    }
  })

  const products = productsData?.data.data.products || []
  const pagination = productsData?.data.data.pagination
  const categories = categoriesData?.data.data.categories || []

  const handleResetFilters = () => {
    setSearchTerm('')
    setFilterCategory('')
    setPriceMin('')
    setPriceMax('')
    setSortBy('createdAt')
    setOrder('desc')
    setPage(1)
  }

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}"?`)) {
      deleteProductMutation.mutate(productId)
    }
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-earth'>Quản lý sản phẩm</h1>
          <div className='mt-2 flex items-center gap-4'>
            <p className='text-gray-600'>
              Tổng cộng <span className='font-bold text-brick'>{pagination?.total || products.length}</span> sản phẩm
            </p>
          </div>
        </div>
        {canCreate && (
          <button
            onClick={handleAddProduct}
            className='rounded-lg bg-brick px-6 py-3 font-semibold text-white transition-all hover:bg-brick-dark hover:shadow-lg active:scale-95 flex items-center gap-2'
          >
            <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z' clipRule='evenodd' />
            </svg>
            Thêm sản phẩm
          </button>
        )}
      </div>

      {/* Filters */}
      <div className='rounded-xl bg-white p-6 shadow-sm border border-gray-100'>
        <div className='flex items-center gap-3 mb-4'>
          <span className='text-lg'>🔍</span>
          <h3 className='font-semibold text-earth'>Bộ lọc</h3>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {/* Search */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>Tìm kiếm sản phẩm</label>
            <input
              type='text'
              placeholder='Nhập tên sản phẩm...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-brick focus:ring-2 focus:ring-brick/10 focus:outline-none'
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>Danh mục</label>
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value)
                setPage(1)
              }}
              className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-brick focus:ring-2 focus:ring-brick/10 focus:outline-none'
            >
              <option value=''>Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>Sắp xếp</label>
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [newSortBy, newOrder] = e.target.value.split('-')
                setSortBy(newSortBy)
                setOrder(newOrder)
                setPage(1)
              }}
              className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-brick focus:ring-2 focus:ring-brick/10 focus:outline-none'
            >
              <option value='createdAt-desc'>Mới nhất</option>
              <option value='createdAt-asc'>Cũ nhất</option>
              <option value='name-asc'>Tên A-Z</option>
              <option value='name-desc'>Tên Z-A</option>
              <option value='price-asc'>Giá thấp đến cao</option>
              <option value='price-desc'>Giá cao đến thấp</option>
              <option value='sold-desc'>Bán chạy nhất</option>
              <option value='view-desc'>Xem nhiều nhất</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>Giá từ (₫)</label>
            <input
              type='number'
              placeholder='Giá thấp nhất'
              value={priceMin}
              onChange={(e) => {
                setPriceMin(e.target.value)
                setPage(1)
              }}
              className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-brick focus:ring-2 focus:ring-brick/10 focus:outline-none'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>Giá đến (₫)</label>
            <input
              type='number'
              placeholder='Giá cao nhất'
              value={priceMax}
              onChange={(e) => {
                setPriceMax(e.target.value)
                setPage(1)
              }}
              className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-brick focus:ring-2 focus:ring-brick/10 focus:outline-none'
            />
          </div>

          {/* Reset Button */}
          <div className='flex items-end'>
            <button
              onClick={handleResetFilters}
              className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:border-brick focus:ring-2 focus:ring-brick/10 focus:outline-none'
            >
              🗑️ Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className='overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100'>
        <div className='overflow-x-auto'>
          {isPending ? (
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
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Sản phẩm</th>
                  <th className='hidden px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider md:table-cell'>
                    Danh mục
                  </th>
                  <th className='px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider'>Giá</th>
                  <th className='hidden px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider md:table-cell'>
                    Kho
                  </th>
                  <th className='hidden px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider md:table-cell'>
                    Đã bán
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Thao tác</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className='hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0'>
                      <td className='px-6 py-5'>
                        <div className='flex items-center gap-4'>
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className='h-14 w-14 rounded-lg object-cover shadow-sm border border-gray-200'
                            />
                          )}
                          <div>
                            <p className='font-semibold text-gray-900'>{product.name}</p>
                            <p className='text-xs text-gray-500 md:hidden'>{product.category.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className='hidden px-6 py-5 text-gray-700 md:table-cell font-medium'>
                        {product.category.name}
                      </td>
                      <td className='px-6 py-5 text-right font-bold text-brick'>
                        ₫{product.price.toLocaleString()}
                      </td>
                      <td className='hidden px-6 py-5 text-center md:table-cell'>
                        <span
                          className={`inline-flex rounded-full px-4 py-2 text-xs font-bold border ${
                            product.quantity > 100
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : product.quantity > 0
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </td>
                      <td className='hidden px-6 py-5 text-center text-gray-900 font-semibold md:table-cell'>
                        {product.sold}
                      </td>
                      <td className='px-6 py-5 text-center'>
                        <div className='flex items-center justify-center gap-2'>
                          {canUpdate && (
                            <button
                              onClick={() => handleEditProduct(product)}
                              className='rounded-lg bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors'
                              title='Chỉnh sửa'
                            >
                              ✏️ Sửa
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteProduct(product._id, product.name)}
                              className='rounded-lg bg-red-50 px-4 py-2 text-xs font-bold text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50'
                              disabled={deleteProductMutation.isPending}
                              title='Xóa'
                            >
                              🗑️ Xóa
                            </button>
                          )}
                          {!canUpdate && !canDelete && (
                            <span className='text-xs text-gray-500 font-medium'>📖 Chỉ xem</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className='px-6 py-12 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <span className='text-3xl'>🔍</span>
                        <span className='text-gray-500 font-medium'>Không tìm thấy sản phẩm nào</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.total !== undefined && (
        <AdminPagination
          pagination={pagination}
          onPageChange={setPage}
          showInfo={true}
        />
      )}

      {/* Product Modal */}
      <ProductModal isOpen={isModalOpen} onClose={handleCloseModal} product={selectedProduct} />
    </div>
  )
}
