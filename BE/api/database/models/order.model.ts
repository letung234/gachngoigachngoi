import mongoose, { Schema } from 'mongoose'

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

const OrderItemSchema = new Schema({
  productId: { type: mongoose.SchemaTypes.ObjectId, ref: 'products' },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  image: { type: String },
})

const OrderSchema = new Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    phone: { type: String, required: true },
    address: { type: String },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    notes: { type: String },
    createdBy: { type: mongoose.SchemaTypes.ObjectId, ref: 'users' },
  },
  {
    timestamps: true,
  }
)

export const OrderModel = mongoose.model('orders', OrderSchema)
