// app/api/admin/orders/sync/route.js
// Admin API: Live synchronization and recalculation of total revenue and order metrics

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const orders = await getCollection('orders');
    const allOrders = await orders.find({}).toArray();

    const totalOrders = allOrders.length;
    let totalRevenue = 0;
    let deliveredRevenue = 0;
    let pendingRevenue = 0;

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    allOrders.forEach(ord => {
      const orderTotal = Number(ord.total) || 0;
      const st = ord.orderStatus || 'pending';

      if (statusCounts[st] !== undefined) {
        statusCounts[st]++;
      } else {
        statusCounts[st] = 1;
      }

      // Non-cancelled orders count towards valid active store revenue
      if (st !== 'cancelled') {
        totalRevenue += orderTotal;
      }

      if (st === 'delivered') {
        deliveredRevenue += orderTotal;
      } else if (st === 'pending') {
        pendingRevenue += orderTotal;
      }
    });

    return Response.json({
      success: true,
      message: 'রাজস্ব এবং অর্ডার মেট্রিক্স সফলভাবে সিঙ্ক হয়েছে।',
      metrics: {
        totalOrders,
        totalRevenue,
        deliveredRevenue,
        pendingRevenue,
        statusCounts,
        syncedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error syncing revenue metrics:', error);
    return Response.json({ success: false, error: 'রাজস্ব সিঙ্ক করতে সমস্যা হয়েছে।' }, { status: 500 });
  }
}
