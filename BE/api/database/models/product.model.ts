import mongoose, { Schema } from 'mongoose'

// Review subdocument schema
const ReviewSchema = new Schema(
  {
    avatar: { type: String, default: '' },
    name: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 }
  },
  { timestamps: true }
)

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 160 },
    image: { type: String, required: true, maxlength: 1000 },
    images: [{ type: String, maxlength: 1000 }],
    description: { type: String },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: 'categories' },
    price: { type: Number, default: 0 },
    price_before_discount: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    specs: {
      size: { type: String, default: '' },
      thickness: { type: String, default: '' },
      weight: { type: String, default: '' },
      material: { type: String, default: '' },
      color: { type: String, default: '' },
      waterAbsorption: { type: String, default: '' },
      bendingStrength: { type: String, default: '' },
      compressiveStrength: { type: String, default: '' },
      technique: { type: String, default: '' },
      origin: { type: String, default: '' }
    },
    reviews: [ReviewSchema]
  },
  {
    timestamps: true
  }
)
export const ProductModel = mongoose.model('products', ProductSchema)
