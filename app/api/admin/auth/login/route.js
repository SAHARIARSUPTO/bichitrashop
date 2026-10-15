// app/api/admin/auth/login/route.js
// Admin authentication API: Verify credentials and issue HTTP-only cookie

import { getCollection } from '@/lib/mongodb';
import { adminLoginSchema } from '@/lib/validation';
import { verifyPassword, createAdminToken, COOKIE_NAME } from '@/lib/auth';
import { initDatabase } from '@/lib/db-init';

export async function POST(request) {
  try {
    await initDatabase();
    const body = await request.json();

    const parseResult = adminLoginSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json(
        { success: false, error: 'সঠিক ইমেইল ও পাসওয়ার্ড প্রদান করুন।' },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const admins = await getCollection('admins');
    const admin = await admins.findOne({ email });

    if (!admin) {
      return Response.json(
        { success: false, error: 'ভুল ইমেইল বা পাসওয়ার্ড।' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return Response.json(
        { success: false, error: 'ভুল ইমেইল বা পাসওয়ার্ড।' },
        { status: 401 }
      );
    }

    // Update lastLoginAt
    await admins.updateOne(
      { _id: admin._id },
      { $set: { lastLoginAt: new Date().toISOString() } }
    );

    const token = await createAdminToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role || 'admin'
    });

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieHeader = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${isProduction ? '; Secure' : ''}`;

    return Response.json(
      {
        success: true,
        message: 'লগইন সফল হয়েছে।',
        admin: {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.name || 'Administrator',
          role: admin.role
        }
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookieHeader
        }
      }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return Response.json(
      { success: false, error: 'লগইন প্রক্রিয়ায় ত্রুটি ঘটেছে।' },
      { status: 500 }
    );
  }
}
