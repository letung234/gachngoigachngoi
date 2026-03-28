import { useQuery } from '@tanstack/react-query'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import adminApi from 'src/apis/admin.api'
import { purchasesStatus } from 'src/constants/purchase'

const statusMap: Record<number, { label: string; color: string }> = {
  [-1]: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  [purchasesStatus.waitForConfirmation]: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  [purchasesStatus.waitForGetting]: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
  [purchasesStatus.inProgress]: { label: 'Đang giao', color: 'bg-blue-100 text-blue-800' },
  [purchasesStatus.delivered]: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  [purchasesStatus.cancelled]: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800' }
}

export default function AdminDashboard() {
  // Fetch overview stats
  const { data: overviewData } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => adminApi.getOverviewStats()
  })

  // Fetch revenue stats
  const { data: revenueData } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: () => adminApi.getRevenueStats()
  })

  // Fetch latest orders
  const { data: latestOrdersData } = useQuery({
    queryKey: ['admin-latest-orders'],
    queryFn: () => adminApi.getLatestOrders(5)
  })

  const overview = overviewData?.data.data
  const revenueStats = revenueData?.data.data.monthly || []
  const latestOrders = latestOrdersData?.data.data || []

  // Calculate max revenue for chart scaling
  const maxRevenue = Math.max(...revenueStats.map((item) => item.revenue), 1)

  return (
    <div className='space-y-8'>
      {/* Page header */}
      <div className='flex items-end justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-earth'>Dashboard</h1>
          <p className='mt-2 text-gray-600'>Tổng quan hoạt động kinh doanh hôm nay</p>
        </div>
        <div className='hidden md:flex items-center gap-2 text-xs text-gray-600'>
          <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h.01a1 1 0 100-2H6zm2 0a1 1 0 000 2h2.01a1 1 0 100-2H8zm4 0a1 1 0 000 2h.01a1 1 0 100-2h-.01zm2 0a1 1 0 100 2H14a1 1 0 100-2h-.01z' clipRule='evenodd' />
          </svg>
          <span>Cập nhật lúc: {new Date().toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Tổng doanh thu'
          value={`₫${(overview?.totalRevenue || 0).toLocaleString()}`}
          change={overview?.revenueChange || '0%'}
          icon='💰'
          trend={overview?.revenueChange?.startsWith('+') ? 'up' : 'down'}
        />
        <StatCard
          title='Đơn hàng hôm nay'
          value={String(overview?.todayOrders || 0)}
          change={overview?.ordersChange || '0%'}
          icon='📦'
          trend={overview?.ordersChange?.startsWith('+') ? 'up' : 'down'}
        />
        <StatCard
          title='Khách hàng mới'
          value={String(overview?.newCustomers || 0)}
          change={overview?.customersChange || '0%'}
          icon='👥'
          trend={overview?.customersChange?.startsWith('+') ? 'up' : 'down'}
        />
        <StatCard
          title='Tỉ lệ chuyển đổi'
          value={`${overview?.conversionRate || 0}%`}
          change={overview?.conversionChange || '0%'}
          icon='📈'
          trend={overview?.conversionChange?.startsWith('+') ? 'up' : 'down'}
        />
      </div>

      {/* Charts */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <ChartCard title='Doanh thu hàng tháng' description='Biểu đồ doanh thu 6 tháng gần nhất'>
          <div className='flex h-72 items-end justify-around gap-3 pb-6'>
            {revenueStats.length > 0 ? (
              revenueStats.slice(-6).map((item, i) => (
                <div key={i} className='flex flex-col items-center gap-3 flex-1'>
                  <div
                    className='w-full max-w-16 rounded-t-lg bg-gradient-to-t from-brick to-brick/80 hover:from-brick-dark hover:to-brick transition-all duration-300 shadow-sm'
                    style={{ height: `${(item.revenue / maxRevenue) * 240}px` }}
                    title={`₫${item.revenue.toLocaleString()}`}
                  />
                  <span className='text-xs font-medium text-gray-700'>{item.month}</span>
                </div>
              ))
            ) : (
              <div className='flex items-center justify-center w-full text-sm text-gray-500'>
                Chưa có dữ liệu
              </div>
            )}
          </div>
        </ChartCard>

        <ChartCard title='Danh mục sản phẩm' description='Phân bố bán hàng theo danh mục'>
          <div className='flex h-72 flex-col items-center justify-center gap-8'>
            <div className='w-full space-y-6'>
              {[
                { label: 'Gạch ốp tường', value: 45, color: 'from-brick to-brick/70' },
                { label: 'Gạch lát sàn', value: 30, color: 'from-gold to-gold/70' },
                { label: 'Gạch trang trí', value: 15, color: 'from-purple-600 to-purple-600/70' },
                { label: 'Khác', value: 10, color: 'from-gray-400 to-gray-400/70' }
              ].map((item, i) => (
                <div key={i} className='group'>
                  <div className='mb-2 flex justify-between items-center'>
                    <span className='text-sm font-medium text-earth'>{item.label}</span>
                    <span className='text-sm font-bold text-brick group-hover:text-brick-dark transition-colors'>{item.value}%</span>
                  </div>
                  <div className='h-3 w-full overflow-hidden rounded-full bg-gray-200 shadow-sm'>
                    <div 
                      className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500 hover:shadow-md`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent orders */}
      <div className='overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100'>
        <div className='border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-bold text-earth'>Đơn hàng gần đây</h3>
              <p className='mt-1 text-sm text-gray-600'>Những đơn hàng mới nhất từ hệ thống</p>
            </div>
            <span className='text-2xl'>📋</span>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Mã đơn</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Khách hàng</th>
                <th className='hidden px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider md:table-cell'>
                  Số tiền
                </th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Trạng thái</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {latestOrders.length > 0 ? (
                latestOrders.map((order, index) => {
                  const status = statusMap[order.status] || statusMap[1]
                  return (
                    <tr key={order._id} className='hover:bg-gray-50 transition-colors duration-200'>
                      <td className='px-6 py-5 font-semibold text-brick'>
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className='px-6 py-5 text-gray-900'>{order.customer}</td>
                      <td className='hidden px-6 py-5 text-gray-900 font-medium md:table-cell'>
                        ₫{order.amount.toLocaleString()}
                      </td>
                      <td className='px-6 py-5'>
                        <span className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className='px-6 py-12 text-center text-sm text-gray-500'>
                    <div className='flex flex-col items-center gap-2'>
                      <span className='text-3xl'>📦</span>
                      <span>Chưa có đơn hàng nào</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
