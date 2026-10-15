// app/api/admin/orders/[id]/route.js
// Admin API: Get single customer order details

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection, ObjectId } from '@/lib/mongodb';

function parseIdQuery(id) {
  try {
    return { $or: [{ _id: new ObjectId(id) }, { _id: id }, { orderReference: id }] };
  } catch {
    return { $or: [{ _id: id }, { orderReference: id }] };
  }
}

export async function GET(request, { params }) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const orders = await getCollection('orders');
    const order = await orders.findOne(parseIdQuery(id));

    if (!order) {
      return Response.json({ success: false, error: 'অর্ডারটি পাওয়া যায়নি।' }, { status: 404 });
    }

    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json({ success: false, error: 'অর্ডার তথ্য লোড করা যায়নি।' }, { status: 500 });
  }
}
