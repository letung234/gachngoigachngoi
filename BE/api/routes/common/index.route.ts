import commonUserRouter from './common-user.route'
import commonAuthRouter from './common-auth.route'
import commonProductRouter from './common-product.route'
import commonCategoryRouter from './common-category.route'
import commonConfigRouter from './common-config.route'

const commonRoutes = {
  prefix: '/',
  routes: [
    {
      path: '',
      route: commonUserRouter
    },
    {
      path: '',
      route: commonAuthRouter
    },
    {
      path: 'products',
      route: commonProductRouter
    },
    {
      path: 'categories',
      route: commonCategoryRouter
    },
    {
      path: '',
      route: commonConfigRouter
    }
  ]
}

export default commonRoutes
