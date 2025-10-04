import { config } from './config'

export interface FileValidationOptions {
  allowedTypes?: readonly string[]
  maxFiles?: number
}

export interface FileValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate a single file against upload constraints
 */
export function validateFile(
  file: File, 
  options: FileValidationOptions = {}
): FileValidationResult {
  const {
    allowedTypes = config.upload.allowedTypes,
  } = options

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Only ${allowedTypes.join(', ')} are allowed.`
    }
  }
  
  // File size validation removed - no maximum size restriction
  
  return { valid: true }
}

/**
 * Validate multiple files against upload constraints
 */
export function validateFiles(
  files: File[], 
  options: FileValidationOptions = {}
): FileValidationResult {
  const {
    maxFiles = config.upload.maxFiles,
  } = options

  // Check file count
  if (files.length > maxFiles) {
    return {
      valid: false,
      error: `Too many files. Maximum ${maxFiles} files allowed.`
    }
  }

  // Validate each file
  for (const file of files) {
    const result = validateFile(file, options)
    if (!result.valid) {
      return result
    }
  }

  return { valid: true }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

/**
 * Check if file type is image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Check if file type is document
 */
export function isDocumentFile(file: File): boolean {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
  return documentTypes.includes(file.type)
}
