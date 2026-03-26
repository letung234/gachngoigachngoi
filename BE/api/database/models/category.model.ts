import mongoose, { Schema } from 'mongoose'

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
)

export const CategoryModel = mongoose.model('categories', CategorySchema)
