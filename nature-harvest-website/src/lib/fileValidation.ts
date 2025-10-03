import { config } from './config'

export interface FileValidationOptions {
  maxSize?: number
  allowedTypes?: string[]
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
    maxSize = config.upload.maxFileSize,
    allowedTypes = config.upload.allowedTypes,
  } = options

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Only ${allowedTypes.join(', ')} are allowed.`
    }
  }
  
  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024))
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB.`
    }
  }
  
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
