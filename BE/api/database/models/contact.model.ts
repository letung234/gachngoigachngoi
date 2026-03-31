import mongoose, { Schema } from 'mongoose'

const CONTACT_STATUS = {
  NEW: 'new',
  PROCESSING: 'processing',
  DONE: 'done'
} as const

const ContactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(CONTACT_STATUS),
      default: CONTACT_STATUS.NEW
    },
    note: { type: String, default: '' },
  },
  {
    timestamps: true
  }
)

export const ContactModel = mongoose.model('contacts', ContactSchema)
export { CONTACT_STATUS }
