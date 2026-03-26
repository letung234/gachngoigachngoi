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
    <div className='space-y-6'>
      {/* Page header */}
      <div>
        <h1 className='text-3xl font-bold text-earth'>Dashboard</h1>
        <p className='mt-2 text-cement-dark'>Tổng quan hoạt động kinh doanh</p>
      </div>

      {/* Stats grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
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
          <div className='flex h-64 items-end justify-around gap-2 pb-4'>
            {revenueStats.length > 0 ? (
              revenueStats.slice(-6).map((item, i) => (
                <div key={i} className='flex flex-col items-center gap-2'>
                  <div
                    className='w-8 rounded-t bg-brick'
                    style={{ height: `${(item.revenue / maxRevenue) * 200}px` }}
                  />
                  <span className='text-xs text-cement-dark'>{item.month}</span>
                </div>
              ))
            ) : (
              <div className='flex items-center justify-center text-sm text-cement-dark'>
                Chưa có dữ liệu
              </div>
            )}
          </div>
        </ChartCard>

        <ChartCard title='Danh mục sản phẩm' description='Phân bố bán hàng theo danh mục'>
          <div className='flex h-64 flex-col items-center justify-center gap-6'>
            <div className='w-full space-y-3'>
              {[
                { label: 'Gạch ốp tường', value: 45, color: 'bg-brick' },
                { label: 'Gạch lát sàn', value: 30, color: 'bg-gold' },
                { label: 'Gạch trang trí', value: 15, color: 'bg-cement-dark' },
                { label: 'Khác', value: 10, color: 'bg-earth-light' }
              ].map((item, i) => (
                <div key={i}>
                  <div className='mb-1 flex justify-between text-xs'>
                    <span className='text-earth'>{item.label}</span>
                    <span className='font-semibold text-brick'>{item.value}%</span>
                  </div>
                  <div className='h-2 w-full overflow-hidden rounded-full bg-cement-light'>
                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent orders */}
      <div className='overflow-hidden rounded-lg bg-white shadow-sm'>
        <div className='border-b border-cement-light p-4 md:p-6'>
          <h3 className='font-semibold text-earth'>Đơn hàng gần đây</h3>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-cream-light'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-semibold text-earth md:px-6'>Mã đơn hàng</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-earth md:px-6'>Khách hàng</th>
                <th className='hidden px-4 py-3 text-left text-sm font-semibold text-earth md:table-cell md:px-6'>
                  Số tiền
                </th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-earth md:px-6'>Trạng thái</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-cement-light'>
              {latestOrders.length > 0 ? (
                latestOrders.map((order) => {
                  const status = statusMap[order.status] || statusMap[1]
                  return (
                    <tr key={order._id} className='hover:bg-cream-light/50'>
                      <td className='px-4 py-4 font-semibold text-brick md:px-6'>
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className='px-4 py-4 text-earth md:px-6'>{order.customer}</td>
                      <td className='hidden px-4 py-4 text-earth md:table-cell md:px-6'>
                        ₫{order.amount.toLocaleString()}
                      </td>
                      <td className='px-4 py-4 md:px-6'>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className='px-4 py-8 text-center text-sm text-cement-dark'>
                    Chưa có đơn hàng
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
