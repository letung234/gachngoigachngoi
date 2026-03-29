import classNames from 'classnames'

export interface PaginationData {
  page: number
  limit: number
  page_size: number
  total?: number
}

interface AdminPaginationProps {
  pagination: PaginationData
  onPageChange: (page: number) => void
  className?: string
  showInfo?: boolean
}

export default function AdminPagination({
  pagination,
  onPageChange,
  className = '',
  showInfo = true
}: AdminPaginationProps) {
  const { page, limit, page_size: pageSize, total } = pagination

  // Always show pagination if we have total count, even for single page
  if (!total || total === 0) return null

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []
    const maxButtonsToShow = 5

    if (pageSize <= maxButtonsToShow) {
      for (let i = 1; i <= pageSize; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      let start = Math.max(2, page - 1)
      let end = Math.min(pageSize - 1, page + 1)

      if (page <= 3) {
        end = 4
      } else if (page >= pageSize - 2) {
        start = pageSize - 3
      }

      if (start > 2) {
        pages.push('...')
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < pageSize - 1) {
        pages.push('...')
      }

      pages.push(pageSize)
    }

    return pages
  }

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1)
    }
  }

  const handleNext = () => {
    if (page < pageSize) {
      onPageChange(page + 1)
    }
  }

  const handlePageClick = (pageNum: number | string) => {
    if (typeof pageNum === 'number' && pageNum !== page) {
      onPageChange(pageNum)
    }
  }

  const startItem = (page - 1) * limit + 1
  const endItem = total ? Math.min(page * limit, total) : page * limit

  return (
    <div className={classNames('flex flex-col items-center gap-4 py-6', className)}>
      {/* Info Text */}
      {showInfo && total !== undefined && (
        <p className='text-sm text-gray-600'>
          Hiển thị <span className='font-semibold text-earth'>{startItem}</span> -{' '}
          <span className='font-semibold text-earth'>{endItem}</span> trong tổng số{' '}
          <span className='font-semibold text-brick'>{total.toLocaleString()}</span> mục
        </p>
      )}

      <div className='flex items-center gap-2'>
        {/* First Page Button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className={classNames(
            'flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all',
            page === 1
              ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
              : 'border-gray-200 bg-white text-gray-600 hover:border-brick hover:bg-brick/5 hover:text-brick'
          )}
          title='Trang đầu'
        >
          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 19l-7-7 7-7m8 14l-7-7 7-7' />
          </svg>
        </button>

        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className={classNames(
            'flex h-10 items-center gap-1 rounded-lg border px-3 text-sm font-semibold transition-all',
            page === 1
              ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
              : 'border-gray-200 bg-white text-gray-600 hover:border-brick hover:bg-brick/5 hover:text-brick'
          )}
        >
          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          <span className='hidden sm:inline'>Trước</span>
        </button>

        {/* Page Numbers */}
        <div className='flex items-center gap-1'>
          {getPageNumbers().map((pageNum, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(pageNum)}
              disabled={pageNum === '...'}
              className={classNames(
                'flex h-10 min-w-[40px] items-center justify-center rounded-lg text-sm font-semibold transition-all',
                pageNum === page
                  ? 'bg-gradient-to-r from-brick to-brick-dark text-white shadow-md shadow-brick/30'
                  : pageNum === '...'
                    ? 'cursor-default bg-transparent text-gray-400'
                    : 'border border-gray-200 bg-white text-gray-700 hover:border-brick hover:bg-brick/5 hover:text-brick'
              )}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={page === pageSize}
          className={classNames(
            'flex h-10 items-center gap-1 rounded-lg border px-3 text-sm font-semibold transition-all',
            page === pageSize
              ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
              : 'border-gray-200 bg-white text-gray-600 hover:border-brick hover:bg-brick/5 hover:text-brick'
          )}
        >
          <span className='hidden sm:inline'>Sau</span>
          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => onPageChange(pageSize)}
          disabled={page === pageSize}
          className={classNames(
            'flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all',
            page === pageSize
              ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
              : 'border-gray-200 bg-white text-gray-600 hover:border-brick hover:bg-brick/5 hover:text-brick'
          )}
          title='Trang cuối'
        >
          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 5l7 7-7 7M5 5l7 7-7 7' />
          </svg>
        </button>
      </div>

      {/* Quick Jump */}
      {pageSize > 5 && (
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <span>Đi đến trang:</span>
          <input
            type='number'
            min={1}
            max={pageSize}
            placeholder={String(page)}
            className='w-16 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm focus:border-brick focus:outline-none focus:ring-2 focus:ring-brick/10'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement
                const value = parseInt(target.value)
                if (value >= 1 && value <= pageSize) {
                  onPageChange(value)
                  target.value = ''
                }
              }
            }}
          />
          <span>/ {pageSize}</span>
        </div>
      )}
    </div>
  )
}
