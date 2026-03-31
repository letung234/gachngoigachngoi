import { Request, Response } from 'express'
import { responseSuccess, ErrorHandler } from '../utils/response'
import { ContactModel, CONTACT_STATUS } from '../database/models/contact.model'
import { STATUS } from '../constants/status'

const submitContact = async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body

  if (!name || !email || !message) {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Vui long dien day du thong tin bat buoc')
  }

  const contact = await new ContactModel({
    name,
    email,
    phone: phone || '',
    subject: subject || '',
    message,
    status: CONTACT_STATUS.NEW
  }).save()

  const response = {
    message: 'Gui lien he thanh cong',
    data: contact.toObject()
  }
  return responseSuccess(res, response)
}

const getContactList = async (req: Request, res: Response) => {
  let { page = 1, limit = 10, status, search } = req.query

  const pageNum = Number(page)
  const limitNum = Number(limit)

  const filter: any = {}

  if (status && status !== 'all') {
    filter.status = status
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ]
  }

  const [contactList, totalItems] = await Promise.all([
    ContactModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    ContactModel.countDocuments(filter)
  ])

  const response = {
    message: 'Lay danh sach lien he thanh cong',
    data: {
      contacts: contactList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages: Math.ceil(totalItems / limitNum)
      }
    }
  }
  return responseSuccess(res, response)
}

const updateContactStatus = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status, note } = req.body

  const validStatusList = Object.values(CONTACT_STATUS)
  if (!validStatusList.includes(status)) {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Trang thai khong hop le')
  }

  const updateData: any = { status }
  if (note !== undefined) {
    updateData.note = note
  }

  const contact = await ContactModel.findByIdAndUpdate(id, updateData, { new: true }).lean()

  if (!contact) {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Khong tim thay lien he')
  }

  const response = {
    message: 'Cap nhat trang thai thanh cong',
    data: contact
  }
  return responseSuccess(res, response)
}

const deleteContact = async (req: Request, res: Response) => {
  const { id } = req.params
  const contact = await ContactModel.findByIdAndDelete(id)

  if (!contact) {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Khong tim thay lien he')
  }

  const response = {
    message: 'Xoa lien he thanh cong',
    data: { deleted_count: 1 }
  }
  return responseSuccess(res, response)
}

const getContactStats = async (req: Request, res: Response) => {
  const [totalContacts, newContacts, processingContacts, doneContacts] = await Promise.all([
    ContactModel.countDocuments(),
    ContactModel.countDocuments({ status: CONTACT_STATUS.NEW }),
    ContactModel.countDocuments({ status: CONTACT_STATUS.PROCESSING }),
    ContactModel.countDocuments({ status: CONTACT_STATUS.DONE }),
  ])

  const currentYear = new Date().getFullYear()
  const monthlyStats = await ContactModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31T23:59:59`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  const response = {
    message: 'Lay thong ke lien he thanh cong',
    data: {
      total: totalContacts,
      new: newContacts,
      processing: processingContacts,
      done: doneContacts,
      monthly: monthlyStats.map((item) => ({
        month: item._id,
        count: item.count
      }))
    }
  }
  return responseSuccess(res, response)
}

const exportContacts = async (req: Request, res: Response) => {
  const { status } = req.query
  const filter: any = {}

  if (status && status !== 'all') {
    filter.status = status
  }

  const contactList = await ContactModel.find(filter)
    .sort({ createdAt: -1 })
    .lean()

  const response = {
    message: 'Xuat du lieu lien he thanh cong',
    data: contactList
  }
  return responseSuccess(res, response)
}

const contactController = {
  submitContact,
  getContactList,
  updateContactStatus,
  deleteContact,
  getContactStats,
  exportContacts
}

export default contactController
