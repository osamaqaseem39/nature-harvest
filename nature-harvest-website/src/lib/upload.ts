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

  try {
    const response = await fetch(`${config.api.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    })

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
  const uploadedUrls: string[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    try {
      // Update progress
      const progress = ((i + 1) / files.length) * 100
      options?.onProgress?.(progress)
      
      const url = await uploadFile(file, {
        onSuccess: (urls) => {
          uploadedUrls.push(...urls)
        },
        onError: (error) => {
          console.error(`Failed to upload ${file.name}:`, error)
        }
      })
      
      uploadedUrls.push(url)
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error)
      // Continue with other files even if one fails
    }
  }

  return uploadedUrls
}

/**
 * Validate file before upload
 */
export function validateFile(file: File, options?: {
  maxSize?: number // in bytes
  allowedTypes?: string[]
}): { valid: boolean; error?: string } {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options || {}

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
