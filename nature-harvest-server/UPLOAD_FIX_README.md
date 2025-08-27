# Upload Service Fix

## Problem
The server was failing with the error:
```
Error: ENOENT: no such file or directory, mkdir '/var/task/nature-harvest-server/uploads/flavors'
```

This occurred because the server was trying to create local directories for file uploads, which is not possible in serverless environments like Vercel.

## Solution
Implemented an external upload service that uploads files to `natureharvest.osamaqaseem.online/upload.php` instead of storing them locally.

## Changes Made

### 1. New External Upload Middleware (`middleware/externalUpload.js`)
- Created a new middleware that uses `multer.memoryStorage()` instead of `diskStorage`
- Files are uploaded to the external service at `https://natureharvest.osamaqaseem.online/upload.php`
- Supports both image and document file types
- Handles different file size limits (5MB for images, 300MB for documents)
- Returns file URLs instead of local file paths

### 2. Updated Upload Middleware Files
- `middleware/uploadFlavorImage.js` - Now uses external upload service
- `middleware/uploadBrandCategoryImage.js` - Now uses external upload service  
- `middleware/uploadBrochure.js` - Now uses external upload service

### 3. Updated Controllers
- `controllers/flavorController.js` - Uses `req.fileUrl` instead of `req.file.filename`
- `controllers/brandController.js` - Uses `req.fileUrl` instead of `req.file.filename`
- `controllers/categoryController.js` - Uses `req.fileUrl` instead of `req.file.path`
- `controllers/subcategoryController.js` - Uses `req.fileUrl` instead of `req.file.path`
- `controllers/supplierController.js` - Uses `req.fileUrl` instead of `req.file.path`

### 4. Updated Routes
- `routes/flavors.js` - Uses spread operator for middleware array
- `routes/categories.js` - Uses spread operator for middleware array
- `routes/suppliers.js` - Uses spread operator for middleware array

### 5. Dependencies Added
- `axios` - For making HTTP requests to external upload service
- `form-data` - For creating multipart form data

## File Structure
```
uploads/
├── flavors/          # Flavor images
├── brand-category/   # Brand and category images
└── brochures/        # Document files (PDF, DOC, etc.)
```

## Usage
The upload middleware now automatically:
1. Accepts file uploads via multer
2. Uploads files to the external service
3. Returns the file URL in `req.fileUrl`
4. Handles errors gracefully

## Testing
Run the test script to verify the external upload service:
```bash
node test-external-upload.js
```

## Benefits
- Works in serverless environments
- No local file storage required
- Centralized file management
- Better scalability
- Automatic file cleanup handled by external service 