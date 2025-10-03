'use client'

import { useState } from 'react'
import GalleryUpload from '@/components/GalleryUpload'

export default function GalleryDemoPage() {
  const [galleryImages, setGalleryImages] = useState<string[]>([])

  const handleImagesChange = (images: string[]) => {
    setGalleryImages(images)
    console.log('Gallery images updated:', images)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Gallery Upload Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upload Gallery Images
          </h2>
          
          <GalleryUpload
            onImagesChange={handleImagesChange}
            initialImages={galleryImages}
            maxImages={10}
            className="mb-6"
          />
          
          {/* Display Current Images */}
          {galleryImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Current Gallery ({galleryImages.length} images)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* JSON Output for Debugging */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Gallery Data (JSON)
            </h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(galleryImages, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
