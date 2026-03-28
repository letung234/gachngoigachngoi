import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { AppContext } from 'src/contexts/app.context'
import UserSideNav from '../../components/UserSideNav'
import { getAvatarUrl } from 'src/utils/utils'

export default function UserLayout() {
  const { profile } = useContext(AppContext)

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24 pb-12'>
      {/* Page Header */}
      <div className='border-b border-gray-200 bg-white shadow-sm'>
        <div className='container py-8'>
          <div className='flex items-center gap-6'>
            <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-3 border-brick shadow-md'>
              <img
                src={getAvatarUrl(profile?.avatar)}
                alt={profile?.name || 'User'}
                className='h-full w-full object-cover'
              />
            </div>
            <div className='flex-1'>
              <h1 className='text-3xl font-bold text-earth'>{profile?.name || 'Người dùng'}</h1>
              <p className='mt-1 text-gray-600'>{profile?.email}</p>
              <p className='mt-2 flex items-center gap-2 text-sm text-green-600 font-medium'>
                <span className='h-2 w-2 rounded-full bg-green-600'></span>
                Tài khoản hoạt động
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container py-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-12'>
          <aside className='md:col-span-3 lg:col-span-2'>
            <UserSideNav />
          </aside>
          <main className='md:col-span-9 lg:col-span-10'>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
