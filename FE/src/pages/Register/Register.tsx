import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
// Không có tính năng tree-shaking
// import { omit } from 'lodash'

// Import chỉ mỗi function omit
import omit from 'lodash/omit'

import { schema, Schema } from 'src/utils/rules'
import Input from 'src/components/Input'
import authApi from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import { Helmet } from 'react-helmet-async'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })

  return (
    <div className='min-h-screen bg-gradient-to-br from-earth to-earth-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <Helmet>
        <title>Đăng ký | Gạch Ngói</title>
        <meta name='description' content='Tạo tài khoản mới' />
      </Helmet>
      <div className='w-full max-w-md'>
        {/* Logo Section */}
        <div className='text-center mb-8'>
          <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-brick mx-auto mb-4 shadow-lg'>
            <svg viewBox='0 0 40 40' className='h-10 w-10 fill-cream-light'>
              <path d='M20 4L4 12v16l16 8 16-8V12L20 4zm0 4l12 6v12l-12 6-12-6V14l12-6z' />
              <rect x='14' y='16' width='12' height='8' rx='1' />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-cream-light'>Tạo tài khoản</h1>
          <p className='text-cream-light/70 mt-1'>Bắt đầu hành trình mua sắm của bạn</p>
        </div>

        {/* Form Card */}
        <form 
          className='bg-white rounded-2xl shadow-2xl p-8 space-y-5' 
          onSubmit={onSubmit} 
          noValidate
          autoComplete='off'
        >
          {/* Email Input */}
          <div>
            <label htmlFor='email' className='block text-sm font-semibold text-earth mb-2'>
              Địa chỉ Email
            </label>
            <Input
              name='email'
              register={register}
              type='email'
              errorMessage={errors.email?.message}
              placeholder='your@email.com'
              autoComplete='email'
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor='password' className='block text-sm font-semibold text-earth mb-2'>
              Mật khẩu
            </label>
            <Input
              name='password'
              register={register}
              type='password'
              classNameEye='absolute right-3 h-5 w-5 cursor-pointer top-1/2 -translate-y-1/2'
              errorMessage={errors.password?.message}
              placeholder='••••••••'
              autoComplete='new-password'
            />
            <p className='text-xs text-gray-500 mt-1'>Tối thiểu 6 ký tự, bao gồm chữ cái và số</p>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor='confirm_password' className='block text-sm font-semibold text-earth mb-2'>
              Xác nhận mật khẩu
            </label>
            <Input
              name='confirm_password'
              register={register}
              type='password'
              classNameEye='absolute right-3 h-5 w-5 cursor-pointer top-1/2 -translate-y-1/2'
              errorMessage={errors.confirm_password?.message}
              placeholder='••••••••'
              autoComplete='new-password'
            />
          </div>

          {/* Submit Button */}
          <div className='pt-2'>
            <Button
              className='w-full flex items-center justify-center bg-brick hover:bg-brick-dark px-4 py-3 text-base font-semibold text-white rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95'
              isLoading={registerAccountMutation.isLoading}
              disabled={registerAccountMutation.isLoading}
            >
              {registerAccountMutation.isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </div>

          {/* Divider */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200'></div>
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-gray-500 font-medium'>Hoặc</span>
            </div>
          </div>

          {/* Login Link */}
          <div className='text-center'>
            <p className='text-gray-600 text-sm'>
              Đã có tài khoản?{' '}
              <Link 
                to='/login' 
                className='font-semibold text-brick hover:text-brick-dark transition-colors'
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </form>

        {/* Terms Notice */}
        <p className='text-xs text-cream-light/70 text-center mt-6'>
          Bằng cách đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật
        </p>
      </div>
    </div>
  )
}
