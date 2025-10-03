'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { config } from '../lib/config'
import { validateFiles, formatFileSize } from '../lib/fileValidation'

interface GalleryUploadProps {
  onImagesChange: (images: string[]) => void
  initialImages?: string[]
  maxImages?: number
  className?: string
}

interface UploadResponse {
  success: boolean
  message: string
  url?: string // Fallback direct URL property
  data?: {
    urls?: string[]
    files?: Array<{
      success: boolean
      url: string
      filename: string
    }>
  } | string // Data can be an object or string
}

const GalleryUpload: React.FC<GalleryUploadProps> = ({
  onImagesChange,
  initialImages = [],
  maxImages = 10,
  className = ''
}) => {
  const [images, setImages] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)


  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate files
    const validation = validateFiles(files, {
      maxFiles: maxImages - images.length,
      allowedTypes: [...config.upload.allowedTypes]
    })

    if (!validation.valid) {
      setError(validation.error || 'Invalid files')
      return
    }

    setUploading(true)
    setError('')
    setUploadProgress({})

    try {
      // Upload files in parallel for better performance
      const uploadPromises = files.map(async (file) => {
        // Initialize progress for this file
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
        const formData = new FormData()
        formData.append('file', file)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), config.upload.timeout)

        let progressInterval: NodeJS.Timeout | null = null
        
        try {
          // Simulate progress for better UX
          progressInterval = setInterval(() => {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: Math.min(prev[file.name] + Math.random() * 20, 90)
            }))
          }, 200)

          const response = await fetch(`${config.api.baseUrl}/upload`, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          })

          clearTimeout(timeoutId)
          if (progressInterval) {
            clearInterval(progressInterval)
          }

          if (!response.ok) {
            throw new Error(`Upload failed for ${file.name}: ${response.status} ${response.statusText}`)
          }

          const result: UploadResponse = await response.json()
          
          if (!result.success) {
            throw new Error(`Upload failed: ${result.message || 'Unknown error'}`)
          }
          
          if (!result.data) {
            throw new Error(`No data in response for ${file.name}`)
          }
          
          let url: string | undefined
          
          // Try to get URL from urls array first
          if (result.data && typeof result.data === 'object' && result.data.urls && result.data.urls.length > 0) {
            url = result.data.urls[0]
          } 
          // Fallback to files array
          else if (result.data && typeof result.data === 'object' && result.data.files && result.data.files.length > 0) {
            const fileData = result.data.files.find(f => f.success && f.url)
            if (fileData?.url) {
              url = fileData.url
            }
          }
          
          if (!url) {
            // Additional fallback: check if there's a direct URL property
            if (result.url) {
              url = result.url
            } else if (result.data && typeof result.data === 'string') {
              url = result.data
            } else {
              throw new Error(`No valid URL returned for ${file.name}`)
            }
          }
          
          // Mark as complete
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
          return url
        } catch (error) {
          clearTimeout(timeoutId)
          if (progressInterval) {
            clearInterval(progressInterval)
          }
          throw error
        }
      })

      // Wait for all uploads to complete
      const uploadedUrls = await Promise.all(uploadPromises)

      // Update images state
      const newImages = [...images, ...uploadedUrls]
      setImages(newImages)
      onImagesChange(newImages)
      
    } catch (err) {
      console.error('Upload error:', err)
      
      let errorMessage = 'Upload failed'
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Upload timed out. Please try again with smaller files or check your connection.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={openFileDialog}
            disabled={uploading || images.length >= maxImages}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : `Add Images (${images.length}/${maxImages})`}
          </button>
          
          <div className="text-xs text-gray-500">
            {config.upload.allowedTypes.join(', ')}
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="text-center text-gray-600 mb-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
            Uploading images...
          </div>
          
          {/* Individual file progress */}
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span className="truncate">{filename}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GalleryUpload
