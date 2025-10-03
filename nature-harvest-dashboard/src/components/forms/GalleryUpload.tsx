import React, { useState, useRef } from 'react';
import { uploadGalleryImages } from '../../services/api';

interface GalleryUploadProps {
  onGalleryUpdate: (gallery: string[]) => void;
  currentGallery?: string[];
  label?: string;
  className?: string;
}

const GalleryUpload: React.FC<GalleryUploadProps> = ({
  onGalleryUpdate,
  currentGallery = [],
  label = 'Product Gallery',
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    for (let i = 0; i < files.length; i++) {
      if (!allowedTypes.includes(files[i].type)) {
        setError('Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.');
        return;
      }
      // File size validation removed - no maximum size restriction
    }

    setUploading(true);
    setError(null);

    try {
      // Convert FileList to Array for the API service
      const filesArray = Array.from(files);
      
      // Use the local API service
      const response = await uploadGalleryImages(filesArray);
      
      if (response.data && response.data.urls) {
        // Add new images to existing gallery
        const updatedGallery = [...currentGallery, ...response.data.urls];
        onGalleryUpdate(updatedGallery);
        setError(null);
      } else {
        throw new Error('No URLs returned from upload');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const updatedGallery = currentGallery.filter((_, i) => i !== index);
    onGalleryUpdate(updatedGallery);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="space-y-3">
        {/* Current Gallery Display */}
        {currentGallery.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentGallery.map((imageUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={imageUrl}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Add Images'}
          </button>
          
          {uploading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              Uploading...
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Error Display */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Help Text */}
        <p className="text-xs text-gray-500">
          Supported formats: JPG, PNG, GIF, WEBP. You can select multiple images.
        </p>
      </div>
    </div>
  );
};

export default GalleryUpload; 