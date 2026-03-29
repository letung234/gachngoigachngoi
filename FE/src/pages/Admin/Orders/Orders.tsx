import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import adminApi from 'src/apis/admin.api'
import { Order, OrderStatus } from 'src/types/order.type'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'
import Button from 'src/components/Button'
import { AdminPagination } from 'src/components/Pagination'
import { toast } from 'react-toastify'
import path from 'src/constants/path'

export default function Orders() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const { can } = usePermission()
  const canCreate = can(Permission.ORDER_CREATE)
  const canUpdate = can(Permission.ORDER_UPDATE)
  const canDelete = can(Permission.ORDER_DELETE)

  const limit = 10

  // Fetch orders
  const { data: ordersData, isPending, error, refetch } = useQuery({
    queryKey: ['admin-orders', page, searchTerm, filterStatus],
    queryFn: () =>
      adminApi.getOrders({
        page,
        limit,
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      })
  })

  const orders = ordersData?.data.data?.orders || []
  const pagination = ordersData?.data.data?.pagination

  // Show error toasts if queries fail
  if (error) {
    toast.error('Lỗi tải dữ liệu đơn hàng')
  }

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteOrder(id),
    onSuccess: () => {
      refetch()
      setShowDeleteConfirm(null)
      toast.success('Xóa đơn hàng thành công')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Lỗi xóa đơn hàng')
    }
  })

  const handleAddOrder = () => {
    navigate(path.adminOrderNew)
  }

  const handleEditOrder = (order: Order) => {
    navigate(path.adminOrderEdit.replace(':id', order._id))
  }

  const handleDeleteOrder = (id: string) => {
    if (showDeleteConfirm === id) {
      deleteOrderMutation.mutate(id)
    } else {
      setShowDeleteConfirm(id)
      // Auto-reset delete confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(null), 3000)
    }
  }

  const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: string }> = {
    pending: { label: 'Chờ xử lý', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200', icon: '⏳' },
    confirmed: { label: 'Đã xác nhận', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', icon: '✅' },
    processing: { label: 'Đang xử lý', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200', icon: '⚙️' },
    completed: { label: 'Hoàn thành', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', icon: '🎉' },
    cancelled: { label: 'Đã hủy', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', icon: '❌' }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-7xl mx-auto space-y-8 animate-fadeIn'>
        {/* Header */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3'>
                📦 Quản lý đơn hàng
              </h1>
              <p className='mt-2 text-gray-600'>
                Tổng cộng <span className='font-bold text-brick'>{pagination?.total || orders.length}</span> đơn hàng trong hệ thống
              </p>
            </div>
            {canCreate && (
              <Button
                onClick={handleAddOrder}
                variant='primary'
                size='lg'
                icon={
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                }
                className='shadow-lg hover:shadow-xl'
              >
                <span className='hidden sm:inline'>Tạo đơn hàng mới</span>
                <span className='sm:hidden'>Tạo mới</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>🔍 Tìm kiếm</label>
              <input
                type='text'
                placeholder='Tên khách hàng, số điện thoại, mã đơn hàng...'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1)
                }}
                className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brick focus:ring-2 focus:ring-brick/20 transition-all'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>📊 Trạng thái</label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as any)
                  setPage(1)
                }}
                className='w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brick focus:ring-2 focus:ring-brick/20 transition-all'
              >
                <option value='all'>Tất cả trạng thái</option>
                <option value='pending'>⏳ Chờ xử lý</option>
                <option value='confirmed'>✅ Đã xác nhận</option>
                <option value='processing'>⚙️ Đang xử lý</option>
                <option value='completed'>🎉 Hoàn thành</option>
                <option value='cancelled'>❌ Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          {isPending ? (
            <div className='flex items-center justify-center py-16'>
              <div className='text-center'>
                <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brick mb-6'></div>
                <h2 className='text-xl font-semibold text-gray-700 mb-2'>Đang tải dữ liệu</h2>
                <p className='text-gray-500'>Vui lòng chờ trong giây lát...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className='text-center py-16'>
              <div className='text-6xl mb-6'>📦</div>
              <h2 className='text-xl font-semibold text-gray-700 mb-2'>Không tìm thấy đơn hàng nào</h2>
              <p className='text-gray-500 mb-6'>
                {searchTerm || filterStatus !== 'all'
                  ? 'Thử thay đổi bộ lọc hoặc tìm kiếm khác'
                  : 'Chưa có đơn hàng nào trong hệ thống'
                }
              </p>
              {canCreate && (
                <Button
                  onClick={handleAddOrder}
                  variant='primary'
                  size='md'
                  icon={
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                    </svg>
                  }
                >
                  Tạo đơn hàng đầu tiên
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className='hidden lg:block overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50 border-b border-gray-200'>
                    <tr>
                      <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                        Mã đơn hàng
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                        Khách hàng
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                        Liên hệ
                      </th>
                      <th className='px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>
                        Số lượng SP
                      </th>
                      <th className='px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider'>
                        Tổng tiền
                      </th>
                      <th className='px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>
                        Trạng thái
                      </th>
                      <th className='px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {orders.map((order) => {
                      const status = statusConfig[order.status]
                      return (
                        <tr key={order._id} className='hover:bg-gray-50 transition-colors duration-200'>
                          <td className='px-6 py-4'>
                            <div className='font-mono text-sm font-semibold text-gray-900'>
                              #{order._id.slice(-8).toUpperCase()}
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='text-sm font-medium text-gray-900'>{order.customerName}</div>
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-600'>{order.phone}</td>
                          <td className='px-6 py-4 text-center'>
                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                              {order.items?.length || 0} SP
                            </span>
                          </td>
                          <td className='px-6 py-4 text-right'>
                            <div className='text-sm font-bold text-brick'>
                              ₫{order.total.toLocaleString()}
                            </div>
                          </td>
                          <td className='px-6 py-4 text-center'>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${status.bgColor} ${status.color}`}>
                              <span>{status.icon}</span>
                              {status.label}
                            </span>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center justify-center gap-2'>
                              {canUpdate && (
                                <Button
                                  onClick={() => handleEditOrder(order)}
                                  variant='warning'
                                  size='sm'
                                  icon={
                                    <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                                    </svg>
                                  }
                                >
                                  Sửa
                                </Button>
                              )}
                              {canDelete && (
                                <Button
                                  onClick={() => handleDeleteOrder(order._id)}
                                  variant='danger'
                                  size='sm'
                                  disabled={deleteOrderMutation.isPending}
                                  icon={
                                    showDeleteConfirm === order._id ? (
                                      <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                      </svg>
                                    ) : (
                                      <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                      </svg>
                                    )
                                  }
                                >
                                  {showDeleteConfirm === order._id ? 'Xác nhận' : 'Xóa'}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className='lg:hidden divide-y divide-gray-200'>
                {orders.map((order) => {
                  const status = statusConfig[order.status]
                  return (
                    <div key={order._id} className='p-6 space-y-4'>
                      {/* Header */}
                      <div className='flex items-start justify-between'>
                        <div>
                          <div className='font-mono text-sm font-semibold text-gray-900 mb-1'>
                            #{order._id.slice(-8).toUpperCase()}
                          </div>
                          <div className='text-lg font-medium text-gray-900'>{order.customerName}</div>
                          <div className='text-sm text-gray-600'>{order.phone}</div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${status.bgColor} ${status.color}`}>
                          <span>{status.icon}</span>
                          {status.label}
                        </span>
                      </div>

                      {/* Details */}
                      <div className='flex items-center justify-between'>
                        <div className='text-sm text-gray-600'>
                          <span className='font-medium'>{order.items?.length || 0}</span> sản phẩm
                        </div>
                        <div className='text-lg font-bold text-brick'>
                          ₫{order.total.toLocaleString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className='flex gap-3 pt-2'>
                        {canUpdate && (
                          <Button
                            onClick={() => handleEditOrder(order)}
                            variant='warning'
                            size='md'
                            icon={
                              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                              </svg>
                            }
                            className='flex-1'
                          >
                            Chỉnh sửa
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            onClick={() => handleDeleteOrder(order._id)}
                            variant='danger'
                            size='md'
                            disabled={deleteOrderMutation.isPending}
                            icon={
                              showDeleteConfirm === order._id ? (
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                </svg>
                              ) : (
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                </svg>
                              )
                            }
                          >
                            {showDeleteConfirm === order._id ? 'Xác nhận' : 'Xóa'}
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.total !== undefined && pagination.total > limit && (
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            <AdminPagination
              pagination={pagination}
              onPageChange={setPage}
              showInfo={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}