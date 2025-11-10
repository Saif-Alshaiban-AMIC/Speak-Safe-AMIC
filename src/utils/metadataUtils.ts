// utils/metadataUtils.ts
/**
 * Frontend metadata stripping utilities
 * Note: This provides first-layer protection. Backend provides second layer.
 * 
 * Effectiveness:
 * - Images: EXCELLENT (Full EXIF/GPS removal via canvas)
 * - PDFs/Documents: LIMITED (Backend handles comprehensive stripping)
 * - Videos/Audio: NOT SUPPORTED (Backend only)
 */

/**
 * Strip EXIF and other metadata from images by redrawing on canvas
 * This completely removes GPS, camera info, timestamps, etc.
 */
export function stripImageMetadata(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw image to strip all metadata
        ctx.drawImage(img, 0, 0);

        // Convert back to blob with high quality (0.95)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const cleanFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(cleanFile);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          },
          file.type,
          0.95 // High quality (95%)
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Basic PDF processing (Frontend limitation)
 * Note: This doesn't actually strip embedded PDF metadata
 * Backend will handle comprehensive PDF metadata removal
 */
export async function stripPdfMetadata(file: File): Promise<File> {
  // Frontend has limited PDF processing capabilities
  // Just create a new file object - backend will do the real work
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: file.type });
  return new File([blob], file.name, {
    type: file.type,
    lastModified: Date.now(),
  });
}

/**
 * Basic document processing (Frontend limitation)
 * Note: This doesn't actually strip Word/Excel metadata properties
 * Backend will handle comprehensive document metadata removal
 */
export async function stripDocumentMetadata(file: File): Promise<File> {
  // Frontend cannot properly strip Office document metadata
  // Just create a new file object - backend will do the real work
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: file.type });
  return new File([blob], file.name, {
    type: file.type,
    lastModified: Date.now(),
  });
}

/**
 * Main metadata stripping function
 * Routes files to appropriate handler based on type
 * 
 * @param file - The file to process
 * @returns Promise<File> - Cleaned file (or original if processing fails)
 */
export async function stripMetadata(file: File): Promise<File> {
  try {
    // Images: Canvas redraw provides excellent metadata removal
    if (file.type.startsWith('image/')) {
      console.log(`🖼️  Frontend: Stripping metadata from image: ${file.name}`);
      return await stripImageMetadata(file);
    }
    
    // PDFs: Limited frontend capability, backend will handle
    if (file.type === 'application/pdf') {
      console.log(`📄 Frontend: Basic PDF processing: ${file.name} (backend will strip metadata)`);
      return await stripPdfMetadata(file);
    }

    // Office documents: Limited frontend capability, backend will handle
    if (
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-powerpoint' ||
      file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      console.log(`📝 Frontend: Basic document processing: ${file.name} (backend will strip metadata)`);
      return await stripDocumentMetadata(file);
    }

    // Videos/Audio: Cannot be processed in browser, backend will handle
    if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      console.log(`🎥 Frontend: Media file ${file.name} will be processed on backend`);
      return file; // Return as-is, backend will process
    }

    // Text files: No metadata to strip
    if (file.type.startsWith('text/')) {
      console.log(`📃 Frontend: Text file ${file.name} (no metadata to strip)`);
      return file;
    }

    // Other file types: Basic processing
    console.log(`❓ Frontend: Unknown type ${file.type} for ${file.name} (backend will process)`);
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });
    return new File([blob], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });
    
  } catch (error) {
    // If metadata stripping fails, return original file
    // Backend will still attempt to strip metadata
    console.error(`⚠️  Frontend: Error stripping metadata from ${file.name}:`, error);
    console.log(`📎 Frontend: Using original file (backend will strip metadata)`);
    return file;
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * Validate file size against maximum allowed
 */
export function validateFileSize(file: File, maxSizeMB = 10): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

/**
 * Validate file type against allowed types
 */
export function validateFileType(file: File): boolean {
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/svg+xml',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    // Video
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    'video/webm',
    'video/ogg',
    // Audio
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/aac',
    'audio/m4a',
    'audio/x-m4a',
  ];

  // Allow all image, video, and audio types by prefix
  if (
    file.type.startsWith('image/') ||
    file.type.startsWith('video/') ||
    file.type.startsWith('audio/')
  ) {
    return true;
  }

  // Check against explicit allowed types
  return allowedTypes.includes(file.type);
}