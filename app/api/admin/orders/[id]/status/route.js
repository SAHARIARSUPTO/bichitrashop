// app/api/admin/orders/[id]/status/route.js
// Admin API: Order status transitions with timeline audit and strict price preservation

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection, ObjectId } from '@/lib/mongodb';
import { orderStatusUpdateSchema } from '@/lib/validation';

function parseIdQuery(id) {
  try {
    return { $or: [{ _id: new ObjectId(id) }, { _id: id }, { orderReference: id }] };
  } catch {
    return { $or: [{ _id: id }, { orderReference: id }] };
  }
}

export async function PATCH(request, { params }) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const parseResult = orderStatusUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json(
        { success: false, error: parseResult.error.errors[0]?.message || 'অবৈধ স্ট্যাটাস।' },
        { status: 400 }
      );
    }

    const { status, note } = parseResult.data;
    const orders = await getCollection('orders');
    const existing = await orders.findOne(parseIdQuery(id));

    if (!existing) {
      return Response.json({ success: false, error: 'অর্ডারটি পাওয়া যায়নি।' }, { status: 404 });
    }

    // Status description map in Bengali
    const statusBanglaNames = {
      pending: 'অপেক্ষমাণ (Pending)',
      confirmed: 'নিশ্চিত (Confirmed)',
      processing: 'প্রস্তুত হচ্ছে (Processing)',
      shipped: 'ডেলিভারিতে পাঠানো হয়েছে (Shipped)',
      delivered: 'সফলভাবে ডেলিভার্ড (Delivered)',
      cancelled: 'বাতিলকৃত (Cancelled)'
    };

    const newHistoryEntry = {
      status,
      timestamp: new Date().toISOString(),
      updatedBy: admin.email,
      note: note || `অর্ডার স্ট্যাটাস পরিবর্তিত হয়েছে: ${statusBanglaNames[status]}`
    };

    const history = Array.isArray(existing.statusHistory) ? [...existing.statusHistory] : [];
    history.push(newHistoryEntry);

    // Strictly update status and history only - NEVER touch subtotal, items, or total!
    await orders.updateOne(parseIdQuery(id), {
      $set: {
        orderStatus: status,
        paymentStatus: status === 'delivered' ? 'paid' : existing.paymentStatus,
        statusHistory: history,
        updatedAt: new Date().toISOString()
      }
    });

    return Response.json({
      success: true,
      message: `অর্ডার স্ট্যাটাস পরিবর্তিত হয়ে "${statusBanglaNames[status]}" হয়েছে।`,
      orderStatus: status,
      statusHistory: history
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return Response.json({ success: false, error: 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
