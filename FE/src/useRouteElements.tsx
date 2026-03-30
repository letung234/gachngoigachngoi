import path from 'src/constants/path'
import { useContext, lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from './contexts/app.context'
import MainLayout from './layouts/MainLayout'
import CartLayout from './layouts/CartLayout'
import UserLayout from './pages/User/layouts/UserLayout'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Projects = lazy(() => import('./pages/Projects'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/User/pages/Profile'))
const Cart = lazy(() => import('./pages/Cart'))
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Admin pages
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'))
const AdminProducts = lazy(() => import('./pages/Admin/Products'))
const AdminOrders = lazy(() => import('./pages/Admin/Orders'))
const AdminCustomers = lazy(() => import('./pages/Admin/Customers'))
const AdminAnalytics = lazy(() => import('./pages/Admin/Analytics'))
const AdminSettings = lazy(() => import('./pages/Admin/Settings'))
const AdminCategories = lazy(() => import('./pages/Admin/Categories'))
const AdminUsers = lazy(() => import('./pages/Admin/Users'))
const AdminPosts = lazy(() => import('./pages/Admin/Posts'))
const AdminPostForm = lazy(() => import('./pages/Admin/PostForm'))
const AdminOrderForm = lazy(() => import('./pages/Admin/OrderForm'))
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))

// Loading component
function PageLoader() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-cream-light'>
      <div className='flex flex-col items-center gap-4'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-brick border-t-transparent' />
        <span className='text-earth/60'>{'Đang tải...'}</span>
      </div>
    </div>
  )
}

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.adminDashboard} />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    // Public routes with MainLayout
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: path.home,
          index: true,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          )
        },
        {
          path: path.products,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Products />
            </Suspense>
          )
        },
        {
          path: path.productCategory,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Products />
            </Suspense>
          )
        },
        {
          path: path.productDetail,
          element: (
            <Suspense fallback={<PageLoader />}>
              <ProductDetail />
            </Suspense>
          )
        },
        {
          path: path.projects,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Projects />
            </Suspense>
          )
        },
        {
          path: path.about,
          element: (
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          )
        },
        {
          path: path.blog,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Blog />
            </Suspense>
          )
        },
        {
          path: path.blogPost,
          element: (
            <Suspense fallback={<PageLoader />}>
              <BlogDetail />
            </Suspense>
          )
        },
        {
          path: path.projectDetail,
          element: (
            <Suspense fallback={<PageLoader />}>
              <BlogDetail />
            </Suspense>
          )
        },
        {
          path: path.contact,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Contact />
            </Suspense>
          )
        },
        {
          path: '*',
          element: (
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          )
        }
      ]
    },
    // Auth routes
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          )
        }
      ]
    },
    // Protected routes
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense fallback={<PageLoader />}>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: <MainLayout />,
          children: [
            {
              path: '',
              element: <UserLayout />,
              children: [
                {
                  path: path.profile,
                  element: (
                    <Suspense fallback={<PageLoader />}>
                      <Profile />
                    </Suspense>
                  )
                },
                {
                  path: path.changePassword,
                  element: (
                    <Suspense fallback={<PageLoader />}>
                      <ChangePassword />
                    </Suspense>
                  )
                },
                {
                  path: path.historyPurchase,
                  element: (
                    <Suspense fallback={<PageLoader />}>
                      <HistoryPurchase />
                    </Suspense>
                  )
                }
              ]
            }
          ]
        }
      ]
    },
    // Admin routes
    {
      path: path.admin,
      element: (
        <Suspense fallback={<PageLoader />}>
          <AdminLayout />
        </Suspense>
      ),
      children: [
        {
          path: path.adminDashboard,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          )
        },
        {
          path: path.adminProducts,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminProducts />
            </Suspense>
          )
        },
        {
          path: path.adminOrders,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminOrders />
            </Suspense>
          )
        },
        {
          path: path.adminOrderNew,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminOrderForm />
            </Suspense>
          )
        },
        {
          path: path.adminOrderEdit,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminOrderForm />
            </Suspense>
          )
        },
        {
          path: path.adminCustomers,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminCustomers />
            </Suspense>
          )
        },
        {
          path: path.adminCategories,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminCategories />
            </Suspense>
          )
        },
        {
          path: path.adminUsers,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminUsers />
            </Suspense>
          )
        },
        {
          path: path.adminPosts,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminPosts />
            </Suspense>
          )
        },
        {
          path: path.adminPostNew,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminPostForm />
            </Suspense>
          )
        },
        {
          path: path.adminPostEdit,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminPostForm />
            </Suspense>
          )
        },
        {
          path: path.adminAnalytics,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminAnalytics />
            </Suspense>
          )
        },
        {
          path: path.adminSettings,
          element: (
            <Suspense fallback={<PageLoader />}>
              <AdminSettings />
            </Suspense>
          )
        }
      ]
    }
  ])
  return routeElements
}
