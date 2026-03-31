import commonUserRouter from './common-user.route'
import commonAuthRouter from './common-auth.route'
import commonProductRouter from './common-product.route'
import commonCategoryRouter from './common-category.route'
import commonConfigRouter from './common-config.route'
import commonPostRouter from './common-post.route'
import commonContactRouter from './common-contact.route'

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
      path: 'posts',
      route: commonPostRouter
    },
    {
      path: '',
      route: commonConfigRouter
    },
    {
      path: '',
      route: commonContactRouter
    }
  ]
}

export default commonRoutes
