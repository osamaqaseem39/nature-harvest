import { config } from './config'

export interface UploadResponse {
  success: boolean
  message: string
  data: {
    urls: string[]
    files: Array<{
      success: boolean
      url: string
      filename: string
    }>
  }
}

export interface UploadOptions {
  onProgress?: (progress: number) => void
  onSuccess?: (urls: string[]) => void
  onError?: (error: string) => void
}

/**
 * Upload a single file to the server
 */
export async function uploadFile(
  file: File,
  options?: UploadOptions
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), config.upload.timeout)

  try {
    const response = await fetch(`${config.api.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
    }

    const result: UploadResponse = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Upload failed')
    }

    let url: string | undefined

    // Try to get URL from urls array first
    if (result.data?.urls?.length > 0) {
      url = result.data.urls[0]
    } 
    // Fallback to files array
    else if (result.data?.files?.length > 0) {
      const fileData = result.data.files.find(f => f.success)
      if (fileData?.url) {
        url = fileData.url
      }
    }

    if (!url) {
      console.error('Upload response:', result)
      throw new Error('No valid URL returned from upload')
    }

    options?.onSuccess?.([url])
    return url
  } catch (error) {
    clearTimeout(timeoutId)
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    options?.onError?.(errorMessage)
    throw error
  }
}

/**
 * Upload multiple files to the server
 */
export async function uploadFiles(
  files: File[],
  options?: UploadOptions
): Promise<string[]> {
  try {
    // Upload all files in parallel for better performance
    const uploadPromises = files.map(file => uploadFile(file, {
      onError: (error) => {
        console.error(`Failed to upload ${file.name}:`, error)
      }
    }))
    
    const uploadedUrls = await Promise.all(uploadPromises)
    
    // Update progress to 100% when all uploads complete
    options?.onProgress?.(100)
    options?.onSuccess?.(uploadedUrls)
    
    return uploadedUrls
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    options?.onError?.(errorMessage)
    throw error
  }
}

/**
 * Validate file before upload
 */
export function validateFile(file: File, options?: {
  maxSize?: number // in bytes
  allowedTypes?: string[]
}): { valid: boolean; error?: string } {
  const { 
    maxSize = config.upload.maxFileSize, 
    allowedTypes = config.upload.allowedTypes 
  } = options || {}

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`
    }
  }

  return { valid: true }
}

/**
 * Get file preview URL
 */
export function getFilePreview(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * Revoke file preview URL to free memory
 */
export function revokeFilePreview(url: string): void {
  URL.revokeObjectURL(url)
}
