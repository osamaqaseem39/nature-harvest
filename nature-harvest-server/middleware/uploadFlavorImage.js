const { upload, uploadToExternalService } = require('./externalUpload');

// Optional upload middleware for flavor images:
// - If a file is provided in field 'image', upload it and set req.fileUrl
// - If no file is provided, continue without error
const optionalFlavorImageUpload = [
	upload.single('image'),
	async (req, res, next) => {
		try {
			if (!req.file) {
				return next();
			}

			const result = await uploadToExternalService(req.file, 'flavors');
			req.uploadResult = result;
			req.fileUrl = result.url;
			return next();
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error.message
			});
		}
	}
];

module.exports = optionalFlavorImageUpload;