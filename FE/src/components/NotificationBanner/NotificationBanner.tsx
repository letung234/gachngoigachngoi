import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteConfig } from 'src/contexts/siteConfig.context'

const TYPE_STYLES: Record<string, string> = {
  info: 'bg-blue-600 text-white',
  warning: 'bg-yellow-500 text-earth-dark',
  success: 'bg-green-600 text-white',
  promotion: 'bg-gradient-to-r from-brick to-gold text-white',
}

export default function NotificationBanner() {
  const { config } = useSiteConfig()
  const [isDismissed, setIsDismissed] = useState(false)

  const notification = config?.notification

  if (!notification?.enabled || !notification.message || isDismissed) {
    return null
  }

  const typeStyle = TYPE_STYLES[notification.type] || TYPE_STYLES.info

  return (
    <div className={`relative z-[60] px-4 py-2.5 text-center text-sm font-medium ${typeStyle}`}>
      <div className='container flex items-center justify-center gap-3'>
        <span>{notification.message}</span>
        {notification.link && notification.linkText && (
          <Link
            to={notification.link}
            className='inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-white/30'
          >
            {notification.linkText}
            <svg className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </Link>
        )}
      </div>
      {notification.isDismissible && (
        <button
          onClick={() => setIsDismissed(true)}
          className='absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100'
          aria-label='Đóng thông báo'
        >
          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      )}
    </div>
  )
}
