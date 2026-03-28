interface StatCardProps {
  title: string
  value: string
  change: string
  icon: string
  trend: 'up' | 'down'
}

export default function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  const getTrendColor = () => {
    return trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
  }

  const getIconBgColor = () => {
    if (icon === '💰') return 'bg-amber-50'
    if (icon === '📦') return 'bg-blue-50'
    if (icon === '👥') return 'bg-purple-50'
    if (icon === '📈') return 'bg-green-50'
    return 'bg-gray-50'
  }

  return (
    <div className='group rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md border border-gray-100'>
      <div className='flex items-start justify-between mb-4'>
        <div className={`text-4xl p-3 rounded-lg ${getIconBgColor()} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getTrendColor()}`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </span>
      </div>
      <p className='text-sm text-gray-600 font-medium'>{title}</p>
      <p className='mt-2 text-3xl font-bold text-earth'>{value}</p>
      <p className='mt-3 text-xs text-gray-500'>
        {trend === 'up' ? 'Tăng' : 'Giảm'} so với tháng trước
      </p>
    </div>
  )
}
