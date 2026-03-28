import classNames from 'classnames'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import path from 'src/constants/path'
import { Category } from 'src/types/category.type'
import { useForm, Controller } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from 'src/types/utils.type'
import RatingStars from '../RatingStars'
import omit from 'lodash/omit'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>
/**
 * Rule validate
 * Nếu có price_min và price_max thì price_max >= price_min
 * Còn không thì có price_min thì không có price_max và ngược lại
 */

const priceSchema = schema.pick(['price_min', 'price_max'])

export default function AsideFilter({ queryConfig, categories }: Props) {
  const { t } = useTranslation('home')
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema)
  })
  const navigate = useNavigate()
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    reset()
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }

  return (
    <div className='py-6 px-4 md:px-0'>
      {/* Categories Section */}
      <div className='rounded-lg bg-white p-4 shadow-sm border border-gray-100 mb-4'>
        <h3 className='font-bold text-gray-900 flex items-center gap-2 mb-4'>
          <svg viewBox='0 0 20 20' className='h-5 w-5 fill-brick'>
            <path fillRule='evenodd' d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
          </svg>
          Danh mục
        </h3>
        <Link
          to={path.home}
          className={classNames('block px-3 py-2 rounded-lg transition-all text-sm font-medium', {
            'bg-brick text-white': !category,
            'text-gray-700 hover:bg-gray-50': category
          })}
        >
          Tất cả sản phẩm
        </Link>
        <ul className='mt-2 space-y-1'>
          {categories.map((categoryItem) => {
            const isActive = category === categoryItem._id
            return (
              <li key={categoryItem._id}>
                <Link
                  to={{
                    pathname: path.home,
                    search: createSearchParams({
                      ...queryConfig,
                      category: categoryItem._id
                    }).toString()
                  }}
                  className={classNames('block px-3 py-2 rounded-lg transition-all text-sm font-medium', {
                    'bg-brick text-white': isActive,
                    'text-gray-700 hover:bg-gray-50': !isActive
                  })}
                >
                  {categoryItem.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      {/* Price Filter Section */}
      <div className='rounded-lg bg-white p-4 shadow-sm border border-gray-100 mb-4'>
        <h3 className='font-bold text-gray-900 flex items-center gap-2 mb-4'>
          <svg viewBox='0 0 20 20' className='h-5 w-5 fill-brick'>
            <path d='M8.16 5.314a.5.5 0 10-.32.94l12 4.053a.5.5 0 10.32-.94l-12-4.053zM8.16 10.314a.5.5 0 10-.32.94l12 4.053a.5.5 0 10.32-.94l-12-4.053zM8.16 15.314a.5.5 0 10-.32.94l12 4.053a.5.5 0 10.32-.94l-12-4.053z' />
            <circle cx='3' cy='5.5' r='2.5' />
            <circle cx='3' cy='10.5' r='2.5' />
            <circle cx='3' cy='15.5' r='2.5' />
          </svg>
          Khoảng giá
        </h3>
        <form className='space-y-3' onSubmit={onSubmit}>
          <div className='flex items-start gap-2'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='Từ'
                    classNameInput='p-2 w-full text-sm outline-none border border-gray-300 rounded-lg focus:border-brick focus:ring-2 focus:ring-brick/10'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                  />
                )
              }}
            />
            <span className='mt-2 text-gray-400'>—</span>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='Đến'
                    classNameInput='p-2 w-full text-sm outline-none border border-gray-300 rounded-lg focus:border-brick focus:ring-2 focus:ring-brick/10'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                  />
                )
              }}
            />
          </div>
          {errors.price_min?.message && (
            <div className='text-xs text-red-600 font-medium'>{errors.price_min.message}</div>
          )}
          <Button className='w-full bg-brick text-white hover:bg-brick-dark text-sm font-semibold py-2 rounded-lg transition-colors'>
            Áp dụng
          </Button>
        </form>
      </div>

      {/* Rating Filter Section */}
      <div className='rounded-lg bg-white p-4 shadow-sm border border-gray-100 mb-4'>
        <h3 className='font-bold text-gray-900 flex items-center gap-2 mb-4'>
          <svg viewBox='0 0 20 20' className='h-5 w-5 fill-brick'>
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
          Đánh giá
        </h3>
        <RatingStars queryConfig={queryConfig} />
      </div>

      {/* Clear All Button */}
      <Button
        onClick={handleRemoveAll}
        className='w-full bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2'
      >
        <svg viewBox='0 0 20 20' className='h-4 w-4 fill-current'>
          <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
        </svg>
        Xóa tất cả
      </Button>
    </div>
  )
}
