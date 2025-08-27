const { body, param, query } = require('express-validator');

// Brand validation rules
const brandValidation = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('Brand name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Brand name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters'),
    body('status')
      .optional()
      .isIn(['Active', 'Inactive'])
      .withMessage('Status must be either Active or Inactive')
  ],
  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid brand ID'),
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Brand name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters'),
    body('status')
      .optional()
      .isIn(['Active', 'Inactive'])
      .withMessage('Status must be either Active or Inactive')
  ]
};

// Product validation rules
const productValidation = {
  create: [
    body('brandId')
      .notEmpty()
      .withMessage('Brand ID is required')
      .isMongoId()
      .withMessage('Invalid brand ID'),
    body('name')
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Product name must be between 2 and 100 characters'),
    body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('sizeId')
      .optional()
      .isMongoId()
      .withMessage('Invalid size ID'),
    body('flavorId')
      .optional()
      .isMongoId()
      .withMessage('Invalid flavor ID'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Invalid image URL'),
    body('gallery')
      .optional()
      .isArray()
      .withMessage('Gallery must be an array'),
    body('gallery.*')
      .optional()
      .isURL()
      .withMessage('Invalid gallery image URL'),
    body('nutrients.calories')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Calories must be a positive number'),
    body('nutrients.protein')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Protein must be a positive number'),
    body('nutrients.carbohydrates')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Carbohydrates must be a positive number'),
    body('nutrients.fat')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Fat must be a positive number'),
    body('nutrients.fiber')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Fiber must be a positive number'),
    body('nutrients.sugar')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Sugar must be a positive number'),
    body('nutrients.sodium')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Sodium must be a positive number'),
    body('nutrients.vitaminC')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Vitamin C must be a positive number'),
    body('nutrients.vitaminA')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Vitamin A must be a positive number'),
    body('nutrients.calcium')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Calcium must be a positive number'),
    body('nutrients.iron')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Iron must be a positive number'),
    body('status')
      .optional()
      .isIn(['Active', 'Inactive'])
      .withMessage('Status must be either Active or Inactive')
  ],
  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID'),
    body('brandId')
      .optional()
      .isMongoId()
      .withMessage('Invalid brand ID'),
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Product name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('sizeId')
      .optional()
      .isMongoId()
      .withMessage('Invalid size ID'),
    body('flavorId')
      .optional()
      .isMongoId()
      .withMessage('Invalid flavor ID'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Invalid image URL'),
    body('gallery')
      .optional()
      .isArray()
      .withMessage('Gallery must be an array'),
    body('gallery.*')
      .optional()
      .isURL()
      .withMessage('Invalid gallery image URL'),
    body('nutrients.calories')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Calories must be a positive number'),
    body('nutrients.protein')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Protein must be a positive number'),
    body('nutrients.carbohydrates')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Carbohydrates must be a positive number'),
    body('nutrients.fat')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Fat must be a positive number'),
    body('nutrients.fiber')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Fiber must be a positive number'),
    body('nutrients.sugar')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Sugar must be a positive number'),
    body('nutrients.sodium')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Sodium must be a positive number'),
    body('nutrients.vitaminC')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Vitamin C must be a positive number'),
    body('nutrients.vitaminA')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Vitamin A must be a positive number'),
    body('nutrients.calcium')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Calcium must be a positive number'),
    body('nutrients.iron')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Iron must be a positive number'),
    body('status')
      .optional()
      .isIn(['Active', 'Inactive'])
      .withMessage('Status must be either Active or Inactive')
  ]
};

// Flavor validation rules
const flavorValidation = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('Flavor name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Flavor name must be between 2 and 100 characters'),
    body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Invalid image URL'),
    body('status')
      .optional()
      .isIn(['Active', 'Inactive'])
      .withMessage('Status must be either Active or Inactive')
  ],
  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid flavor ID'),
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Flavor name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Invalid image URL'),
    body('status')
      .optional()
      .isIn(['Active', 'Inactive'])
      .withMessage('Status must be either Active or Inactive')
  ]
};

// Size validation rules
const sizeValidation = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('Size name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Size name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Invalid image URL'),
    body('status')
      .optional()
      .isIn(['Active', 'Inactive'])
      .withMessage('Status must be either Active or Inactive')
  ],
  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid size ID'),
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Size name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Invalid image URL'),
    body('status')
      .optional()
      .isIn(['Active', 'Inactive'])
      .withMessage('Status must be either Active or Inactive')
  ]
};

// Auth validation rules
const authValidation = {
  register: [
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters'),
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .optional()
      .isIn(['Admin', 'Manager'])
      .withMessage('Role must be either Admin or Manager')
  ],
  login: [
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ]
};

// Common validation rules
const commonValidation = {
  mongoId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format')
  ]
};

module.exports = {
  brandValidation,
  productValidation,
  flavorValidation,
  sizeValidation,
  authValidation,
  commonValidation
};