const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const path = require('path');

// Configure memory storage for multer (we'll upload to external service)
const storage = multer.memoryStorage();

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// File filter for documents
const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|ppt|pptx|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /pdf|powerpoint|msword|vnd\.openxmlformats-officedocument/.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, PPT, DOC, DOCX files are allowed!'));
  }
};

// Configure multer with options
const createUpload = (fileFilter, fileSizeLimit = 5 * 1024 * 1024) => {
  return multer({
    storage: storage,
    limits: {
      fileSize: fileSizeLimit,
    },
    fileFilter: fileFilter
  });
};

// Function to upload file to external service
const uploadToExternalService = async (file, folder = '') => {
  try {
    const formData = new FormData();
    
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `${folder ? folder + '-' : ''}${uniqueSuffix}${ext}`;
    
    // Append file to form data
    formData.append('file', file.buffer, {
      filename: filename,
      contentType: file.mimetype
    });
    
    // Add folder parameter if specified
    if (folder) {
      formData.append('folder', folder);
    }

    // Upload to external service
    const response = await axios.post('https://natureharvest.osamaqaseem.online/upload.php', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000 // 30 second timeout
    });

    if (response.data && response.data.success) {
      return {
        success: true,
        url: response.data.url || `https://natureharvest.osamaqaseem.online/uploads/${filename}`,
        filename: filename
      };
    } else {
      throw new Error(response.data?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('External upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Middleware for single file upload
const uploadSingle = (fieldName, folder = '', fileType = 'image', fileSizeLimit = 5 * 1024 * 1024) => {
  const fileFilter = fileType === 'document' ? documentFilter : imageFilter;
  const upload = createUpload(fileFilter, fileSizeLimit);
  
  return [
    upload.single(fieldName),
    async (req, res, next) => {
      try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'No file uploaded'
          });
        }

        const uploadResult = await uploadToExternalService(req.file, folder);
        
        // Add the upload result to the request object
        req.uploadResult = uploadResult;
        req.fileUrl = uploadResult.url;
        
        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
    }
  ];
};

// Middleware for multiple file uploads
const uploadMultiple = (fieldName, maxCount = 5, folder = '', fileType = 'image', fileSizeLimit = 5 * 1024 * 1024) => {
  const fileFilter = fileType === 'document' ? documentFilter : imageFilter;
  const upload = createUpload(fileFilter, fileSizeLimit);
  
  return [
    upload.array(fieldName, maxCount),
    async (req, res, next) => {
      try {
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'No files uploaded'
          });
        }

        const uploadResults = [];
        
        for (const file of req.files) {
          const uploadResult = await uploadToExternalService(file, folder);
          uploadResults.push(uploadResult);
        }
        
        // Add the upload results to the request object
        req.uploadResults = uploadResults;
        req.fileUrls = uploadResults.map(result => result.url);
        
        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
    }
  ];
};

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files.'
      });
    }
  }
  
  if (err.message.includes('Only image files') || err.message.includes('Only PDF, PPT, DOC, DOCX files')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next(err);
};

module.exports = {
  upload: createUpload(imageFilter),
  uploadSingle,
  uploadMultiple,
  uploadToExternalService,
  handleUploadError
}; 