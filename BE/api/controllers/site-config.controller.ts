import { Request, Response } from 'express'
import { responseSuccess, ErrorHandler } from '../utils/response'
import { SiteConfigModel } from '../database/models/site-config.model'
import { clearMaintenanceCache } from '../middleware/maintenance.middleware'
import { STATUS } from '../constants/status'
import { uploadFileCloudinary } from '../utils/cloudinary'

// Get site config (public)
const getSiteConfig = async (req: Request, res: Response) => {
  // Get or create default config
  let config: any = await SiteConfigModel.findOne().lean()

  if (!config) {
    const newConfig = await new SiteConfigModel({}).save()
    config = newConfig.toObject()
  }

  const response = {
    message: 'Lấy cấu hình thành công',
    data: config
  }
  return responseSuccess(res, response)
}

// Update site config (admin only)
const updateSiteConfig = async (req: Request, res: Response) => {
  const updateData = req.body

  // Remove _id from update data
  delete updateData._id

  let config = await SiteConfigModel.findOne()

  if (!config) {
    config = new SiteConfigModel(updateData)
    await config.save()
  } else {
    // Deep merge for nested objects
    const mergeDeep = (target: any, source: any) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {}
          mergeDeep(target[key], source[key])
        } else {
          target[key] = source[key]
        }
      }
      return target
    }

    const configObj = config.toObject()
    const merged = mergeDeep(configObj, updateData)

    await SiteConfigModel.findByIdAndUpdate(config._id, merged)
  }

  clearMaintenanceCache()

  const updatedConfig = await SiteConfigModel.findOne().lean()

  const response = {
    message: 'Cập nhật cấu hình thành công',
    data: updatedConfig
  }
  return responseSuccess(res, response)
}

// Upload logo/image for config
const uploadConfigImage = async (req: Request, res: Response) => {
  const url = await uploadFileCloudinary(req, 'config')
  const response = {
    message: 'Upload ảnh thành công',
    data: url
  }
  return responseSuccess(res, response)
}

// Reset to default config
const resetSiteConfig = async (req: Request, res: Response) => {
  await SiteConfigModel.deleteMany({})
  const newConfig = await new SiteConfigModel({}).save()

  const response = {
    message: 'Reset cấu hình thành công',
    data: newConfig.toObject()
  }
  return responseSuccess(res, response)
}

const siteConfigController = {
  getSiteConfig,
  updateSiteConfig,
  uploadConfigImage,
  resetSiteConfig
}

export default siteConfigController
