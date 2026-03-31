import { Request, Response, NextFunction } from 'express'
import { SiteConfigModel } from '../database/models/site-config.model'

let cachedConfig: any = null
let cacheTimestamp = 0
const CACHE_TTL = 30000

const getMaintenanceConfig = async () => {
  const now = Date.now()
  if (cachedConfig && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedConfig
  }

  const config = await SiteConfigModel.findOne().lean()
  cachedConfig = config?.maintenance || { enabled: false, message: '', allowedIPs: [] }
  cacheTimestamp = now
  return cachedConfig
}

export const clearMaintenanceCache = () => {
  cachedConfig = null
  cacheTimestamp = 0
}

const maintenanceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.originalUrl.includes('/admin')) {
      return next()
    }

    if (req.originalUrl.includes('/site-config')) {
      return next()
    }

    if (req.originalUrl.includes('/auth')) {
      return next()
    }

    const maintenance = await getMaintenanceConfig()

    if (!maintenance.enabled) {
      return next()
    }

    const clientIP = req.ip || req.socket.remoteAddress || ''
    if (maintenance.allowedIPs && maintenance.allowedIPs.length > 0) {
      const isAllowed = maintenance.allowedIPs.some((ip: string) => clientIP.includes(ip))
      if (isAllowed) {
        return next()
      }
    }

    return res.status(503).json({
      message: maintenance.message || 'Website is under maintenance',
      data: null
    })
  } catch (error) {
    return next()
  }
}

export default maintenanceMiddleware
