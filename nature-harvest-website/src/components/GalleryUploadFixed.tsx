import React, { useState, useRef } from 'react';
import { uploadFiles, validateFile } from '../lib/upload';

interface GalleryUploadProps {
  onGalleryUpdate: (gallery: string[]) => void;
  currentGallery?: string[];
  label?: string;
  className?: string;
  maxImages?: number;
}

const GalleryUploadFixed: React.FC<GalleryUploadProps> = ({
  onGalleryUpdate,
  currentGallery = [],
  label = 'Product Gallery',
  className = '',
  maxImages = 10
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (currentGallery.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed. You can add ${maxImages - currentGallery.length} more images.`);
      return;
    }

    // Validate each file
    const filesArray = Array.from(files);
    for (const file of filesArray) {
      const validation = validateFile(file, {
        // maxSize removed - no maximum size restriction
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });
      
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Use our proven upload utility
      const uploadedUrls = await uploadFiles(filesArray, {
        onProgress: (progressValue) => {
          setProgress(progressValue);
        },
        onSuccess: (urls) => {
          console.log('Upload successful:', urls);
        },
        onError: (errorMessage) => {
          console.error('Upload error:', errorMessage);
        }
      });

      if (uploadedUrls.length > 0) {
        // Add new images to existing gallery
        const updatedGallery = [...currentGallery, ...uploadedUrls];
        onGalleryUpdate(updatedGallery);
        setError(null);
        console.log('Gallery updated with new images:', uploadedUrls);
      } else {
        throw new Error('No images were uploaded successfully');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
        {label} ({currentGallery.length}/{maxImages})
      </label>
      
      <div className="space-y-3">
        {/* Current Gallery Display */}
        {currentGallery.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentGallery.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    console.error(`Failed to load image ${index + 1}:`, imageUrl);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
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
            disabled={uploading || currentGallery.length >= maxImages}
            className="px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Add Images'}
          </button>
          
          {uploading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
              Uploading... {Math.round(progress)}%
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
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Help Text */}
        <p className="text-xs text-gray-500">
          Supported formats: JPG, PNG, GIF, WEBP. You can select multiple images.
        </p>
      </div>
    </div>
  );
};

export default GalleryUploadFixed;
