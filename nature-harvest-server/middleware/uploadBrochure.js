const { uploadSingle } = require('./externalUpload');

// Use the external upload service for brochures (documents with 300MB limit)
const upload = uploadSingle('brochure', 'brochures', 'document', 300 * 1024 * 1024);

module.exports = upload; 