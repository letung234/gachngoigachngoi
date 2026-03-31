import { Router } from 'express'
import contactController from '../../controllers/contact.controller'
import { wrapAsync } from '../../utils/response'

const commonContactRouter = Router()

commonContactRouter.post('/contact', wrapAsync(contactController.submitContact))

export default commonContactRouter
