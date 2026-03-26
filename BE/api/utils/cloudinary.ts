import { v2 as cloudinary } from 'cloudinary'
import { Request } from 'express'
import { IncomingForm } from 'formidable'
import { ErrorHandler } from './response'
import { STATUS } from '../constants/status'
import { isEmpty } from 'lodash'
import { config } from '../constants/config'

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY_SECRET
})

/**
 * Upload single image to Cloudinary
 * @param image - File object from formidable
 * @param folder - Folder name in Cloudinary (e.g., 'products', 'avatars')
 * @returns Promise<string> - Cloudinary image URL
 */
const uploadToCloudinary = (image: any, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      image.path,
      {
        folder: `gachngoi/${folder}`,
        resource_type: 'image',
        transformation: [
          { width: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          return reject(new ErrorHandler(STATUS.INTERNAL_SERVER_ERROR, 'Lỗi upload ảnh lên Cloudinary'))
        }
        resolve(result?.secure_url || '')
      }
    )
  })
}

/**
 * Upload single file to Cloudinary
 * @param req - Express Request object
 * @param folder - Folder name in Cloudinary
 * @returns Promise<string> - Image URL
 */
export const uploadFileCloudinary = (req: Request, folder = ''): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const form: any = new IncomingForm()
    form.parse(req, function (error, fields, files) {
      if (error) {
        return reject(error)
      }
      try {
        const { image }: { image: any } = files
        const errorEntity: any = {}

        if (!image) {
          errorEntity.image = 'Không tìm thấy image'
        } else if (!image.type.includes('image')) {
          errorEntity.image = 'image không đúng định dạng'
        }

        if (!isEmpty(errorEntity)) {
          return reject(new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, errorEntity))
        }

        uploadToCloudinary(image, folder)
          .then((url: string) => {
            resolve(url)
          })
          .catch((err) => {
            reject(err)
          })
      } catch (err) {
        reject(err)
      }
    })
  })
}

/**
 * Upload multiple files to Cloudinary
 * @param req - Express Request object
 * @param folder - Folder name in Cloudinary
 * @returns Promise<string[]> - Array of image URLs
 */
export const uploadManyFileCloudinary = (req: Request, folder = ''): Promise<string[]> => {
  return new Promise<string[]>((resolve, reject) => {
    const form: any = new IncomingForm({ multiples: true })
    form.parse(req, function (error, fields, files) {
      if (error) {
        return reject(error)
      }
      try {
        const { images }: { images: any[] } = files
        const errorEntity: any = {}

        if (!images) {
          errorEntity.image = 'Không tìm thấy images'
        } else if (images.some((image) => !image.type.includes('image'))) {
          errorEntity.image = 'image không đúng định dạng'
        }

        if (!isEmpty(errorEntity)) {
          return reject(new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, errorEntity))
        }

        const chainUpload = images.map((image) => {
          return uploadToCloudinary(image, folder)
        })

        Promise.all(chainUpload)
          .then((urls: string[]) => {
            resolve(urls)
          })
          .catch((err) => {
            reject(err)
          })
      } catch (err) {
        reject(err)
      }
    })
  })
}

/**
 * Delete image from Cloudinary
 * @param imageUrl - Full Cloudinary image URL
 */
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/')
    const fileWithExt = urlParts[urlParts.length - 1]
    const fileName = fileWithExt.split('.')[0]
    const folder = urlParts.slice(-2, -1)[0]
    const publicId = `gachngoi/${folder}/${fileName}`

    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
  }
}

/**
 * Delete multiple images from Cloudinary
 * @param imageUrls - Array of Cloudinary image URLs
 */
export const deleteManyFromCloudinary = async (imageUrls: string[]): Promise<void> => {
  try {
    await Promise.all(imageUrls.map((url) => deleteFromCloudinary(url)))
  } catch (error) {
    console.error('Error deleting multiple images from Cloudinary:', error)
  }
}
