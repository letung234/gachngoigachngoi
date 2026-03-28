interface ChartCardProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <div className='rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300'>
      <div className='mb-6 flex items-start justify-between'>
        <div>
          <h3 className='text-lg font-bold text-earth'>{title}</h3>
          <p className='mt-2 text-sm text-gray-600'>{description}</p>
        </div>
        <div className='text-2xl'>📊</div>
      </div>
      <div className='overflow-x-auto'>{children}</div>
    </div>
  )
}
