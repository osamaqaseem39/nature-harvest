'use client'

import { useState } from 'react'
import GalleryUploadFixed from '@/components/GalleryUploadFixed'
import GalleryUploadUpdated from '@/components/GalleryUploadUpdated'

export default function GalleryTestPage() {
  const [gallery1, setGallery1] = useState<string[]>([])
  const [gallery2, setGallery2] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Gallery Upload Test
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Component 1: Using uploadFiles utility directly */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              GalleryUploadFixed (Direct uploadFiles)
            </h2>
            
            <GalleryUploadFixed
              onGalleryUpdate={setGallery1}
              currentGallery={gallery1}
              label="Test Gallery 1"
              maxImages={5}
              className="mb-4"
            />
            
            {/* Display Current Images */}
            {gallery1.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Current Images ({gallery1.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {gallery1.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                      <img
                        src={image}
                        alt={`Gallery 1 - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* JSON Output */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">JSON Data</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(gallery1, null, 2)}
              </pre>
            </div>
          </div>

          {/* Component 2: Using uploadGalleryImages service */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              GalleryUploadUpdated (uploadGalleryImages service)
            </h2>
            
            <GalleryUploadUpdated
              onGalleryUpdate={setGallery2}
              currentGallery={gallery2}
              label="Test Gallery 2"
              maxImages={5}
              className="mb-4"
            />
            
            {/* Display Current Images */}
            {gallery2.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Current Images ({gallery2.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {gallery2.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                      <img
                        src={image}
                        alt={`Gallery 2 - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* JSON Output */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">JSON Data</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(gallery2, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Test Instructions</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Try uploading single and multiple images</li>
            <li>• Test with different image formats (JPG, PNG, GIF, WEBP)</li>
            <li>• Try uploading large files to test size validation</li>
            <li>• Test removing images by hovering and clicking the × button</li>
            <li>• Check the browser console for detailed upload logs</li>
            <li>• Both components should handle your upload response structure correctly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
