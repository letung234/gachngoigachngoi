import mongoose, { Schema } from 'mongoose'

export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
}

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: 'categories' },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: 'users' },
    status: {
      type: String,
      enum: Object.values(POST_STATUS),
      default: POST_STATUS.DRAFT,
    },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

// Auto generate slug from title before save
PostSchema.pre('save', function (next) {
  const doc = this as any
  if (doc.isModified('title') && !doc.slug) {
    doc.slug = doc.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now()
  }
  next()
})

export const PostModel = mongoose.model('posts', PostSchema)
