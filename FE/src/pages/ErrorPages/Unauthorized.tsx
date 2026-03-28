import { Link } from 'react-router-dom'
import path from 'src/constants/path'

export default function Unauthorized() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-earth to-earth-dark flex items-center justify-center px-4'>
      <div className='text-center'>
        <div className='mb-8'>
          <h1 className='text-9xl font-bold text-brick drop-shadow-lg'>403</h1>
          <div className='mt-4'>
            <p className='text-4xl font-bold text-cream-light mb-2'>Truy cập bị từ chối</p>
            <p className='text-lg text-cream-light/80 mb-8'>
              Bạn không có quyền truy cập trang này. Vui lòng kiểm tra quyền của bạn.
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto'>
          <div className='space-y-4'>
            <p className='text-gray-700 font-medium'>
              Để truy cập trang này, bạn cần:
            </p>
            <ul className='text-left text-gray-600 space-y-2'>
              <li className='flex items-center gap-2'>
                <span className='text-brick font-bold'>•</span>
                Quyền quản trị phù hợp
              </li>
              <li className='flex items-center gap-2'>
                <span className='text-brick font-bold'>•</span>
                Vai trò được phân công đúng
              </li>
              <li className='flex items-center gap-2'>
                <span className='text-brick font-bold'>•</span>
                Liên hệ quản trị viên nếu cần
              </li>
            </ul>
          </div>

          <div className='mt-8 flex gap-4'>
            <Link
              to={path.home}
              className='flex-1 bg-brick text-white font-semibold py-2 px-4 rounded-lg hover:bg-brick-dark transition-colors'
            >
              Về trang chủ
            </Link>
            <button
              onClick={() => window.history.back()}
              className='flex-1 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors'
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
