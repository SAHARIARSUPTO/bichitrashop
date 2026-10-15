// app/api/admin/auth/me/route.js
// Verify admin authentication state

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection, ObjectId } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const adminSession = await getAdminFromRequest(request);
    if (!adminSession) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const admins = await getCollection('admins');
    let admin = null;
    try {
      admin = await admins.findOne({ _id: new ObjectId(adminSession.id) });
    } catch {
      admin = await admins.findOne({ email: adminSession.email });
    }

    return Response.json({
      success: true,
      admin: {
        id: adminSession.id,
        email: admin?.email || adminSession.email,
        name: admin?.name || 'Administrator',
        role: admin?.role || adminSession.role || 'admin'
      }
    });
  } catch (error) {
    return Response.json({ success: false, error: 'সার্ভার ত্রুটি।' }, { status: 500 });
  }
}
