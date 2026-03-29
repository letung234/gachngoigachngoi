import { useState, useContext } from 'react'
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'

interface NavItem {
  name: string
  path: string
  icon: string
  permission: Permission
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: path.adminDashboard, icon: '📊', permission: Permission.DASHBOARD_VIEW },
  { name: 'Sản phẩm', path: path.adminProducts, icon: '📦', permission: Permission.PRODUCT_READ },
  { name: 'Danh mục', path: path.adminCategories, icon: '🏷️', permission: Permission.CATEGORY_READ },
  { name: 'Đơn hàng', path: path.adminOrders, icon: '📋', permission: Permission.ORDER_READ },
  { name: 'Người dùng', path: path.adminUsers, icon: '👥', permission: Permission.USER_READ },
  { name: 'Bài viết', path: path.adminPosts, icon: '📝', permission: Permission.POST_READ },
  { name: 'Phân tích', path: path.adminAnalytics, icon: '📈', permission: Permission.STATS_VIEW }
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, profile } = useContext(AppContext)
  const { isAdmin, can, userRoles } = usePermission()

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to={path.login} replace />
  }

  if (!isAdmin) {
    return <Navigate to={path.home} replace />
  }

  const isActive = (itemPath: string) => location.pathname === itemPath

  // Filter nav items based on permissions
  const visibleNavItems = navItems.filter((item) => can(item.permission))

  // Get display role
  const displayRole = userRoles[0] || 'User'

  return (
    <div className='admin-layout flex bg-cement-light'>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className='fixed inset-0 z-20 bg-black/50 md:hidden' onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 h-screen w-64 transform overflow-y-auto bg-earth transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className='flex items-center justify-between border-b border-earth-light p-4'>
          <Link to={path.home} className='flex items-center gap-2 font-serif text-xl font-bold text-cream'>
            🏠 Shoppe
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className='rounded-md p-1 text-cream hover:bg-earth-light md:hidden'
          >
            ✕
          </button>
        </div>

        {/* Admin Label */}
        <div className='border-b border-earth-light px-4 py-3'>
          <p className='text-xs font-semibold uppercase text-cream-light'>Admin Panel</p>
          <p className='mt-1 text-xs text-gold'>{displayRole}</p>
        </div>

        {/* Navigation */}
        <nav className='space-y-1 p-4'>
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                isActive(item.path) ? 'bg-brick font-semibold text-cream' : 'text-cream-light hover:bg-earth-light'
              }`}
            >
              <span className='text-lg'>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Back to site */}
        <div className='absolute bottom-0 left-0 right-0 border-t border-earth-light p-4'>
          <Link
            to={path.home}
            className='flex items-center gap-2 rounded-lg px-4 py-2 text-cream-light transition-colors hover:bg-earth-light'
          >
            ← Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className='flex flex-1 flex-col bg-gray-50'>
        {/* Header */}
        <header className='admin-header border-b border-gray-200 bg-white shadow-sm'>
          <div className='flex items-center justify-between px-4 py-4 md:px-6'>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className='rounded-lg bg-gray-100 p-2 text-earth transition-all hover:bg-gray-200 md:hidden'
              aria-label='Toggle sidebar'
            >
              <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M3 5a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z' clipRule='evenodd' />
              </svg>
            </button>
            
            <div className='flex items-center gap-6 md:gap-8'>
              {/* Quick stats */}
              <div className='hidden lg:flex items-center gap-6'>
                <div className='text-right'>
                  <p className='text-xs text-gray-600'>Hoạt động hôm nay</p>
                </div>
              </div>

              {/* User profile */}
              <div className='flex items-center gap-3'>
                {profile?.avatar ? (
                  <img src={profile.avatar} alt='Avatar' className='h-10 w-10 rounded-full object-cover border-2 border-gray-200' />
                ) : (
                  <div className='h-10 w-10 rounded-full bg-brick text-center text-sm font-bold leading-10 text-white flex items-center justify-center'>
                    {profile?.name?.charAt(0) || profile?.email?.charAt(0) || 'A'}
                  </div>
                )}
                <div className='hidden sm:block'>
                  <p className='text-sm font-semibold text-earth'>{profile?.name || profile?.email}</p>
                  <p className='text-xs text-gray-500'>{displayRole}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className='admin-content bg-gray-50'>
          <div className='p-4 md:p-6'>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
