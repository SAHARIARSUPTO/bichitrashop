// app/api/admin/dashboard/route.js
// Admin operational metrics computed from live database records

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত অ্যাক্সেস।' }, { status: 401 });
    }

    await initDatabase();
    const products = await getCollection('products');
    const orders = await getCollection('orders');

    const totalProducts = await products.countDocuments({ status: { $ne: 'archived' } });
    const publishedProducts = await products.countDocuments({ status: 'published' });
    const draftProducts = await products.countDocuments({ status: 'draft' });
    
    // Low stock warnings (stockQuantity < 10)
    const lowStockCount = await products.countDocuments({
      status: 'published',
      stockQuantity: { $lte: 10 }
    });

    const totalOrders = await orders.countDocuments({});
    const pendingOrders = await orders.countDocuments({ orderStatus: 'pending' });
    const confirmedOrders = await orders.countDocuments({ orderStatus: 'confirmed' });
    const deliveredOrders = await orders.countDocuments({ orderStatus: 'delivered' });

    // Calculate actual revenue from delivered/confirmed orders
    const allOrders = await orders.find({ orderStatus: { $ne: 'cancelled' } }).toArray();
    const totalRevenue = allOrders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);

    // Recent 5 orders
    const recentOrders = await orders
      .find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    return Response.json({
      success: true,
      metrics: {
        totalProducts,
        publishedProducts,
        draftProducts,
        lowStockCount,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalRevenue
      },
      recentOrders
    });
  } catch (error) {
    console.error('Error computing dashboard metrics:', error);
    return Response.json({ success: false, error: 'ড্যাশবোর্ড তথ্য লোড করা যায়নি।' }, { status: 500 });
  }
}
