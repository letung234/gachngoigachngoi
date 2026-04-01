import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import usePermission from 'src/hooks/usePermission'
import { Permission } from 'src/constants/permission'
import path from 'src/constants/path'
import { clearLS } from 'src/utils/auth'

interface NavItem {
  name: string
  path: string
  icon: string
  permission: Permission
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: path.adminDashboard, icon: '📊', permission: Permission.DASHBOARD_VIEW },
  { name: 'Sản phẩm', path: path.adminProducts, icon: '📦', permission: Permission.PRODUCT_READ },
  { name: 'Danh mục', path: path.adminCategories, icon: '📋', permission: Permission.CATEGORY_READ },
  { name: 'Đơn hàng', path: path.adminOrders, icon: '🛒', permission: Permission.ORDER_READ },
  { name: 'Người dùng', path: path.adminUsers, icon: '👥', permission: Permission.USER_READ },
  { name: 'Bài viết', path: path.adminPosts, icon: '📝', permission: Permission.POST_READ },
  { name: 'Phân tích', path: path.adminAnalytics, icon: '📈', permission: Permission.STATS_VIEW },
  { name: 'Liên hệ', path: path.adminContacts, icon: '📩', permission: Permission.CONTACT_READ },
  { name: 'Cài đặt', path: path.adminSettings, icon: '⚙️', permission: Permission.CONFIG_READ },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { can } = usePermission()

  const handleLogout = () => {
    clearLS()
    navigate(path.login)
  }

  const visibleNavItems = navItems.filter((item) => can(item.permission))

  return (
    <div className='flex h-screen bg-cream-light'>
      {/* Sidebar */}
      <div className='w-64 bg-brick text-white flex flex-col'>
        <div className='p-6'>
          <Link to={path.home} className='text-xl font-bold text-cream-light'>
            Gạch Ngói Admin
          </Link>
        </div>

        <nav className='flex-1 px-4'>
          <ul className='space-y-2'>
            {visibleNavItems.map((item) => {
              const isActive = location.pathname === item.path

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brick-light text-cream-light'
                        : 'text-cream hover:bg-brick-light hover:text-cream-light'
                    }`}
                  >
                    <span className='text-lg mr-3'>{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className='p-4'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-cream hover:bg-brick-light hover:text-cream-light transition-colors'
          >
            <span className='text-lg mr-3'>🚪</span>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className='bg-white shadow-sm border-b border-cement-light p-6'>
          <h1 className='text-2xl font-bold text-earth'>Quản trị viên</h1>
        </header>

        <main className='flex-1 overflow-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}