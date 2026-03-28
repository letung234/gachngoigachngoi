import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import adminApi from 'src/apis/admin.api'
import { Order, OrderItem, OrderStatus } from 'src/types/order.type'
import { Product } from 'src/types/product.type'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'
import Button from 'src/components/Button'

export default function Orders() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    phone: '',
    address: '',
    items: [] as OrderItem[],
    status: 'pending' as OrderStatus,
    notes: ''
  })

  const [selectedProducts, setSelectedProducts] = useState<
    Array<{ productId: string; quantity: number; price: number }>
  >([])

  const { can } = usePermission()
  const canCreate = can(Permission.ORDER_CREATE)
  const canUpdate = can(Permission.ORDER_UPDATE)
  const canDelete = can(Permission.ORDER_DELETE)

  // Fetch orders
  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders', page, searchTerm, filterStatus],
    queryFn: () =>
      adminApi.getOrders({
        page,
        limit: 10,
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      })
  })

  // Fetch products for selection
  const { data: productsData } = useQuery({
    queryKey: ['admin-all-products'],
    queryFn: () => adminApi.getAllProducts()
  })

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (data: any) => adminApi.createOrder(data),
    onSuccess: () => {
      refetch()
      setIsModalOpen(false)
      resetForm()
      alert('Tạo đơn hàng thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi tạo đơn hàng')
    }
  })

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: (data: any) => adminApi.updateOrder(selectedOrder!._id, data),
    onSuccess: () => {
      refetch()
      setIsModalOpen(false)
      setSelectedOrder(null)
      resetForm()
      alert('Cập nhật đơn hàng thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi cập nhật đơn hàng')
    }
  })

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteOrder(id),
    onSuccess: () => {
      refetch()
      setShowDeleteConfirm(null)
      alert('Xóa đơn hàng thành công')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Lỗi xóa đơn hàng')
    }
  })

  const handleAddOrder = () => {
    setSelectedOrder(null)
    resetForm()
    setIsModalOpen(true)
  }

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order)
    setFormData({
      customerName: order.customerName,
      customerEmail: order.customerEmail || '',
      phone: order.phone,
      address: order.address || '',
      items: order.items,
      status: order.status,
      notes: order.notes || ''
    })
    setIsModalOpen(true)
  }

  const handleDeleteOrder = (id: string) => {
    if (showDeleteConfirm === id) {
      deleteOrderMutation.mutate(id)
    } else {
      setShowDeleteConfirm(id)
    }
  }

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      phone: '',
      address: '',
      items: [],
      status: 'pending',
      notes: ''
    })
    setSelectedProducts([])
  }

  const addProductToOrder = (product: Product) => {
    const existingIndex = selectedProducts.findIndex((p) => p.productId === product._id)
    if (existingIndex >= 0) {
      const updated = [...selectedProducts]
      updated[existingIndex].quantity += 1
      setSelectedProducts(updated)
    } else {
      setSelectedProducts([
        ...selectedProducts,
        { productId: product._id, quantity: 1, price: product.price }
      ])
    }
  }

  const removeProductFromOrder = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.productId !== productId))
  }

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProductFromOrder(productId)
      return
    }
    setSelectedProducts(
      selectedProducts.map((p) => (p.productId === productId ? { ...p, quantity } : p))
    )
  }

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleSubmit = () => {
    if (!formData.customerName || !formData.phone) {
      alert('Vui lòng nhập tên khách hàng và số điện thoại')
      return
    }

    if (!selectedOrder && selectedProducts.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm')
      return
    }

    const orderItems: OrderItem[] = selectedProducts.map((item) => {
      const product = productsData?.data.find((p) => p._id === item.productId)
      return {
        productId: item.productId,
        productName: product?.name || '',
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity,
        image: product?.image
      }
    })

    const orderData = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      phone: formData.phone,
      address: formData.address,
      items: orderItems,
      subtotal: calculateTotal(),
      total: calculateTotal(),
      status: formData.status,
      notes: formData.notes
    }

    if (selectedOrder) {
      updateOrderMutation.mutate(orderData)
    } else {
      createOrderMutation.mutate(orderData)
    }
  }

  const orders = ordersData?.data.orders || []
  const products = productsData?.data || []

  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-purple-50 text-purple-700 border-purple-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200'
  }

  const statusLabels: Record<OrderStatus, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    cancelled: 'Hủy'
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-earth'>Quản lý đơn hàng</h1>
          <p className='mt-2 text-gray-600'>Tổng cộng {orders.length} đơn hàng</p>
        </div>
        {canCreate && (
          <button
            onClick={handleAddOrder}
            className='rounded-lg bg-brick px-6 py-3 font-semibold text-white transition-all hover:bg-brick-dark hover:shadow-lg active:scale-95 flex items-center gap-2'
          >
            <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' clipRule='evenodd' />
            </svg>
            Tạo đơn hàng
          </button>
        )}
      </div>

      {/* Filters */}
      <div className='rounded-xl bg-white p-6 shadow-sm border border-gray-100 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Tìm kiếm</label>
            <input
              type='text'
              placeholder='Tên khách hàng, số điện thoại...'
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
              <option value='pending'>Chờ xác nhận</option>
              <option value='confirmed'>Đã xác nhận</option>
              <option value='processing'>Đang xử lý</option>
              <option value='completed'>Hoàn thành</option>
              <option value='cancelled'>Hủy</option>
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
                    Mã đơn
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    Khách hàng
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    Số điện thoại
                  </th>
                  <th className='px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider'>
                    Tổng tiền
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
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className='hover:bg-gray-50 transition-colors duration-200'>
                      <td className='px-6 py-5 font-semibold text-gray-900'>
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className='px-6 py-5 text-gray-700'>{order.customerName}</td>
                      <td className='px-6 py-5 text-gray-700'>{order.phone}</td>
                      <td className='px-6 py-5 text-right font-bold text-brick'>
                        ₫{order.total.toLocaleString()}
                      </td>
                      <td className='px-6 py-5'>
                        <span
                          className={`inline-flex rounded-full px-4 py-2 text-xs font-bold border ${
                            statusColors[order.status]
                          }`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className='px-6 py-5 text-center'>
                        <div className='flex items-center justify-center gap-2'>
                          {canUpdate && (
                            <button
                              onClick={() => handleEditOrder(order)}
                              className='rounded-lg bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors'
                            >
                              ✏️ Sửa
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className='rounded-lg bg-red-50 px-4 py-2 text-xs font-bold text-red-700 border border-red-200 hover:bg-red-100 transition-colors'
                            >
                              {showDeleteConfirm === order._id ? '✓ Xác nhận' : '🗑️ Xóa'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className='px-6 py-12 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <span className='text-3xl'>📦</span>
                        <span className='text-gray-500 font-medium'>Không tìm thấy đơn hàng nào</span>
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
                {selectedOrder ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng mới'}
              </h2>
            </div>

            <div className='space-y-6'>
              {/* Customer info */}
              <div className='space-y-4'>
                <h3 className='font-semibold text-gray-900'>Thông tin khách hàng</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold text-earth mb-2'>
                      Tên khách hàng *
                    </label>
                    <input
                      type='text'
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-earth mb-2'>Số điện thoại *</label>
                    <input
                      type='tel'
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-earth mb-2'>Email</label>
                    <input
                      type='email'
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-earth mb-2'>Địa chỉ</label>
                    <input
                      type='text'
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                    />
                  </div>
                </div>
              </div>

              {/* Products selection */}
              {!selectedOrder && (
                <div className='space-y-4'>
                  <h3 className='font-semibold text-gray-900'>Chọn sản phẩm</h3>
                  <div className='grid grid-cols-2 gap-2 max-h-48 overflow-y-auto'>
                    {products.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => addProductToOrder(product)}
                        className='text-left p-3 rounded-lg border border-gray-300 hover:border-brick hover:bg-brick/5 transition-all'
                      >
                        <p className='font-semibold text-sm text-gray-900 truncate'>
                          {product.name}
                        </p>
                        <p className='text-sm text-brick font-bold'>
                          ₫{product.price.toLocaleString()}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected products */}
              {selectedProducts.length > 0 && (
                <div className='space-y-4'>
                  <h3 className='font-semibold text-gray-900'>Sản phẩm đã chọn</h3>
                  <div className='space-y-2 max-h-48 overflow-y-auto'>
                    {selectedProducts.map((item) => {
                      const product = products.find((p) => p._id === item.productId)
                      return (
                        <div
                          key={item.productId}
                          className='flex items-center justify-between bg-gray-50 p-3 rounded-lg'
                        >
                          <div className='flex-1'>
                            <p className='font-medium text-gray-900'>{product?.name}</p>
                            <p className='text-sm text-gray-600'>
                              ₫{item.price.toLocaleString()} × {item.quantity}
                            </p>
                          </div>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => updateProductQuantity(item.productId, item.quantity - 1)}
                              className='px-2 py-1 bg-gray-200 rounded hover:bg-gray-300'
                            >
                              −
                            </button>
                            <input
                              type='number'
                              min='1'
                              value={item.quantity}
                              onChange={(e) =>
                                updateProductQuantity(item.productId, parseInt(e.target.value) || 1)
                              }
                              className='w-12 text-center border border-gray-300 rounded py-1'
                            />
                            <button
                              onClick={() => updateProductQuantity(item.productId, item.quantity + 1)}
                              className='px-2 py-1 bg-gray-200 rounded hover:bg-gray-300'
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeProductFromOrder(item.productId)}
                              className='ml-2 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200'
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className='bg-brick/10 border border-brick/20 rounded-lg p-4'>
                    <p className='text-sm text-gray-600 mb-2'>Tổng tiền: </p>
                    <p className='text-2xl font-bold text-brick'>
                      ₫{calculateTotal().toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                >
                  <option value='pending'>Chờ xác nhận</option>
                  <option value='confirmed'>Đã xác nhận</option>
                  <option value='processing'>Đang xử lý</option>
                  <option value='completed'>Hoàn thành</option>
                  <option value='cancelled'>Hủy</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className='block text-sm font-semibold text-earth mb-2'>Ghi chú</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm'
                  placeholder='Ghi chú thêm...'
                  rows={3}
                />
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedOrder(null)
                  resetForm()
                }}
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50'
              >
                Hủy
              </button>
              <Button
                onClick={handleSubmit}
                className='flex-1 bg-brick text-white hover:bg-brick-dark rounded-lg font-semibold py-2 transition-colors'
                isLoading={createOrderMutation.isPending || updateOrderMutation.isPending}
                disabled={createOrderMutation.isPending || updateOrderMutation.isPending}
              >
                {selectedOrder ? 'Cập nhật' : 'Tạo'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
