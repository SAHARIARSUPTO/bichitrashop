// app/api/admin/upload/route.js
// Admin API: Direct image upload to Cloudinary with environment credentials

import { getAdminFromRequest } from '@/lib/auth';
import { uploadImageBuffer, isCloudinaryConfigured } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত অ্যাক্সেস।' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'bichitra_shop/products';

    if (!file || typeof file === 'string') {
      return Response.json(
        { success: false, error: 'কোনো ইমেজ ফাইল নির্বাচন করা হয়নি।' },
        { status: 400 }
      );
    }

    // Validate mime type
    const mimeType = file.type || 'image/jpeg';
    if (!mimeType.startsWith('image/')) {
      return Response.json(
        { success: false, error: 'শুধুমাত্র ইমেজ ফাইল (JPG, PNG, WEBP) আপলোড করা যাবে।' },
        { status: 400 }
      );
    }

    // 10MB file size limit
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length > 10 * 1024 * 1024) {
      return Response.json(
        { success: false, error: 'ফাইলের সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।' },
        { status: 400 }
      );
    }

    const result = await uploadImageBuffer(buffer, {
      folder: folder.toString(),
      filename: file.name,
      mimeType: mimeType
    });

    return Response.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      isCloudinary: !result.isLocal,
      notice: result.notice
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return Response.json(
      {
        success: false,
        error: error.message || 'ইমেজ আপলোড করতে সমস্যা হয়েছে।'
      },
      { status: 500 }
    );
  }
}
