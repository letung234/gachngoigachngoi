import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
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
import path from 'src/constants/path'

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
        navigate(path.adminDashboard)
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

  const TEXT = {
    title: 'Đăng nhập Admin | Gạch Ngói',
    metaDesc: 'Đăng nhập quản trị hệ thống',
    brand: 'Gạch Ngói',
    subtitle: 'Hệ thống quản trị',
    heading: 'Đăng nhập Admin',
    emailLabel: 'Email',
    passwordLabel: 'Mật khẩu',
    submitting: 'Đang đăng nhập...',
    submit: 'Đăng nhập',
    security: 'Kết nối an toàn. Dữ liệu được mã hóa bảo vệ.',
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-earth via-earth-dark to-brick/90 px-4 py-12 sm:px-6 lg:px-8'>
      <Helmet>
        <title>{TEXT.title}</title>
        <meta name='description' content={TEXT.metaDesc} />
      </Helmet>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='mb-8 text-center'>
          <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-brick shadow-xl shadow-brick/30'>
            <svg viewBox='0 0 40 40' className='h-12 w-12 fill-cream-light'>
              <path d='M20 4L4 12v16l16 8 16-8V12L20 4zm0 4l12 6v12l-12 6-12-6V14l12-6z' />
              <rect x='14' y='16' width='12' height='8' rx='1' />
            </svg>
          </div>
          <h1 className='font-serif text-3xl font-bold text-cream-light'>{TEXT.brand}</h1>
          <p className='mt-2 text-sm text-cream-light/60'>{TEXT.subtitle}</p>
        </div>

        {/* Form */}
        <form
          className='rounded-2xl bg-white p-8 shadow-2xl'
          onSubmit={onSubmit}
          noValidate
          autoComplete='off'
        >
          <h2 className='mb-6 text-center text-xl font-bold text-earth-dark'>{TEXT.heading}</h2>

          {/* Email */}
          <div className='mb-5'>
            <label htmlFor='email' className='mb-2 block text-sm font-semibold text-earth'>
              {TEXT.emailLabel}
            </label>
            <Input
              name='email'
              register={register}
              type='email'
              errorMessage={errors.email?.message}
              placeholder='admin@example.com'
              autoComplete='email'
            />
          </div>

          {/* Password */}
          <div className='mb-6'>
            <label htmlFor='password' className='mb-2 block text-sm font-semibold text-earth'>
              {TEXT.passwordLabel}
            </label>
            <Input
              name='password'
              register={register}
              type='password'
              classNameEye='absolute right-3 h-5 w-5 cursor-pointer top-1/2 -translate-y-1/2'
              errorMessage={errors.password?.message}
              placeholder='********'
              autoComplete='current-password'
            />
          </div>

          {/* Submit */}
          <Button
            type='submit'
            className='flex w-full items-center justify-center rounded-lg bg-brick px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-brick-dark hover:shadow-lg active:scale-[0.98]'
            isLoading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? TEXT.submitting : TEXT.submit}
          </Button>
        </form>

        {/* Security */}
        <div className='mt-6 rounded-lg border border-cream-light/20 bg-white/5 p-4 backdrop-blur-sm'>
          <p className='flex items-center justify-center gap-2 text-xs font-medium text-cream-light/70'>
            <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
            </svg>
            {TEXT.security}
          </p>
        </div>
      </div>
    </div>
  )
}
