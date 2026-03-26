interface ChartCardProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <div className='rounded-lg bg-white p-4 shadow-sm md:p-6'>
      <div className='mb-6'>
        <h3 className='font-semibold text-earth'>{title}</h3>
        <p className='mt-1 text-sm text-cement-dark'>{description}</p>
      </div>
      <div className='overflow-x-auto'>{children}</div>
    </div>
  )
}
