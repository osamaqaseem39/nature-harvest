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

// Partner validation rules
const partnerValidation = {
  create: [
    body('companyName')
      .notEmpty()
      .withMessage('Company name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Company name must be between 2 and 100 characters'),
    body('contactPerson')
      .notEmpty()
      .withMessage('Contact person name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Contact person name must be between 2 and 100 characters'),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('phone')
      .notEmpty()
      .withMessage('Phone number is required')
      .isLength({ min: 10, max: 20 })
      .withMessage('Phone number must be between 10 and 20 characters'),
    body('companyType')
      .notEmpty()
      .withMessage('Company type is required')
      .isIn(['Distributor', 'Retailer', 'Wholesaler', 'Restaurant', 'Cafe', 'Hotel', 'Supermarket', 'Other'])
      .withMessage('Invalid company type'),
    body('businessDescription')
      .notEmpty()
      .withMessage('Business description is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Business description must be between 10 and 1000 characters'),
    body('partnershipType')
      .notEmpty()
      .withMessage('Partnership type is required')
      .isArray({ min: 1 })
      .withMessage('At least one partnership type must be selected'),
    body('partnershipType.*')
      .isIn(['Distribution', 'Retail', 'Wholesale', 'Co-branding', 'Joint Marketing', 'Product Development', 'Other'])
      .withMessage('Invalid partnership type'),
    body('targetMarkets')
      .notEmpty()
      .withMessage('Target markets are required')
      .isArray({ min: 1 })
      .withMessage('At least one target market must be specified'),
    body('targetMarkets.*')
      .isLength({ min: 2, max: 100 })
      .withMessage('Target market must be between 2 and 100 characters'),
    body('annualRevenue')
      .notEmpty()
      .withMessage('Annual revenue information is required')
      .isIn(['Under $100K', '$100K - $500K', '$500K - $1M', '$1M - $5M', '$5M - $10M', 'Over $10M', 'Prefer not to say'])
      .withMessage('Invalid annual revenue selection'),
    body('employeeCount')
      .notEmpty()
      .withMessage('Employee count is required')
      .isIn(['1-10', '11-50', '51-100', '101-500', '500+', 'Prefer not to say'])
      .withMessage('Invalid employee count selection'),
    body('website')
      .optional()
      .isURL()
      .withMessage('Please enter a valid website URL'),
    body('socialMedia.linkedin')
      .optional()
      .isURL()
      .withMessage('Please enter a valid LinkedIn URL'),
    body('socialMedia.facebook')
      .optional()
      .isURL()
      .withMessage('Please enter a valid Facebook URL'),
    body('socialMedia.instagram')
      .optional()
      .isURL()
      .withMessage('Please enter a valid Instagram URL'),
    body('socialMedia.twitter')
      .optional()
      .isURL()
      .withMessage('Please enter a valid Twitter URL'),
    body('additionalInfo')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Additional information cannot exceed 1000 characters')
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

// Career validation rules
const careerValidation = {
  // Job validation
  job: {
    create: [
      body('title')
        .notEmpty()
        .withMessage('Job title is required')
        .isLength({ min: 5, max: 100 })
        .withMessage('Job title must be between 5 and 100 characters'),
      body('department')
        .notEmpty()
        .withMessage('Department is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Department must be between 2 and 50 characters'),
      body('location')
        .notEmpty()
        .withMessage('Job location is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters'),
      body('type')
        .notEmpty()
        .withMessage('Job type is required')
        .isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'])
        .withMessage('Invalid job type'),
      body('experience')
        .notEmpty()
        .withMessage('Experience level is required')
        .isIn(['Entry Level', 'Mid Level', 'Senior Level', 'Executive'])
        .withMessage('Invalid experience level'),
      body('description')
        .notEmpty()
        .withMessage('Job description is required')
        .isLength({ min: 50, max: 2000 })
        .withMessage('Job description must be between 50 and 2000 characters'),
      body('requirements')
        .notEmpty()
        .withMessage('Job requirements are required')
        .isArray({ min: 1 })
        .withMessage('At least one requirement must be specified'),
      body('requirements.*')
        .isLength({ min: 5, max: 200 })
        .withMessage('Each requirement must be between 5 and 200 characters'),
      body('responsibilities')
        .notEmpty()
        .withMessage('Job responsibilities are required')
        .isArray({ min: 1 })
        .withMessage('At least one responsibility must be specified'),
      body('responsibilities.*')
        .isLength({ min: 5, max: 200 })
        .withMessage('Each responsibility must be between 5 and 200 characters'),
      body('benefits')
        .optional()
        .isArray()
        .withMessage('Benefits must be an array'),
      body('benefits.*')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Each benefit must be between 5 and 200 characters'),
      body('salary.min')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum salary must be a positive number'),
      body('salary.max')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum salary must be a positive number'),
      body('salary.currency')
        .optional()
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency must be 3 characters (e.g., USD)'),
      body('salary.period')
        .optional()
        .isIn(['Hourly', 'Monthly', 'Yearly'])
        .withMessage('Invalid salary period'),
      body('skills')
        .optional()
        .isArray()
        .withMessage('Skills must be an array'),
      body('skills.*')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Each skill must be between 2 and 50 characters'),
      body('education')
        .notEmpty()
        .withMessage('Education requirement is required')
        .isIn(['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Any'])
        .withMessage('Invalid education requirement'),
      body('applicationDeadline')
        .notEmpty()
        .withMessage('Application deadline is required')
        .isISO8601()
        .withMessage('Invalid date format'),
      body('positions')
        .notEmpty()
        .withMessage('Number of positions is required')
        .isInt({ min: 1 })
        .withMessage('At least 1 position must be available'),
      body('isRemote')
        .optional()
        .isBoolean()
        .withMessage('isRemote must be a boolean'),
      body('isUrgent')
        .optional()
        .isBoolean()
        .withMessage('isUrgent must be a boolean'),
      body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
      body('tags.*')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Each tag must be between 2 and 50 characters')
    ],
    update: [
      param('id')
        .isMongoId()
        .withMessage('Invalid job ID'),
      body('title')
        .optional()
        .isLength({ min: 5, max: 100 })
        .withMessage('Job title must be between 5 and 100 characters'),
      body('department')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Department must be between 2 and 50 characters'),
      body('location')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters'),
      body('type')
        .optional()
        .isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'])
        .withMessage('Invalid job type'),
      body('experience')
        .optional()
        .isIn(['Entry Level', 'Mid Level', 'Senior Level', 'Executive'])
        .withMessage('Invalid experience level'),
      body('description')
        .optional()
        .isLength({ min: 50, max: 2000 })
        .withMessage('Job description must be between 50 and 2000 characters'),
      body('requirements')
        .optional()
        .isArray({ min: 1 })
        .withMessage('At least one requirement must be specified'),
      body('requirements.*')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Each requirement must be between 5 and 200 characters'),
      body('responsibilities')
        .optional()
        .isArray({ min: 1 })
        .withMessage('At least one responsibility must be specified'),
      body('responsibilities.*')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Each responsibility must be between 5 and 200 characters'),
      body('benefits')
        .optional()
        .isArray()
        .withMessage('Benefits must be an array'),
      body('benefits.*')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Each benefit must be between 5 and 200 characters'),
      body('salary.min')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum salary must be a positive number'),
      body('salary.max')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum salary must be a positive number'),
      body('salary.currency')
        .optional()
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency must be 3 characters (e.g., USD)'),
      body('salary.period')
        .optional()
        .isIn(['Hourly', 'Monthly', 'Yearly'])
        .withMessage('Invalid salary period'),
      body('skills')
        .optional()
        .isArray()
        .withMessage('Skills must be an array'),
      body('skills.*')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Each skill must be between 2 and 50 characters'),
      body('education')
        .optional()
        .isIn(['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Any'])
        .withMessage('Invalid education requirement'),
      body('applicationDeadline')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
      body('positions')
        .optional()
        .isInt({ min: 1 })
        .withMessage('At least 1 position must be available'),
      body('isRemote')
        .optional()
        .isBoolean()
        .withMessage('isRemote must be a boolean'),
      body('isUrgent')
        .optional()
        .isBoolean()
        .withMessage('isUrgent must be a boolean'),
      body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
      body('tags.*')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Each tag must be between 2 and 50 characters'),
      body('status')
        .optional()
        .isIn(['Draft', 'Published', 'Closed', 'Archived'])
        .withMessage('Invalid status')
    ]
  },
  // Application validation
  application: {
    submit: [
      body('jobId')
        .notEmpty()
        .withMessage('Job ID is required')
        .isMongoId()
        .withMessage('Invalid job ID'),
      body('candidateData.firstName')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
      body('candidateData.lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
      body('candidateData.email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
      body('candidateData.phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters'),
      body('candidateData.dateOfBirth')
        .notEmpty()
        .withMessage('Date of birth is required')
        .isISO8601()
        .withMessage('Invalid date format'),
      body('candidateData.gender')
        .optional()
        .isIn(['Male', 'Female', 'Other', 'Prefer not to say'])
        .withMessage('Invalid gender selection'),
      body('candidateData.address.street')
        .notEmpty()
        .withMessage('Street address is required')
        .isLength({ min: 5, max: 200 })
        .withMessage('Street address must be between 5 and 200 characters'),
      body('candidateData.address.city')
        .notEmpty()
        .withMessage('City is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters'),
      body('candidateData.address.state')
        .notEmpty()
        .withMessage('State/Province is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('State/Province must be between 2 and 100 characters'),
      body('candidateData.address.zipCode')
        .notEmpty()
        .withMessage('ZIP/Postal code is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('ZIP/Postal code must be between 3 and 20 characters'),
      body('candidateData.address.country')
        .notEmpty()
        .withMessage('Country is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Country must be between 2 and 100 characters'),
      body('candidateData.education')
        .notEmpty()
        .withMessage('Education information is required')
        .isArray({ min: 1 })
        .withMessage('At least one education entry is required'),
      body('candidateData.education.*.degree')
        .notEmpty()
        .withMessage('Degree is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Degree must be between 2 and 100 characters'),
      body('candidateData.education.*.institution')
        .notEmpty()
        .withMessage('Institution is required')
        .isLength({ min: 2, max: 200 })
        .withMessage('Institution must be between 2 and 200 characters'),
      body('candidateData.education.*.fieldOfStudy')
        .notEmpty()
        .withMessage('Field of study is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Field of study must be between 2 and 100 characters'),
      body('candidateData.education.*.startDate')
        .notEmpty()
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Invalid start date format'),
      body('candidateData.education.*.endDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid end date format'),
      body('candidateData.education.*.gpa')
        .optional()
        .isFloat({ min: 0, max: 4 })
        .withMessage('GPA must be between 0 and 4'),
      body('candidateData.experience')
        .optional()
        .isArray()
        .withMessage('Experience must be an array'),
      body('candidateData.experience.*.title')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Job title must be between 2 and 100 characters'),
      body('candidateData.experience.*.company')
        .optional()
        .isLength({ min: 2, max: 200 })
        .withMessage('Company name must be between 2 and 200 characters'),
      body('candidateData.experience.*.startDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid start date format'),
      body('candidateData.experience.*.endDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid end date format'),
      body('candidateData.experience.*.description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
      body('candidateData.skills')
        .optional()
        .isArray()
        .withMessage('Skills must be an array'),
      body('candidateData.skills.*.name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Skill name must be between 2 and 100 characters'),
      body('candidateData.skills.*.level')
        .optional()
        .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
        .withMessage('Invalid skill level'),
      body('candidateData.skills.*.yearsOfExperience')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Years of experience must be a positive number'),
      body('candidateData.resume.url')
        .notEmpty()
        .withMessage('Resume is required'),
      body('coverLetter.content')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Cover letter cannot exceed 2000 characters'),
      body('additionalDocuments')
        .optional()
        .isArray()
        .withMessage('Additional documents must be an array'),
      body('additionalDocuments.*.name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Document name must be between 2 and 100 characters'),
      body('additionalDocuments.*.url')
        .optional()
        .isURL()
        .withMessage('Invalid document URL')
    ]
  }
};

module.exports = {
  brandValidation,
  productValidation,
  flavorValidation,
  sizeValidation,
  authValidation,
  commonValidation,
  partnerValidation,
  careerValidation
};