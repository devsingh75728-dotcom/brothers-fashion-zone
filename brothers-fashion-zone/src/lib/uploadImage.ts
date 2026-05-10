'use client';

export async function uploadImage(
  file: File,
  folder: string = 'products'
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'bfz_unsigned');
  formData.append('folder', folder);

  const response = await fetch(
    'https://api.cloudinary.com/v1_1/bfz-store/image/upload',
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}