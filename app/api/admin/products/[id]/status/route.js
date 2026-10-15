// app/api/admin/products/[id]/status/route.js
// Admin API: Fast toggle or update product status (published / draft)

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection, ObjectId } from '@/lib/mongodb';

function parseIdQuery(id) {
  try {
    return { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
  } catch {
    return { _id: id };
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

    const allowedStatuses = ['published', 'draft', 'archived'];
    if (!allowedStatuses.includes(body.status)) {
      return Response.json({ success: false, error: 'অবৈধ স্ট্যাটাস।' }, { status: 400 });
    }

    const products = await getCollection('products');
    const result = await products.updateOne(parseIdQuery(id), {
      $set: {
        status: body.status,
        updatedAt: new Date().toISOString()
      }
    });

    if (result.matchedCount === 0) {
      return Response.json({ success: false, error: 'পণ্যটি পাওয়া যায়নি।' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: `পণ্যের স্ট্যাটাস "${body.status}" এ পরিবর্তিত হয়েছে।`
    });
  } catch (error) {
    return Response.json({ success: false, error: 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
