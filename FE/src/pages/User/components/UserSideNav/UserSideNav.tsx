import classNames from 'classnames'
import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { getAvatarUrl } from 'src/utils/utils'

const navItems = [
  { to: path.profile, icon: '👤', label: 'Tài khoản của tôi' },
  { to: path.changePassword, icon: '🔑', label: 'Đổi mật khẩu' },
  { to: path.historyPurchase, icon: '📦', label: 'Đơn mua của tôi' }
]

export default function UserSideNav() {
  const { profile } = useContext(AppContext)

  return (
    <nav className='rounded-lg bg-white p-6 shadow-sm'>
      {/* Profile Card */}
      <div className='mb-8'>
        <Link
          to={path.profile}
          className='group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-gray-50'
        >
          <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-200 group-hover:border-brick transition-colors'>
            <img src={getAvatarUrl(profile?.avatar)} alt={profile?.name || 'User'} className='h-full w-full object-cover' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-semibold text-earth truncate'>{profile?.name || profile?.email}</p>
            <p className='text-xs text-gray-500 truncate'>{profile?.email}</p>
            <div className='mt-2 flex items-center gap-1 text-xs text-brick font-medium group-hover:translate-x-0.5 transition-transform'>
              <span>Sửa hồ sơ</span>
              <svg width='12' height='12' viewBox='0 0 12 12' fill='currentColor'>
                <path d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48' fillRule='evenodd' />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className='space-y-1 border-t border-gray-200 pt-6'>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-all duration-200',
                isActive
                  ? 'bg-brick text-white shadow-sm'
                  : 'text-earth hover:bg-gray-50'
              )
            }
          >
            <span className='text-lg'>{item.icon}</span>
            <span className='text-sm'>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
