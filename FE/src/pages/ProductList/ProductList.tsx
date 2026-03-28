import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import categoryApi from 'src/apis/category.api'
import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product/Product'
import SortProductList from './components/SortProductList'

export default function ProductList() {
  const queryConfig = useQueryConfig()

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <div className='min-h-screen bg-gray-50 py-6 md:py-8'>
      <Helmet>
        <title>Sản phẩm | Gạch Ngói</title>
        <meta name='description' content='Danh sách sản phẩm gạch ngói thủ công chất lượng cao' />
      </Helmet>
      <div className='container'>
        {productsData && (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-5'>
            <aside className='hidden md:block md:col-span-1'>
              <div className='sticky top-24'>
                <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
              </div>
            </aside>
            <div className='md:col-span-3 lg:col-span-4'>
              <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4'>
                {productsData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
