interface StatCardProps {
  title: string
  value: string
  change: string
  icon: string
  trend: 'up' | 'down'
}

export default function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='text-sm text-cement-dark'>{title}</p>
          <p className='mt-2 text-2xl font-bold text-earth md:text-3xl'>{value}</p>
          <p className={`mt-2 text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {change} từ tháng trước
          </p>
        </div>
        <div className='text-3xl md:text-4xl'>{icon}</div>
      </div>
    </div>
  )
}
