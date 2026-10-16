// app/api/admin/orders/route.js
// Admin API: List customer orders with filters and search

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { generateOrderReference, generateConfirmationToken, hashConfirmationToken } from '@/lib/order-ref';

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

export async function POST(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const body = await request.json();
    const { customer, items, deliveryCharge, discount, deliveryZone, orderStatus, paymentStatus } = body;

    if (!customer?.name || !customer?.phone) {
      return Response.json({ success: false, error: 'গ্রাহকের নাম ও ফোন নম্বর আবশ্যক।' }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ success: false, error: 'কমপক্ষে একটি পণ্য যোগ করুন।' }, { status: 400 });
    }

    const orders = await getCollection('orders');

    // Generate unique order reference
    let orderReference = generateOrderReference();
    let collision = await orders.findOne({ orderReference });
    while (collision) {
      orderReference = generateOrderReference();
      collision = await orders.findOne({ orderReference });
    }

    const token = generateConfirmationToken();
    const tokenHash = hashConfirmationToken(token);

    // Process items
    const processedItems = items.map(it => {
      const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
      const unitPrice = Math.max(0, Number(it.unitPrice) || 0);
      return {
        productId: it.productId ? it.productId.toString() : '',
        productName: it.productName || 'পণ্য',
        slug: it.slug || '',
        image: it.image || '/products/koti_set_navy_gold.jpg',
        unitPrice,
        quantity: qty,
        variant: it.variant || null,
        subtotal: unitPrice * qty
      };
    });

    const subtotal = processedItems.reduce((acc, it) => acc + it.subtotal, 0);
    const dCharge = deliveryCharge !== undefined ? Math.max(0, Number(deliveryCharge)) : (deliveryZone === 'outside_dhaka' ? 130 : 70);
    const disc = discount !== undefined ? Math.max(0, Number(discount)) : 0;
    const grandTotal = Math.max(0, subtotal - disc + dCharge);
    const initialStatus = orderStatus || 'pending';
    const initialPayment = paymentStatus || (initialStatus === 'delivered' ? 'paid' : 'unpaid');

    const newOrder = {
      orderReference,
      confirmationTokenHash: tokenHash,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address ? customer.address.trim() : 'ঠিকানা প্রযোজ্য নয়',
        district: customer.district ? customer.district.trim() : 'ঢাকা (Dhaka)',
        email: customer.email ? customer.email.trim() : null,
        notes: customer.notes ? customer.notes.trim() : ''
      },
      items: processedItems,
      subtotal,
      discount: disc,
      deliveryCharge: dCharge,
      deliveryZone: deliveryZone || 'inside_dhaka',
      total: grandTotal,
      currency: 'BDT',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: initialPayment,
      orderStatus: initialStatus,
      statusHistory: [
        {
          status: initialStatus,
          timestamp: new Date().toISOString(),
          updatedBy: admin.email,
          note: 'অ্যাডমিন কর্তৃক ম্যানুয়ালি নতুন অর্ডারটি তৈরি করা হয়েছে।'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const res = await orders.insertOne(newOrder);

    return Response.json({
      success: true,
      message: `নতুন অর্ডার (${orderReference}) সফলভাবে তৈরি হয়েছে।`,
      order: { ...newOrder, _id: res.insertedId }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating manual order:', error);
    return Response.json({ success: false, error: 'ম্যানুয়াল অর্ডার তৈরি করতে ত্রুটি ঘটেছে।' }, { status: 500 });
  }
}
