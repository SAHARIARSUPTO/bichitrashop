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

export async function PATCH(request, { params }) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const orders = await getCollection('orders');
    const existing = await orders.findOne(parseIdQuery(id));

    if (!existing) {
      return Response.json({ success: false, error: 'অর্ডারটি পাওয়া যায়নি।' }, { status: 404 });
    }

    const updateFields = {};

    // Customer info
    if (body.customer) {
      updateFields.customer = {
        name: body.customer.name !== undefined ? body.customer.name.trim() : existing.customer?.name || '',
        phone: body.customer.phone !== undefined ? body.customer.phone.trim() : existing.customer?.phone || '',
        address: body.customer.address !== undefined ? body.customer.address.trim() : existing.customer?.address || '',
        district: body.customer.district !== undefined ? body.customer.district.trim() : existing.customer?.district || '',
        email: body.customer.email !== undefined ? body.customer.email.trim() : existing.customer?.email || null,
        notes: body.customer.notes !== undefined ? body.customer.notes.trim() : existing.customer?.notes || ''
      };
    }

    // Items array
    let currentItems = existing.items || [];
    if (Array.isArray(body.items) && body.items.length > 0) {
      currentItems = body.items.map(it => {
        const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
        const price = Math.max(0, Number(it.unitPrice) || 0);
        return {
          productId: it.productId ? it.productId.toString() : '',
          productName: it.productName || 'পণ্য',
          slug: it.slug || '',
          image: it.image || '/products/koti_set_navy_gold.jpg',
          unitPrice: price,
          quantity: qty,
          variant: it.variant || null,
          subtotal: price * qty
        };
      });
      updateFields.items = currentItems;
    }

    // Subtotal recalculation
    const subtotal = currentItems.reduce((acc, it) => acc + (Number(it.subtotal) || 0), 0);
    updateFields.subtotal = subtotal;

    // Delivery charge & discount
    const deliveryCharge = body.deliveryCharge !== undefined ? Math.max(0, Number(body.deliveryCharge)) : (existing.deliveryCharge ?? 70);
    const discount = body.discount !== undefined ? Math.max(0, Number(body.discount)) : (existing.discount ?? 0);
    updateFields.deliveryCharge = deliveryCharge;
    updateFields.discount = discount;
    updateFields.total = Math.max(0, subtotal - discount + deliveryCharge);

    // Status fields
    if (body.orderStatus) {
      updateFields.orderStatus = body.orderStatus;
      if (body.orderStatus === 'delivered') {
        updateFields.paymentStatus = 'paid';
      }
    }
    if (body.paymentStatus) {
      updateFields.paymentStatus = body.paymentStatus;
    }

    // Timeline audit history
    const history = Array.isArray(existing.statusHistory) ? [...existing.statusHistory] : [];
    history.push({
      status: updateFields.orderStatus || existing.orderStatus,
      timestamp: new Date().toISOString(),
      updatedBy: admin.email,
      note: body.editNote || 'অর্ডার তথ্য অ্যাডমিন কর্তৃক এডিট ও আপডেট করা হয়েছে।'
    });
    updateFields.statusHistory = history;
    updateFields.updatedAt = new Date().toISOString();

    await orders.updateOne(parseIdQuery(id), { $set: updateFields });

    const updated = await orders.findOne(parseIdQuery(id));

    return Response.json({
      success: true,
      message: 'অর্ডার তথ্য সফলভাবে আপডেট করা হয়েছে।',
      order: updated
    });
  } catch (error) {
    console.error('Error editing order:', error);
    return Response.json({ success: false, error: 'অর্ডার এডিট করতে ত্রুটি ঘটেছে।' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const orders = await getCollection('orders');
    const existing = await orders.findOne(parseIdQuery(id));

    if (!existing) {
      return Response.json({ success: false, error: 'অর্ডারটি পাওয়া যায়নি।' }, { status: 404 });
    }

    await orders.deleteOne(parseIdQuery(id));

    return Response.json({
      success: true,
      message: `অর্ডার (${existing.orderReference}) সফলভাবে মুছে ফেলা হয়েছে।`
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return Response.json({ success: false, error: 'অর্ডার মুছতে সমস্যা হয়েছে।' }, { status: 500 });
  }
}
