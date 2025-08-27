const { uploadSingle } = require('./externalUpload');

// Use the external upload service for brand/category images
const upload = uploadSingle('image', 'brand-category');

module.exports = upload; 