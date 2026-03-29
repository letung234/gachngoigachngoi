import { body, query } from 'express-validator'

const addCategoryRules = () => {
  return [
    body('name').exists({ checkFalsy: true }).withMessage("Tên không được để trống").isLength({ max: 160 }).withMessage("Tên phải ít hơn 160 kí tự"),
  ]
}

const updateCategoryRules = () => {
  return addCategoryRules()
}

const getCategoryRules = () => {
  return [
    query('exclude')
      .if((value: any) => value)
      .isMongoId()
      .withMessage('exclude không đúng định dạng'),
    query('page')
      .if((value: any) => value !== undefined)
      .isInt({ min: 1 })
      .withMessage('page phải là số nguyên dương'),
    query('limit')
      .if((value: any) => value !== undefined)
      .isInt({ min: 1, max: 100 })
      .withMessage('limit phải là số nguyên từ 1 đến 100'),
    query('search')
      .if((value: any) => value !== undefined)
      .isLength({ max: 255 })
      .withMessage('search không được vượt quá 255 ký tự'),
    query('sort_by')
      .if((value: any) => value !== undefined)
      .isIn(['createdAt', 'name', 'order'])
      .withMessage('sort_by phải là createdAt, name hoặc order'),
    query('order')
      .if((value: any) => value !== undefined)
      .isIn(['asc', 'desc'])
      .withMessage('order phải là asc hoặc desc'),
  ]
}


const categoryMiddleware = { addCategoryRules, updateCategoryRules, getCategoryRules }

export default categoryMiddleware