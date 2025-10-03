import React, { useState, useRef } from 'react';
import { uploadFile } from '../../services/api';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImageUrl?: string;
  label?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImageUrl,
  label = 'Upload Image',
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.');
      return;
    }

    // File size validation removed - no maximum size restriction

    setUploading(true);
    setError(null);

    try {
      const { data } = await uploadFile(file, 'products');

      const url = data?.data?.urls?.[0] || data?.data?.url || data?.url;
      if (url) {
        onImageUpload(url);
        setError(null);
      } else {
        throw new Error('No URL returned from upload');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    onImageUpload('');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="space-y-3">
        {/* Current Image Display */}
        {currentImageUrl && (
          <div className="relative">
            <img
              src={currentImageUrl}
              alt="Current"
              className="w-48 h-48 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-sm"
            >
              ×
            </button>
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
            {uploading ? 'Uploading...' : currentImageUrl ? 'Change Image' : 'Select Image'}
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
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Error Display */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Help Text */}
        <p className="text-xs text-gray-500">
          Supported formats: JPG, PNG, GIF, WEBP.
        </p>
      </div>
    </div>
  );
};

export default ImageUpload; 