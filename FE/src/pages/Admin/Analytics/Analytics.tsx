import { useQuery } from '@tanstack/react-query'
import adminApi from 'src/apis/admin.api'
import { purchasesStatus } from 'src/constants/purchase'

export default function AdminAnalytics() {
  // Fetch revenue stats
  const { data: revenueData } = useQuery({
    queryKey: ['admin-revenue-full'],
    queryFn: () => adminApi.getRevenueStats()
  })

  // Fetch top products
  const { data: topProductsData } = useQuery({
    queryKey: ['admin-top-products'],
    queryFn: () => adminApi.getTopProducts(5)
  })

  // Fetch overview for customer stats
  const { data: overviewData } = useQuery({
    queryKey: ['admin-overview-analytics'],
    queryFn: () => adminApi.getOverviewStats()
  })

  // Fetch orders by status
  const { data: pendingOrders } = useQuery({
    queryKey: ['admin-orders-pending'],
    queryFn: () => adminApi.getPurchases({ status: purchasesStatus.waitForConfirmation })
  })

  const { data: processingOrders } = useQuery({
    queryKey: ['admin-orders-processing'],
    queryFn: () => adminApi.getPurchases({ status: purchasesStatus.waitForGetting })
  })

  const { data: shippingOrders } = useQuery({
    queryKey: ['admin-orders-shipping'],
    queryFn: () => adminApi.getPurchases({ status: purchasesStatus.inProgress })
  })

  const { data: deliveredOrders } = useQuery({
    queryKey: ['admin-orders-delivered'],
    queryFn: () => adminApi.getPurchases({ status: purchasesStatus.delivered })
  })

  const revenueStats = revenueData?.data.data.monthly || []
  const topProducts = topProductsData?.data.data || []
  const overview = overviewData?.data.data

  const maxRevenue = Math.max(...revenueStats.map((item) => item.revenue), 1)
  const maxSales = Math.max(...topProducts.map((item) => item.sales), 1)

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-earth'>Phân tích</h1>
        <p className='mt-2 text-cement-dark'>Thống kê chi tiết hoạt động kinh doanh</p>
      </div>

      {/* Revenue analytics */}
      <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
        <h3 className='mb-6 font-semibold text-earth'>Doanh thu theo tháng</h3>
        <div className='flex h-80 items-end justify-around gap-2 pb-4'>
          {revenueStats.length > 0 ? (
            revenueStats.map((item) => (
              <div key={item.month} className='flex flex-col items-center gap-2'>
                <div className='text-xs font-semibold text-brick'>
                  ₫{(item.revenue / 1000000).toFixed(1)}M
                </div>
                <div
                  className='w-6 rounded-t bg-brick transition-all hover:bg-brick-light'
                  style={{ height: `${(item.revenue / maxRevenue) * 300}px` }}
                />
                <span className='text-xs text-cement-dark'>{item.month}</span>
              </div>
            ))
          ) : (
            <div className='flex items-center justify-center text-sm text-cement-dark'>Chưa có dữ liệu</div>
          )}
        </div>
      </div>

      {/* Product performance */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
          <h3 className='mb-6 font-semibold text-earth'>Sản phẩm bán chạy nhất</h3>
          <div className='space-y-4'>
            {topProducts.length > 0 ? (
              topProducts.map((product, i) => (
                <div key={i} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium text-earth'>{product.name}</p>
                    <span className='text-xs font-semibold text-brick'>{product.sales} bán</span>
                  </div>
                  <div className='h-2 w-full overflow-hidden rounded-full bg-cement-light'>
                    <div className='h-full bg-brick' style={{ width: `${(product.sales / maxSales) * 100}%` }} />
                  </div>
                  <p className='text-xs text-cement-dark'>Doanh thu: ₫{product.revenue.toLocaleString()}</p>
                </div>
              ))
            ) : (
              <div className='text-center text-sm text-cement-dark'>Chưa có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Customer analytics */}
        <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
          <h3 className='mb-6 font-semibold text-earth'>Phân tích khách hàng</h3>
          <div className='space-y-6'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-earth'>Tổng doanh thu</p>
                <p className='text-2xl font-bold text-brick'>
                  ₫{((overview?.totalRevenue || 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <p className='text-xs text-cement-dark'>{overview?.revenueChange || '0%'} so với tháng trước</p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-earth'>Khách hàng mới</p>
                <p className='text-2xl font-bold text-gold'>{overview?.newCustomers || 0}</p>
              </div>
              <p className='text-xs text-cement-dark'>{overview?.customersChange || '0%'} so với tháng trước</p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-earth'>Tỉ lệ chuyển đổi</p>
                <p className='text-2xl font-bold text-green-600'>{overview?.conversionRate || 0}%</p>
              </div>
              <p className='text-xs text-cement-dark'>{overview?.conversionChange || '0%'} so với tháng trước</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order analytics */}
      <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
        <h3 className='mb-6 font-semibold text-earth'>Phân tích đơn hàng</h3>
        <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-4'>
          {[
            {
              label: 'Chờ xác nhận',
              value: String(pendingOrders?.data.data.length || 0),
              color: 'bg-yellow-100 text-yellow-800'
            },
            {
              label: 'Đang xử lý',
              value: String(processingOrders?.data.data.length || 0),
              color: 'bg-blue-100 text-blue-800'
            },
            {
              label: 'Đang giao',
              value: String(shippingOrders?.data.data.length || 0),
              color: 'bg-blue-100 text-blue-800'
            },
            {
              label: 'Đã giao',
              value: String(deliveredOrders?.data.data.length || 0),
              color: 'bg-green-100 text-green-800'
            }
          ].map((stat, i) => (
            <div key={i} className={`rounded-lg p-4 ${stat.color}`}>
              <p className='text-sm font-medium'>{stat.label}</p>
              <p className='mt-2 text-3xl font-bold'>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
