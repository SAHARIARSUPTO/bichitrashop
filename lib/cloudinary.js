// lib/cloudinary.js
// Cloudinary uploader with automatic fallback to local public/uploads directory

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(
  cloudName &&
  apiKey &&
  apiSecret &&
  cloudName !== 'your_cloud_name'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
}

/**
 * Upload an image buffer or base64 data to Cloudinary (or local fallback)
 * @param {Buffer} buffer - File buffer
 * @param {Object} options - Options (folder, filename, mimeType)
 * @returns {Promise<{ success: boolean, url: string, publicId?: string, isLocal?: boolean }>}
 */
export async function uploadImageBuffer(buffer, { folder = 'bichitra_shop', filename = 'image', mimeType = 'image/jpeg' } = {}) {
  // 1. If Cloudinary is configured with valid credentials, upload directly to Cloudinary
  if (isCloudinaryConfigured) {
    try {
      const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;
      const uploadResult = await cloudinary.uploader.upload(base64Data, {
        folder: folder,
        resource_type: 'image',
        use_filename: true,
        unique_filename: true
      });

      return {
        success: true,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        isLocal: false
      };
    } catch (cloudErr) {
      console.error('[Cloudinary Upload Error]', cloudErr);
      throw new Error(`Cloudinary আপলোড ব্যর্থ হয়েছে: ${cloudErr.message || 'নেটওয়ার্ক বা ক্রেডেনশিয়াল সমস্যা'}`);
    }
  }

  // 2. Resilient local fallback if Cloudinary API keys are not yet provided
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const cleanExt = mimeType.includes('png')
      ? 'png'
      : mimeType.includes('webp')
      ? 'webp'
      : mimeType.includes('gif')
      ? 'gif'
      : 'jpg';

    const safeFilename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${cleanExt}`;
    const filePath = path.join(uploadDir, safeFilename);

    await fs.writeFile(filePath, buffer);

    return {
      success: true,
      url: `/uploads/${safeFilename}`,
      publicId: safeFilename,
      isLocal: true,
      notice: 'Cloudinary API কি কনফিগার করা হয়নি; স্থানীয়ভাবে সংরক্ষণ করা হয়েছে।'
    };
  } catch (fsErr) {
    console.error('[Local Upload Fallback Error]', fsErr);
    throw new Error('ছবি সংরক্ষণ করতে সমস্যা হয়েছে।');
  }
}
