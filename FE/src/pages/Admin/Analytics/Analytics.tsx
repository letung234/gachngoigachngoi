import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import adminApi from 'src/apis/admin.api'
import { ORDER_STATUS } from 'src/constants/order'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart
} from 'recharts'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const STATUS_LABEL_MAP: Record<string, { label: string; color: string }> = {
  [ORDER_STATUS.PENDING]: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  [ORDER_STATUS.CONFIRMED]: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  [ORDER_STATUS.PROCESSING]: { label: 'Đang xử lý', color: 'bg-indigo-100 text-indigo-800' },
  [ORDER_STATUS.COMPLETED]: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
  [ORDER_STATUS.CANCELLED]: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
}

const CHART_COLORS = ['#8B4513', '#D4A574', '#FFD700', '#2563EB', '#16A34A', '#DC2626', '#7C3AED']

export default function AdminAnalytics() {
  const [activeView, setActiveView] = useState<'overview' | 'products' | 'orders'>('overview')

  const { data: revenueData, isLoading: isRevenueLoading } = useQuery({
    queryKey: ['admin-revenue-full'],
    queryFn: () => adminApi.getRevenueStats(),
    retry: 2,
  })

  const { data: topProductsData, isLoading: isTopLoading } = useQuery({
    queryKey: ['admin-top-products'],
    queryFn: () => adminApi.getTopProducts(10),
    retry: 2,
  })

  const { data: overviewData } = useQuery({
    queryKey: ['admin-overview-analytics'],
    queryFn: () => adminApi.getOverviewStats(),
    retry: 2,
  })

  const { data: orderStatusData, isLoading: isOrderStatusLoading } = useQuery({
    queryKey: ['admin-order-status-counts'],
    queryFn: () => adminApi.getOrderStatusCounts(),
    retry: 2,
  })

  const { data: categoryData } = useQuery({
    queryKey: ['admin-category-stats'],
    queryFn: () => adminApi.getCategoryStats(),
    retry: 2,
  })

  const { data: contactStatsData } = useQuery({
    queryKey: ['admin-contact-stats'],
    queryFn: () => adminApi.getContactStats(),
    retry: 2,
  })

  const revenueStats = revenueData?.data.data?.monthly || []
  const topProducts = topProductsData?.data.data || []
  const overview = overviewData?.data.data
  const orderStatusCounts = orderStatusData?.data.data?.statusCountList || []
  const categoryStats = categoryData?.data.data || []
  const contactStats = contactStatsData?.data?.data

  const isLoading = isRevenueLoading && !revenueData

  const orderPieData = orderStatusCounts.map((item) => ({
    name: STATUS_LABEL_MAP[item.status]?.label || item.status,
    value: item.count,
  }))

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new()

    // Revenue sheet
    if (revenueStats.length > 0) {
      const wsRevenue = XLSX.utils.json_to_sheet(revenueStats.map((r) => ({
        'Tháng': r.month,
        'Doanh thu (₫)': r.revenue,
      })))
      XLSX.utils.book_append_sheet(wb, wsRevenue, 'Doanh thu')
    }

    // Top products sheet
    if (topProducts.length > 0) {
      const wsProducts = XLSX.utils.json_to_sheet(topProducts.map((p, i) => ({
        'STT': i + 1,
        'Sản phẩm': p.productName,
        'Số lượng bán': p.totalSold,
        'Doanh thu (₫)': p.totalRevenue,
      })))
      XLSX.utils.book_append_sheet(wb, wsProducts, 'Sản phẩm')
    }

    // Order status sheet
    if (orderStatusCounts.length > 0) {
      const wsOrders = XLSX.utils.json_to_sheet(orderStatusCounts.map((o) => ({
        'Trạng thái': STATUS_LABEL_MAP[o.status]?.label || o.status,
        'Số lượng': o.count,
      })))
      XLSX.utils.book_append_sheet(wb, wsOrders, 'Đơn hàng')
    }

    // Category stats sheet
    if (categoryStats.length > 0) {
      const wsCategories = XLSX.utils.json_to_sheet(categoryStats.map((c: any) => ({
        'Danh mục': c.label,
        'Số sản phẩm': c.value,
        'Đã bán': c.sold,
        'Doanh thu (₫)': c.revenue,
      })))
      XLSX.utils.book_append_sheet(wb, wsCategories, 'Danh mục')
    }

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([buffer]), 'bao-cao-thong-ke_' + new Date().toISOString().slice(0, 10) + '.xlsx')
  }

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brick-dark mb-4' />
          <h2 className='text-xl font-semibold text-gray-700'>Đang tải phân tích...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-earth md:text-3xl'>Phân tích & Thống kê</h1>
          <p className='mt-1 text-sm text-cement-dark'>Dữ liệu chi tiết về hoạt động kinh doanh</p>
        </div>
        <div className='flex gap-3'>
          <div className='flex rounded-lg bg-white shadow-sm'>
            {(['overview', 'products', 'orders'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-3 py-2 text-xs font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
                  activeView === view ? 'bg-brick text-white' : 'text-cement-dark hover:bg-cream-light'
                }`}
              >
                {view === 'overview' ? 'Tổng quan' : view === 'products' ? 'Sản phẩm' : 'Đơn hàng'}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportExcel}
            className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700'
          >
            <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
            </svg>
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Overview cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-lg bg-white p-4 shadow-sm'>
          <p className='text-sm text-cement-dark'>Tổng doanh thu</p>
          <p className='mt-1 text-2xl font-bold text-brick'>₫{((overview?.totalRevenue || 0) / 1000000).toFixed(1)}M</p>
          <p className='mt-1 text-xs text-green-600'>{overview?.revenueChange || '0%'}</p>
        </div>
        <div className='rounded-lg bg-white p-4 shadow-sm'>
          <p className='text-sm text-cement-dark'>Đơn hàng hôm nay</p>
          <p className='mt-1 text-2xl font-bold text-earth'>{overview?.todayOrders || 0}</p>
          <p className='mt-1 text-xs text-green-600'>{overview?.ordersChange || '0%'}</p>
        </div>
        <div className='rounded-lg bg-white p-4 shadow-sm'>
          <p className='text-sm text-cement-dark'>Khách hàng mới</p>
          <p className='mt-1 text-2xl font-bold text-gold'>{overview?.newCustomers || 0}</p>
          <p className='mt-1 text-xs text-green-600'>{overview?.customersChange || '0%'}</p>
        </div>
        <div className='rounded-lg bg-white p-4 shadow-sm'>
          <p className='text-sm text-cement-dark'>Liên hệ mới</p>
          <p className='mt-1 text-2xl font-bold text-blue-600'>{contactStats?.new || 0}</p>
          <p className='mt-1 text-xs text-cement-dark'>Tổng: {contactStats?.total || 0}</p>
        </div>
      </div>

      {activeView === 'overview' && (
        <>
          {/* Revenue chart */}
          <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
            <h3 className='mb-4 font-semibold text-earth'>Doanh thu theo tháng</h3>
            <div className='h-72'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={revenueStats}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e5e5e5' />
                  <XAxis dataKey='month' tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => (v / 1000000).toFixed(0) + 'M'} />
                  <Tooltip formatter={(v: number) => ['₫' + v.toLocaleString(), 'Doanh thu']} />
                  <Area type='monotone' dataKey='revenue' stroke='#8B4513' fill='#8B4513' fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category & Contact stats */}
          <div className='grid gap-6 lg:grid-cols-2'>
            {/* Category pie chart */}
            <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
              <h3 className='mb-4 font-semibold text-earth'>Thống kê theo danh mục</h3>
              <div className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={categoryStats.map((c: any) => ({ name: c.label, value: c.sold || c.value }))}
                      cx='50%' cy='50%'
                      outerRadius={90}
                      dataKey='value'
                      label={({ name, percent }) => name + ' ' + (percent * 100).toFixed(0) + '%'}
                    >
                      {categoryStats.map((_: any, i: number) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Contact monthly chart */}
            <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
              <h3 className='mb-4 font-semibold text-earth'>Liên hệ theo tháng</h3>
              <div className='h-64'>
                {contactStats?.monthly?.length > 0 ? (
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={contactStats.monthly}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#e5e5e5' />
                      <XAxis dataKey='month' tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey='count' fill='#2563EB' radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='flex h-full items-center justify-center text-sm text-cement-dark'>Chưa có dữ liệu</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'products' && (
        <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
          <h3 className='mb-4 font-semibold text-earth'>Sản phẩm bán chạy</h3>
          {isTopLoading ? (
            <div className='flex justify-center py-8'>
              <div className='h-8 w-8 animate-spin rounded-full border-2 border-brick border-t-transparent' />
            </div>
          ) : (
            <>
              <div className='mb-6 h-72'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={topProducts.slice(0, 10)} layout='vertical'>
                    <CartesianGrid strokeDasharray='3 3' stroke='#e5e5e5' />
                    <XAxis type='number' tick={{ fontSize: 11 }} />
                    <YAxis dataKey='productName' type='category' width={120} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => [v, 'Số lượng']} />
                    <Bar dataKey='totalSold' fill='#D4A574' radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <table className='w-full text-left text-sm'>
                <thead className='border-b bg-cream-light text-xs uppercase text-cement-dark'>
                  <tr>
                    <th className='px-4 py-2'>#</th>
                    <th className='px-4 py-2'>Sản phẩm</th>
                    <th className='px-4 py-2 text-right'>Đã bán</th>
                    <th className='px-4 py-2 text-right'>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={i} className='border-b'>
                      <td className='px-4 py-2 text-cement-dark'>{i + 1}</td>
                      <td className='px-4 py-2 font-medium text-earth'>{p.productName}</td>
                      <td className='px-4 py-2 text-right'>{p.totalSold}</td>
                      <td className='px-4 py-2 text-right text-brick font-medium'>₫{p.totalRevenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {activeView === 'orders' && (
        <div className='grid gap-6 lg:grid-cols-2'>
          {/* Order status pie */}
          <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
            <h3 className='mb-4 font-semibold text-earth'>Phân bổ đơn hàng</h3>
            {isOrderStatusLoading ? (
              <div className='flex justify-center py-8'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-brick border-t-transparent' />
              </div>
            ) : (
              <div className='h-72'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie data={orderPieData} cx='50%' cy='50%' outerRadius={100} dataKey='value' label>
                      {orderPieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Order status cards */}
          <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
            <h3 className='mb-4 font-semibold text-earth'>Chi tiết trạng thái</h3>
            <div className='space-y-3'>
              {orderStatusCounts.map((item, i) => {
                const info = STATUS_LABEL_MAP[item.status] || { label: item.status, color: 'bg-gray-100 text-gray-800' }
                const total = orderStatusData?.data.data?.totalOrders || 1
                const pct = ((item.count / total) * 100).toFixed(1)
                return (
                  <div key={i} className='space-y-1'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${info.color}`}>{info.label}</span>
                      <span className='font-medium text-earth'>{item.count} ({pct}%)</span>
                    </div>
                    <div className='h-2 w-full overflow-hidden rounded-full bg-gray-100'>
                      <div
                        className='h-full rounded-full transition-all'
                        style={{ width: pct + '%', backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
