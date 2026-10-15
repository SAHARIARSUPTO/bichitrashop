// app/api/orders/[reference]/route.js
// Public confirmation endpoint protected by confirmation token or admin session

import { getCollection } from '@/lib/mongodb';
import { verifyConfirmationToken } from '@/lib/order-ref';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { reference } = resolvedParams;

    if (!reference) {
      return Response.json({ success: false, error: 'Order reference is required' }, { status: 400 });
    }

    const orders = await getCollection('orders');
    const order = await orders.findOne({ orderReference: reference.trim().toUpperCase() });

    if (!order) {
      return Response.json({ success: false, error: 'অর্ডারটি খুঁজে পাওয়া যায়নি।' }, { status: 404 });
    }

    // Check authorization:
    // 1. Is requester an authenticated admin?
    const admin = await getAdminFromRequest(request);
    let isAuthorized = !!admin;

    // 2. Or does customer possess the secret confirmation token in URL or cookie?
    if (!isAuthorized) {
      const { searchParams } = new URL(request.url);
      const urlToken = searchParams.get('token');

      // Check cookie fallback
      let cookieToken = null;
      const cookieHeader = request.headers.get('cookie') || '';
      const cookieMatch = cookieHeader.match(/bichitra_last_order=([^;]+)/);
      if (cookieMatch) {
        const [cookieRef, cToken] = decodeURIComponent(cookieMatch[1]).split(':');
        if (cookieRef === order.orderReference) {
          cookieToken = cToken;
        }
      }

      const candidateToken = urlToken || cookieToken;
      if (candidateToken && verifyConfirmationToken(candidateToken, order.confirmationTokenHash)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return Response.json(
        { success: false, error: 'অননুমোদিত অ্যাক্সেস। এই অর্ডারের তথ্য দেখার অনুমতি নেই।' },
        { status: 403 }
      );
    }

    // Return safe customer receipt
    return Response.json({
      success: true,
      order: {
        orderReference: order.orderReference,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        customer: {
          name: order.customer.name,
          phone: order.customer.phone,
          address: order.customer.address,
          district: order.customer.district,
          email: order.customer.email
        },
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        deliveryCharge: order.deliveryCharge,
        deliveryZone: order.deliveryZone,
        total: order.total
      }
    });
  } catch (error) {
    console.error('Error fetching order receipt:', error);
    return Response.json(
      { success: false, error: 'অর্ডার সংক্রান্ত তথ্য লোড করা যায়নি।' },
      { status: 500 }
    );
  }
}
