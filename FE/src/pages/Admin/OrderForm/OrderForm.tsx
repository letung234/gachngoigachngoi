import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import adminApi from 'src/apis/admin.api'
import { Order, OrderItem, OrderStatus } from 'src/types/order.type'
import { Product } from 'src/types/product.type'
import Button from 'src/components/Button'
import { toast } from 'react-toastify'
import path from 'src/constants/path'
import { ORDER_STATUS } from 'src/constants/order'

interface OrderFormData {
  customerName: string
  customerEmail: string
  phone: string
  address: string
  items: OrderItem[]
  status: OrderStatus
  notes: string
  subtotal: number
  discount: number
  total: number
}

export default function OrderForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerEmail: '',
    phone: '',
    address: '',
    items: [],
    status: ORDER_STATUS.PENDING,
    notes: '',
    subtotal: 0,
    discount: 0,
    total: 0
  })

  const [selectedProducts, setSelectedProducts] = useState<
    Array<{ product: Product; quantity: number }>
  >([])

  // Fetch order detail if editing
  const { data: orderData, isPending: isLoadingOrder } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => adminApi.getOrder(id!),
    enabled: isEditMode
  })

  // Fetch all products for selection
  const { data: productsData, isPending: isLoadingProducts } = useQuery({
    queryKey: ['admin-all-products'],
    queryFn: () => adminApi.getAllProducts()
  })

  const products = productsData?.data.data || []

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && orderData?.data?.data) {
      const order = orderData.data.data
      setFormData({
        customerName: order.customerName,
        customerEmail: order.customerEmail || '',
        phone: order.phone,
        address: order.address || '',
        items: order.items,
        status: order.status,
        notes: order.notes || '',
        subtotal: order.subtotal,
        discount: order.discount || 0,
        total: order.total
      })
    }
  }, [isEditMode, orderData])

  // Populate selected products when editing
  useEffect(() => {
    if (isEditMode && orderData?.data?.data && products.length > 0) {
      const order = orderData.data.data
      const selectedProductsFromOrder = order.items.map(item => {
        // Find product details from products list
        const product = products.find(p => p._id === item.productId)
        if (product) {
          return {
            product: product,
            quantity: item.quantity
          }
        }
        // If product not found, create a minimal product object
        return {
          product: {
            _id: item.productId,
            name: item.productName,
            image: item.image || '',
            price: item.price,
            // Add other required Product fields with defaults
            description: '',
            category: null,
            quantity: 0,
            sold: 0,
            view: 0,
            rating: 0,
            price_before_discount: item.price,
            createdAt: '',
            updatedAt: ''
          },
          quantity: item.quantity
        }
      })
      setSelectedProducts(selectedProductsFromOrder)
    }
  }, [isEditMode, orderData, products])

  // Recalculate totals when items change
  useEffect(() => {
    const subtotal = selectedProducts.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
    const total = Math.max(0, subtotal - formData.discount)

    setFormData(prev => ({
      ...prev,
      subtotal,
      total,
      items: selectedProducts.map(item => ({
        productId: item.product._id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        totalPrice: item.product.price * item.quantity,
        image: item.product.image
      }))
    }))
  }, [selectedProducts, formData.discount])

  // Create order mutation
  const createMutation = useMutation({
    mutationFn: (data: OrderFormData) => adminApi.createOrder(data),
    onSuccess: () => {
      toast.success('Tạo đơn hàng thành công')
      navigate(path.adminOrders)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Lỗi tạo đơn hàng')
    }
  })

  // Update order mutation
  const updateMutation = useMutation({
    mutationFn: (data: OrderFormData) => adminApi.updateOrder(id!, data),
    onSuccess: () => {
      toast.success('Cập nhật đơn hàng thành công')
      navigate(path.adminOrders)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Lỗi cập nhật đơn hàng')
    }
  })

  const handleInputChange = (key: keyof OrderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleAddProduct = () => {
    if (products.length === 0) {
      toast.error('Không có sản phẩm nào để thêm')
      return
    }
    setSelectedProducts(prev => [
      ...prev,
      { product: products[0], quantity: 1 }
    ])
  }

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index))
  }

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p._id === productId)
    if (product) {
      setSelectedProducts(prev =>
        prev.map((item, i) =>
          i === index ? { ...item, product } : item
        )
      )
    }
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    setSelectedProducts(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerName.trim()) {
      toast.error('Vui lòng nhập tên khách hàng')
      return
    }

    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại')
      return
    }

    if (formData.items.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm')
      return
    }

    if (isEditMode) {
      updateMutation.mutate({
        ...formData,
        shippingCost: 0 // Always 0 for no shipping cost
      })
    } else {
      createMutation.mutate({
        ...formData,
        shippingCost: 0 // Always 0 for no shipping cost
      })
    }
  }

  const isLoading = isLoadingOrder || isLoadingProducts
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brick mb-6'></div>
            <h2 className='text-xl font-semibold text-gray-700 mb-2'>Đang tải dữ liệu</h2>
            <p className='text-gray-500'>Vui lòng chờ trong giây lát...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto animate-fadeIn'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
            <div className='mb-4 sm:mb-0'>
              <h1 className='text-3xl sm:text-4xl font-bold text-gray-900'>
                {isEditMode ? 'Sửa đơn hàng' : 'Tạo đơn hàng mới'}
              </h1>
              <p className='mt-2 text-sm sm:text-base text-gray-600'>
                {isEditMode ? 'Cập nhật thông tin đơn hàng' : 'Tạo đơn hàng mới cho khách hàng'}
              </p>
            </div>
            <Button
              onClick={() => navigate(path.adminOrders)}
              variant='ghost'
              size='md'
              icon={
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
                </svg>
              }
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Customer Information */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h2 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                👤 Thông tin khách hàng
              </h2>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Tên khách hàng <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brick focus:ring-2 focus:ring-brick/20 transition-all'
                    placeholder='Nhập tên khách hàng'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Số điện thoại <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='tel'
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brick focus:ring-2 focus:ring-brick/20 transition-all'
                    placeholder='Nhập số điện thoại'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email
                  </label>
                  <input
                    type='email'
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brick focus:ring-2 focus:ring-brick/20 transition-all'
                    placeholder='Nhập email khách hàng'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Địa chỉ
                  </label>
                  <input
                    type='text'
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brick focus:ring-2 focus:ring-brick/20 transition-all'
                    placeholder='Nhập địa chỉ giao hàng'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                <h2 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                  🛍️ Sản phẩm trong đơn hàng
                </h2>
                <Button
                  type='button'
                  onClick={handleAddProduct}
                  variant='success'
                  size='md'
                  disabled={products.length === 0}
                  icon={
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                    </svg>
                  }
                >
                  Thêm sản phẩm
                </Button>
              </div>
            </div>

            <div className='p-6'>
              {selectedProducts.length === 0 ? (
                <div className='text-center py-12 text-gray-500'>
                  <div className='text-6xl mb-4'>📦</div>
                  <p className='text-lg mb-2'>Chưa có sản phẩm nào</p>
                  <p className='text-sm'>Click "Thêm sản phẩm" để bắt đầu thêm sản phẩm vào đơn hàng</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {selectedProducts.map((item, index) => (
                    <div key={index} className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end'>
                        <div className='lg:col-span-2'>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Sản phẩm
                          </label>
                          <select
                            value={item.product._id}
                            onChange={(e) => handleProductChange(index, e.target.value)}
                            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brick focus:ring-2 focus:ring-brick/20 transition-all'
                          >
                            {products.map((product) => (
                              <option key={product._id} value={product._id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Số lượng
                          </label>
                          <input
                            type='number'
                            min='1'
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                            className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brick focus:ring-2 focus:ring-brick/20 transition-all'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Đơn giá
                          </label>
                          <div className='px-3 py-2 bg-gray-50 rounded-lg text-sm font-semibold text-gray-900'>
                            ₫{item.product.price.toLocaleString()}
                          </div>
                        </div>

                        <div className='flex flex-col sm:flex-row sm:items-end gap-3'>
                          <div className='flex-1'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                              Thành tiền
                            </label>
                            <div className='px-3 py-2 bg-brick/5 border-l-4 border-brick rounded text-sm font-bold text-brick'>
                              ₫{(item.product.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                          <Button
                            type='button'
                            onClick={() => handleRemoveProduct(index)}
                            variant='danger'
                            size='sm'
                            icon={
                              <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                              </svg>
                            }
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Settings */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Order Summary */}
            <div className='lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200'>
              <div className='px-6 py-4 border-b border-gray-200'>
                <h2 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                  📋 Cài đặt đơn hàng
                </h2>
              </div>
              <div className='p-6 space-y-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Giảm giá (₫)
                    </label>
                    <input
                      type='number'
                      min='0'
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', parseInt(e.target.value) || 0)}
                      className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brick focus:ring-2 focus:ring-brick/20 transition-all'
                      placeholder='0'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brick focus:ring-2 focus:ring-brick/20 transition-all'
                    >
                      <option value={ORDER_STATUS.PENDING}>Chờ xử lý</option>
                      <option value={ORDER_STATUS.CONFIRMED}>Đã xác nhận</option>
                      <option value={ORDER_STATUS.PROCESSING}>Đang xử lý</option>
                      <option value={ORDER_STATUS.COMPLETED}>Hoàn thành</option>
                      <option value={ORDER_STATUS.CANCELLED}>Đã hủy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brick focus:ring-2 focus:ring-brick/20 transition-all resize-none'
                    placeholder='Ghi chú thêm cho đơn hàng...'
                  />
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
              <div className='px-6 py-4 border-b border-gray-200'>
                <h2 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                  💰 Tổng kết đơn hàng
                </h2>
              </div>
              <div className='p-6'>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-600'>Tạm tính:</span>
                    <span className='font-medium'>₫{formData.subtotal.toLocaleString()}</span>
                  </div>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-600'>Giảm giá:</span>
                    <span className='font-medium text-red-600'>-₫{formData.discount.toLocaleString()}</span>
                  </div>
                  <div className='border-t pt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-semibold text-gray-900'>Tổng cộng:</span>
                      <span className='text-xl font-bold text-brick'>₫{formData.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className='mt-6 pt-6 border-t space-y-3'>
                  <Button
                    type='submit'
                    disabled={isSubmitting || formData.items.length === 0}
                    variant='primary'
                    size='lg'
                    isLoading={isSubmitting}
                    icon={
                      !isSubmitting && (
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2}
                            d={isEditMode ? 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' : 'M12 4v16m8-8H4'} />
                        </svg>
                      )
                    }
                    className='w-full'
                  >
                    {isSubmitting ? (
                      isEditMode ? 'Đang cập nhật...' : 'Đang tạo...'
                    ) : (
                      isEditMode ? 'Cập nhật đơn hàng' : 'Tạo đơn hàng'
                    )}
                  </Button>

                  <Button
                    type='button'
                    onClick={() => navigate(path.adminOrders)}
                    variant='outline'
                    size='lg'
                    icon={
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    }
                    className='w-full'
                  >
                    Hủy bỏ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}