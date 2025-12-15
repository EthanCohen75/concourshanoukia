/**
 * Service for handling image compression and processing
 */

const mediaService = {
  /**
   * Compress an image file to base64
   * @param {File} file - Image file to compress
   * @param {number} maxWidth - Maximum width in pixels
   * @param {number} quality - JPEG quality (0-1)
   * @returns {Promise<string>} Base64 encoded image
   */
  compressImage: async (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Generate a thumbnail from an image file
   * @param {File} file - Image file
   * @param {number} maxWidth - Maximum thumbnail width
   * @returns {Promise<string>} Base64 encoded thumbnail
   */
  generateThumbnail: async (file, maxWidth = 200) => {
    return mediaService.compressImage(file, maxWidth, 0.7);
  },

  /**
   * Validate if file is an image
   * @param {File} file - File to validate
   * @returns {boolean} True if file is an image
   */
  isImageFile: (file) => {
    return file && file.type.startsWith('image/');
  },

  /**
   * Validate file size
   * @param {File} file - File to validate
   * @param {number} maxSizeMB - Maximum size in MB
   * @returns {boolean} True if file size is acceptable
   */
  isValidSize: (file, maxSizeMB = 10) => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file && file.size <= maxBytes;
  },

  /**
   * Estimate base64 size from file
   * @param {File} file - File to estimate
   * @returns {number} Estimated size in MB
   */
  estimateBase64Size: (file) => {
    // Base64 is ~33% larger than original
    return (file.size * 1.33) / (1024 * 1024);
  },

  /**
   * Process multiple image files
   * @param {FileList|File[]} files - Files to process
   * @returns {Promise<Array>} Array of processed images with thumbnails
   */
  processImages: async (files) => {
    const filesArray = Array.from(files);

    // Filter valid images
    const validFiles = filesArray.filter(file =>
      mediaService.isImageFile(file) && mediaService.isValidSize(file)
    );

    if (validFiles.length === 0) {
      throw new Error('Aucune image valide trouvée');
    }

    // Process all images in parallel
    const processedImages = await Promise.all(
      validFiles.map(async (file) => {
        try {
          const [dataUrl, thumbnail] = await Promise.all([
            mediaService.compressImage(file),
            mediaService.generateThumbnail(file)
          ]);

          return {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            dataUrl,
            thumbnail,
            originalName: file.name
          };
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          return null;
        }
      })
    );

    // Filter out failed processings
    return processedImages.filter(img => img !== null);
  }
};

export default mediaService;
