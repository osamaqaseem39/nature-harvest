const { uploadSingle } = require('./externalUpload');

// Use the external upload service for flavor images
const upload = uploadSingle('image', 'flavors');

module.exports = upload; 