import { Router } from 'express'
import siteConfigController from '../../controllers/site-config.controller'
import { wrapAsync } from '../../utils/response'

const commonConfigRouter = Router()

// Get site config (public - for frontend)
commonConfigRouter.get('/site-config', wrapAsync(siteConfigController.getSiteConfig))

export default commonConfigRouter
