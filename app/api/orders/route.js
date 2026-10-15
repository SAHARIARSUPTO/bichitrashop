// app/api/orders/route.js
// Public API: Place customer order with server-side price recalculation,
// idempotency checks, price snapshots, and secure confirmation credentials.

import { getCollection, ObjectId } from '@/lib/mongodb';
import { checkoutSchema } from '@/lib/validation';
import { calculateOrderPricing } from '@/lib/pricing';
import { generateOrderReference, generateConfirmationToken, hashConfirmationToken } from '@/lib/order-ref';

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Validate request payload against Zod schema
    const validationResult = checkoutSchema.safeParse(body);
    if (!validationResult.success) {
      const firstErrorMessage = validationResult.error.issues?.[0]?.message ||
        validationResult.error.errors?.[0]?.message ||
        'ফর্মে দেওয়া তথ্য সঠিক নয়।';
      return Response.json(
        {
          success: false,
          error: firstErrorMessage
        },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      customerAddress,
      customerDistrict,
      customerEmail,
      productId,
      quantity,
      variant,
      deliveryZone,
      notes
    } = validationResult.data;

    // Optional Idempotency Key from client header or payload
    const idempotencyKey = request.headers.get('x-idempotency-key') || body.idempotencyKey;
    const orders = await getCollection('orders');

    if (idempotencyKey) {
      const existingOrder = await orders.findOne({ idempotencyKey });
      if (existingOrder) {
        return Response.json({
          success: true,
          message: 'অর্ডারটি পূর্বেই গ্রহণ করা হয়েছে।',
          orderReference: existingOrder.orderReference,
          confirmationToken: existingOrder._tempPlainToken || null
        });
      }
    }

    // 2. Fetch trusted product data directly from MongoDB
    const products = await getCollection('products');
    let productQuery = {};

    // Support both string ObjectId and slug/id
    try {
      productQuery = { $or: [{ _id: new ObjectId(productId) }, { _id: productId }, { slug: productId }] };
    } catch {
      productQuery = { $or: [{ _id: productId }, { slug: productId }] };
    }

    const product = await products.findOne(productQuery);

    if (!product || product.status !== 'published') {
      return Response.json(
        { success: false, error: 'পণ্যটি বর্তমানে আর বিক্রয়ের জন্য সহজলভ্য নয়।' },
        { status: 404 }
      );
    }

    // Check stock if tracked
    if (typeof product.stockQuantity === 'number' && product.stockQuantity < quantity) {
      return Response.json(
        { success: false, error: `দুঃখিত! এই পণ্যটি বর্তমানে স্টকে পর্যাপ্ত নেই (সর্বোচ্চ ${product.stockQuantity} টি অর্ডার করতে পারবেন)।` },
        { status: 400 }
      );
    }

    // 3. Fetch latest store settings for delivery fees
    const settings = await getCollection('settings');
    const storeSettings = await settings.findOne({ key: 'store_settings' });

    // 4. Server-side price recalculation (Never trust browser totals)
    const pricing = calculateOrderPricing({
      unitPrice: product.price,
      quantity,
      deliveryZone,
      discount: 0,
      shippingSettings: storeSettings
    });

    // 5. Generate unique public order reference and secure high-entropy confirmation token
    let orderReference = generateOrderReference();
    let collisionCheck = await orders.findOne({ orderReference });
    while (collisionCheck) {
      orderReference = generateOrderReference();
      collisionCheck = await orders.findOne({ orderReference });
    }

    const confirmationToken = generateConfirmationToken();
    const confirmationTokenHash = hashConfirmationToken(confirmationToken);

    // 6. Create immutable order document with item snapshot
    const newOrder = {
      orderReference,
      confirmationTokenHash,
      idempotencyKey: idempotencyKey || null,
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        district: customerDistrict,
        email: customerEmail || null,
        notes: notes || ''
      },
      items: [
        {
          productId: product._id ? product._id.toString() : productId,
          productName: product.name,
          slug: product.slug,
          image: product.images?.[0] || '',
          unitPrice: pricing.unitPrice,
          quantity: pricing.quantity,
          variant: variant || null,
          subtotal: pricing.subtotal
        }
      ],
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      deliveryCharge: pricing.deliveryCharge,
      deliveryZone,
      total: pricing.total,
      currency: 'BDT',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'unpaid',
      orderStatus: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'অর্ডার সফলভাবে প্লেস করা হয়েছে (Cash on Delivery)'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const insertResult = await orders.insertOne(newOrder);

    // Optional: decrement stock quantity safely
    if (typeof product.stockQuantity === 'number') {
      await products.updateOne(
        { _id: product._id },
        { $inc: { stockQuantity: -quantity } }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!',
        orderReference,
        confirmationToken,
        total: pricing.total
      },
      {
        status: 201,
        headers: {
          'Set-Cookie': `bichitra_last_order=${orderReference}:${confirmationToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
        }
      }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return Response.json(
      { success: false, error: 'অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
