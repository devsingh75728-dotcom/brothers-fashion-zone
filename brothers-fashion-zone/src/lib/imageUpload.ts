'use client';

import { supabase } from './supabase';

type AspectRatio = '4:5' | '1:1' | '16:9';

const ASPECT_CONFIGS: Record<AspectRatio, { width: number; height: number }> = {
  '4:5': { width: 800, height: 1000 },
  '1:1': { width: 400, height: 400 },
  '16:9': { width: 1280, height: 720 },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface UploadOptions {
  aspectRatio?: AspectRatio;
  quality?: number;
}

interface UploadProgress {
  percentage: number;
  phase: 'validating' | 'processing' | 'uploading' | 'complete';
}

export async function processAndUpload(
  file: File,
  options: UploadOptions = {},
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const { aspectRatio = '4:5', quality = 0.85 } = options;

  onProgress?.({ percentage: 10, phase: 'validating' });

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be less than 5MB');
  }

  onProgress?.({ percentage: 30, phase: 'processing' });

  const imageBitmap = await createImageBitmap(file);
  const { width: targetWidth, height: targetHeight } = ASPECT_CONFIGS[aspectRatio];

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to create canvas context');
  }

  const sourceAspect = imageBitmap.width / imageBitmap.height;
  const targetAspect = targetWidth / targetHeight;

  let sx = 0, sy = 0, sw = imageBitmap.width, sh = imageBitmap.height;

  if (sourceAspect > targetAspect) {
    sw = imageBitmap.height * targetAspect;
    sx = (imageBitmap.width - sw) / 2;
  } else {
    sh = imageBitmap.width / targetAspect;
    sy = (imageBitmap.height - sh) / 2;
  }

  ctx.drawImage(imageBitmap, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

  onProgress?.({ percentage: 60, phase: 'processing' });

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error('Failed to convert to blob'));
      },
      'image/webp',
      quality
    );
  });

  onProgress?.({ percentage: 30, phase: 'uploading' });

  const filename = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filename, blob, {
      contentType: 'image/webp',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  onProgress?.({ percentage: 90, phase: 'uploading' });

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename);

  if (!urlData?.publicUrl) {
    throw new Error('Failed to get public URL');
  }

  onProgress?.({ percentage: 100, phase: 'complete' });

  return urlData.publicUrl;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Image must be less than 5MB' };
  }
  return { valid: true };
}