import { uploadFiles, UploadResponse } from '../lib/upload';

/**
 * Upload gallery images - wrapper around the upload utility
 */
export async function uploadGalleryImages(files: File[]): Promise<UploadResponse> {
  try {
    const urls = await uploadFiles(files);
    
    // Return in the expected format
    return {
      success: true,
      message: 'Files uploaded successfully',
      data: {
        urls: urls,
        files: urls.map((url, index) => ({
          success: true,
          url: url,
          filename: files[index]?.name || `image_${index + 1}`
        }))
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Upload failed',
      data: {
        urls: [],
        files: []
      }
    };
  }
}
