// app/api/admin/orders/route.js
// Admin API: List customer orders with filters and search

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));

    const orders = await getCollection('orders');
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { orderReference: { $regex: term, $options: 'i' } },
        { 'customer.name': { $regex: term, $options: 'i' } },
        { 'customer.phone': { $regex: term, $options: 'i' } },
        { 'customer.district': { $regex: term, $options: 'i' } }
      ];
    }

    const totalCount = await orders.countDocuments(query);
    const skip = (page - 1) * limit;

    const items = await orders
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return Response.json({
      success: true,
      orders: items,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return Response.json({ success: false, error: 'অর্ডার তালিকা লোড করা যায়নি।' }, { status: 500 });
  }
}
