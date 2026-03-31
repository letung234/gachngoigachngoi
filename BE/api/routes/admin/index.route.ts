import adminUserRouter from "./admin-user.route"
import adminAuthRouter from "./admin-auth.route"
import adminCategoryRouter from "./admin-category.route"
import adminProductRouter from "./admin-product.route"
import adminStatsRouter from "./admin-stats.route"
import adminConfigRouter from "./admin-config.route"
import adminOrderRouter from "./admin-order.route"
import adminPostRouter from "./admin-post.route"
import adminContactRouter from "./admin-contact.route"

const adminRoutes = {
  prefix: "/admin/",
  routes: [
    {
      path: "users",
      route: adminUserRouter
    },
    {
      path: "products",
      route: adminProductRouter
    },
    {
      path: "categories",
      route: adminCategoryRouter
    },
    {
      path: "orders",
      route: adminOrderRouter
    },
    {
      path: "posts",
      route: adminPostRouter
    },
    {
      path: "stats",
      route: adminStatsRouter
    },
    {
      path: "contacts",
      route: adminContactRouter
    },
    {
      path: "config",
      route: adminConfigRouter
    },
    {
      path: "",
      route: adminAuthRouter
    }
  ]
}

export default adminRoutes
