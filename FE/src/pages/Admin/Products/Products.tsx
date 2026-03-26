import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import adminApi from 'src/apis/admin.api'
import { toast } from 'react-toastify'
import ProductModal from '../components/ProductModal'
import { Product } from 'src/types/product.type'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'

export default function AdminProducts() {
  const queryClient = useQueryClient()
  const { can } = usePermission()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Check permissions
  const canCreate = can(Permission.PRODUCT_CREATE)
  const canUpdate = can(Permission.PRODUCT_UPDATE)
  const canDelete = can(Permission.PRODUCT_DELETE)

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () =>
      adminApi.getProducts({
        page,
        limit
      })
  })

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

  const filteredProducts = products.filter((product) => {
    const matchSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchSearch
  })

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

  // Generate page numbers to display
  const getPageNumbers = () => {
    if (!pagination) return []
    const totalPages = pagination.page_size
    const pages: (number | string)[] = []
    const maxButtonsToShow = 5

    if (totalPages <= maxButtonsToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate range around current page
      let start = Math.max(2, page - 1)
      let end = Math.min(totalPages - 1, page + 1)

      if (page <= 3) {
        end = 4
      } else if (page >= totalPages - 2) {
        start = totalPages - 3
      }

      // Add ellipsis before range if needed
      if (start > 2) {
        pages.push('...')
      }

      // Add page range
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis after range if needed
      if (end < totalPages - 1) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-earth'>Quản lý sản phẩm</h1>
          <p className='mt-2 text-cement-dark'>Tổng cộng {products.length} sản phẩm</p>
        </div>
        {canCreate && (
          <button
            onClick={handleAddProduct}
            className='rounded-lg bg-brick px-4 py-2 font-semibold text-white transition-colors hover:bg-brick-dark'
          >
            + Thêm sản phẩm
          </button>
        )}
      </div>

      {/* Filters */}
      <div className='space-y-4 rounded-lg bg-white p-4 md:p-6'>
        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <label className='mb-2 block text-sm font-medium text-earth'>Tìm kiếm</label>
            <input
              type='text'
              placeholder='Tên sản phẩm hoặc danh mục...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full rounded-lg border border-cement-light bg-cream-light px-4 py-2 text-sm focus:border-brick focus:outline-none'
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className='overflow-hidden rounded-lg bg-white shadow-sm'>
        <div className='overflow-x-auto'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-cement-dark'>Đang tải...</div>
            </div>
          ) : (
            <table className='w-full'>
              <thead className='bg-cream-light'>
                <tr>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-earth md:px-6'>Sản phẩm</th>
                  <th className='hidden px-4 py-3 text-left text-sm font-semibold text-earth md:table-cell md:px-6'>
                    Danh mục
                  </th>
                  <th className='px-4 py-3 text-right text-sm font-semibold text-earth md:px-6'>Giá</th>
                  <th className='hidden px-4 py-3 text-center text-sm font-semibold text-earth md:table-cell md:px-6'>
                    Kho
                  </th>
                  <th className='hidden px-4 py-3 text-center text-sm font-semibold text-earth md:table-cell md:px-6'>
                    Đã bán
                  </th>
                  <th className='px-4 py-3 text-center text-sm font-semibold text-earth md:px-6'>Thao tác</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-cement-light'>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className='hover:bg-cream-light/50'>
                      <td className='px-4 py-4 md:px-6'>
                        <div className='flex items-center gap-3'>
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className='h-12 w-12 rounded object-cover'
                            />
                          )}
                          <div>
                            <p className='font-medium text-earth'>{product.name}</p>
                            <p className='text-xs text-cement-dark md:hidden'>{product.category.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className='hidden px-4 py-4 text-earth md:table-cell md:px-6'>
                        {product.category.name}
                      </td>
                      <td className='px-4 py-4 text-right font-semibold text-brick md:px-6'>
                        ₫{product.price.toLocaleString()}
                      </td>
                      <td className='hidden px-4 py-4 text-center text-earth md:table-cell md:px-6'>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.quantity > 100
                              ? 'bg-green-100 text-green-800'
                              : product.quantity > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </td>
                      <td className='hidden px-4 py-4 text-center text-earth md:table-cell md:px-6'>
                        {product.sold}
                      </td>
                      <td className='px-4 py-4 text-center md:px-6'>
                        <div className='flex items-center justify-center gap-2'>
                          {canUpdate && (
                            <button
                              onClick={() => handleEditProduct(product)}
                              className='rounded bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-200'
                            >
                              Sửa
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteProduct(product._id, product.name)}
                              className='rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 hover:bg-red-200'
                              disabled={deleteProductMutation.isLoading}
                            >
                              Xóa
                            </button>
                          )}
                          {!canUpdate && !canDelete && (
                            <span className='text-xs text-cement-dark'>Chỉ xem</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className='px-4 py-8 text-center text-sm text-cement-dark'>
                      Không tìm thấy sản phẩm
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.page_size > 1 && (
        <div className='flex items-center justify-center gap-2'>
          {/* Previous Button */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className='rounded-lg bg-white px-3 py-2 text-sm font-medium text-earth transition-colors hover:bg-cream-light disabled:opacity-50 disabled:cursor-not-allowed'
          >
            ← Trước
          </button>

          {/* Page Numbers */}
          <div className='flex gap-1'>
            {getPageNumbers().map((pageNum, index) => (
              <button
                key={index}
                onClick={() => typeof pageNum === 'number' && setPage(pageNum)}
                disabled={pageNum === '...' || pageNum === page}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pageNum === page
                    ? 'bg-brick text-white'
                    : pageNum === '...'
                      ? 'cursor-default bg-transparent text-earth/60'
                      : 'bg-white text-earth hover:bg-cream-light'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.page_size}
            className='rounded-lg bg-white px-3 py-2 text-sm font-medium text-earth transition-colors hover:bg-cream-light disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Sau →
          </button>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal isOpen={isModalOpen} onClose={handleCloseModal} product={selectedProduct} />
    </div>
  )
}
