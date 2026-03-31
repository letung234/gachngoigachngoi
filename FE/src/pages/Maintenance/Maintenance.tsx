import { useSiteConfig } from 'src/contexts/siteConfig.context'

export default function Maintenance() {
  const { config } = useSiteConfig()
  const message = config?.maintenance?.message || 'Website đang được bảo trì, vui lòng quay lại sau.'

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-earth-dark to-earth p-4'>
      <div className='max-w-lg text-center'>
        <div className='mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gold/20'>
          <svg className='h-12 w-12 text-gold' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5}
              d='M11.42 15.17l-5.384-3.19A1 1 0 015 11.094V6.858a1 1 0 01.47-.848l5.384-3.19a1 1 0 011.042 0l5.384 3.19a1 1 0 01.47.848v4.236a1 1 0 01-.47.848l-5.384 3.19a1 1 0 01-1.042 0z' />
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M10 12l2 2 4-4' />
          </svg>
        </div>
        <h1 className='mb-4 font-serif text-3xl font-bold text-cream-light md:text-4xl'>
          Đang bảo trì
        </h1>
        <p className='mb-8 text-lg text-cream-light/80'>
          {message}
        </p>
        <div className='flex items-center justify-center gap-2 text-sm text-cream-light/60'>
          <div className='h-2 w-2 animate-pulse rounded-full bg-gold' />
          <span>Đang cập nhật hệ thống...</span>
        </div>
      </div>
    </div>
  )
}
