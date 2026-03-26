import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import adminApi from 'src/apis/admin.api'
import { purchasesStatus } from 'src/constants/purchase'
import { toast } from 'react-toastify'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'

const statusConfig = {
  [purchasesStatus.waitForConfirmation]: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  [purchasesStatus.waitForGetting]: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
  [purchasesStatus.inProgress]: { label: 'Đang giao', color: 'bg-blue-100 text-blue-800' },
  [purchasesStatus.delivered]: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  [purchasesStatus.cancelled]: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
}

export default function AdminOrders() {
  const queryClient = useQueryClient()
  const { can } = usePermission()
  const [selectedStatus, setSelectedStatus] = useState<number>(0) // 0 = all
  const [page, setPage] = useState(1)
  const limit = 20

  // Check permissions
  const canUpdateOrder = can(Permission.PURCHASE_UPDATE)

  // Fetch orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', selectedStatus, page],
    queryFn: () =>
      adminApi.getPurchases({
        status: selectedStatus,
        page,
        limit
      })
  })

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: number }) =>
      adminApi.updatePurchaseStatus(orderId, status),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    },
    onError: () => {
      toast.error('Cập nhật trạng thái thất bại')
    }
  })

  const orders = ordersData?.data.data || []

  const handleStatusChange = (orderId: string, newStatus: number) => {
    updateStatusMutation.mutate({ orderId, status: newStatus })
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-earth'>Quản lý đơn hàng</h1>
        <p className='mt-2 text-cement-dark'>Tổng cộng {orders.length} đơn hàng</p>
      </div>

      {/* Status filters */}
      <div className='flex flex-wrap gap-2 rounded-lg bg-white p-4'>
        <button
          onClick={() => setSelectedStatus(0)}
          className={`rounded-lg px-4 py-2 font-medium transition-colors ${
            selectedStatus === 0 ? 'bg-brick text-white' : 'bg-cement-light text-earth hover:bg-cement'
          }`}
        >
          Tất cả
        </button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(Number(status))}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              selectedStatus === Number(status)
                ? 'bg-brick text-white'
                : 'bg-cement-light text-earth hover:bg-cement'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
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
                  <th className='px-4 py-3 text-left text-sm font-semibold text-earth md:px-6'>Mã đơn hàng</th>
                  <th className='hidden px-4 py-3 text-left text-sm font-semibold text-earth md:table-cell md:px-6'>
                    Sản phẩm
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-semibold text-earth md:px-6'>Ngày</th>
                  <th className='hidden px-4 py-3 text-right text-sm font-semibold text-earth md:table-cell md:px-6'>
                    Tổng tiền
                  </th>
                  <th className='hidden px-4 py-3 text-center text-sm font-semibold text-earth md:table-cell md:px-6'>
                    Số lượng
                  </th>
                  <th className='px-4 py-3 text-center text-sm font-semibold text-earth md:px-6'>Trạng thái</th>
                  <th className='px-4 py-3 text-center text-sm font-semibold text-earth md:px-6'>Thao tác</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-cement-light'>
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const status = statusConfig[order.status as keyof typeof statusConfig]
                    return (
                      <tr key={order._id} className='hover:bg-cream-light/50'>
                        <td className='px-4 py-4 font-semibold text-brick md:px-6'>
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className='hidden px-4 py-4 text-earth md:table-cell md:px-6'>
                          {order.product.name}
                        </td>
                        <td className='px-4 py-4 text-sm text-earth md:px-6'>
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className='hidden px-4 py-4 text-right font-semibold text-earth md:table-cell md:px-6'>
                          ₫{(order.price * order.buy_count).toLocaleString()}
                        </td>
                        <td className='hidden px-4 py-4 text-center text-earth md:table-cell md:px-6'>
                          {order.buy_count}
                        </td>
                        <td className='px-4 py-4 text-center md:px-6'>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className='px-4 py-4 text-center md:px-6'>
                          {canUpdateOrder ? (
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, Number(e.target.value))}
                              disabled={updateStatusMutation.isLoading}
                              className='rounded border border-cement-light px-2 py-1 text-xs focus:border-brick focus:outline-none'
                            >
                              {Object.entries(statusConfig).map(([value, config]) => (
                                <option key={value} value={value}>
                                  {config.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className='text-xs text-cement-dark'>Chỉ xem</span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className='px-4 py-8 text-center text-sm text-cement-dark'>
                      Không có đơn hàng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
