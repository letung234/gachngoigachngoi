import { memo, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

function ButtonInner(props: ButtonProps) {
  const {
    className = '',
    isLoading,
    disabled,
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    ...rest
  } = props

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95'

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  }

  const variantStyles = {
    primary: 'bg-gradient-to-r from-brick to-brick-dark text-white hover:from-brick-dark hover:to-brick focus:ring-brick/30 shadow-md hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-300 border border-gray-300 hover:border-gray-400',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-300 shadow-md hover:shadow-xl',
    warning: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 focus:ring-amber-300 shadow-md hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-300 shadow-md hover:shadow-xl',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-200 transition-colors',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-200 hover:border-gray-400 transition-colors'
  }

  const finalClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim()

  return (
    <button className={finalClassName} disabled={disabled || isLoading} {...rest}>
      {isLoading && (
        <div className='animate-spin'>
          <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        </div>
      )}
      {!isLoading && icon && iconPosition === 'left' && icon}
      <span className='transition-all duration-200'>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && icon}
    </button>
  )
}

export default memo(ButtonInner)