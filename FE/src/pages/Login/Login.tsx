import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import Input from 'src/components/Input'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import { Helmet } from 'react-helmet-async'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.login(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='min-h-screen bg-gradient-to-br from-earth to-earth-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <Helmet>
        <title>Đăng nhập | Gạch Ngói</title>
        <meta name='description' content='Đăng nhập vào tài khoản của bạn' />
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
          <h1 className='text-3xl font-bold text-cream-light'>Gạch Ngói</h1>
          <p className='text-cream-light/70 mt-1'>Đăng nhập vào tài khoản của bạn</p>
        </div>

        {/* Form Card */}
        <form 
          className='bg-white rounded-2xl shadow-2xl p-8 space-y-6' 
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
            <div className='flex items-center justify-between mb-2'>
              <label htmlFor='password' className='block text-sm font-semibold text-earth'>
                Mật khẩu
              </label>
              <a href='#' className='text-xs text-brick hover:text-brick-dark font-medium'>
                Quên mật khẩu?
              </a>
            </div>
            <Input
              name='password'
              register={register}
              type='password'
              classNameEye='absolute right-3 h-5 w-5 cursor-pointer top-1/2 -translate-y-1/2'
              errorMessage={errors.password?.message}
              placeholder='••••••••'
              autoComplete='current-password'
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type='submit'
              className='w-full flex items-center justify-center bg-brick hover:bg-brick-dark px-4 py-3 text-base font-semibold text-white rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95'
              isLoading={loginMutation.isLoading}
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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

          {/* Register Link */}
          <div className='text-center'>
            <p className='text-gray-600 text-sm'>
              Chưa có tài khoản?{' '}
              <Link 
                to='/register' 
                className='font-semibold text-brick hover:text-brick-dark transition-colors'
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </form>

        {/* Security Notice */}
        <div className='mt-6 p-4 bg-brick/10 rounded-lg border border-brick/20'>
          <p className='text-xs text-earth font-medium flex items-center gap-2'>
            <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M5.293 9.707a1 1 0 010-1.414L10 3.586l4.707 4.707a1 1 0 01-1.414 1.414L11 6.414V15a1 1 0 11-2 0V6.414L6.707 9.707a1 1 0 01-1.414 0z' clipRule='evenodd' />
            </svg>
            Kết nối an toàn với SSL. Dữ liệu của bạn được bảo vệ.
          </p>
        </div>
      </div>
    </div>
  )
}
