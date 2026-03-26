import { Router } from 'express'
import siteConfigController from '../controllers/site-config.controller'
import { wrapAsync } from '../utils/response'

const commonRouter = Router()

// Get site config (public - for frontend)
commonRouter.get('/site-config', wrapAsync(siteConfigController.getSiteConfig))

export default commonRouter
