import { userUserRouter } from "./user-user.route";

const userRoutes = {
  prefix: '/',
  routes: [
    {
      path: 'user',
      route: userUserRouter
    }
  ]
}

export default userRoutes