// app/api/admin/auth/logout/route.js
// Admin logout: Invalidate session cookie

import { COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieHeader = `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProduction ? '; Secure' : ''}`;

  return Response.json(
    { success: true, message: 'সফলভাবে লগআউট করা হয়েছে।' },
    {
      status: 200,
      headers: {
        'Set-Cookie': cookieHeader
      }
    }
  );
}
