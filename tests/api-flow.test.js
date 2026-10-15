// tests/api-flow.test.js
import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { hashPassword, verifyPassword, createAdminToken, verifyAdminToken } from '../lib/auth.js';
import { getCollection } from '../lib/mongodb.js';
import { calculateOrderPricing } from '../lib/pricing.js';
import { generateOrderReference, generateConfirmationToken, hashConfirmationToken, verifyConfirmationToken } from '../lib/order-ref.js';
import { initDatabase } from '../lib/db-init.js';

describe('End-to-End Business Logic and Authentication Flows', () => {
  before(async () => {
    await initDatabase();
  });

  it('should securely hash passwords and verify them without storing plain text', async () => {
    const rawPassword = 'BichitraAdminSecure2026!';
    const hashed = await hashPassword(rawPassword);

    assert.notStrictEqual(hashed, rawPassword);
    assert.strictEqual(hashed.startsWith('$2'), true); // bcrypt hash format

    const isMatch = await verifyPassword(rawPassword, hashed);
    assert.strictEqual(isMatch, true);

    const isFalseMatch = await verifyPassword('WrongPassword', hashed);
    assert.strictEqual(isFalseMatch, false);
  });

  it('should sign and verify admin JWT session tokens', async () => {
    const payload = { id: 'admin123', email: 'admin@bichitrashop.com', role: 'superadmin' };
    const token = await createAdminToken(payload);

    assert.strictEqual(typeof token, 'string');
    assert.ok(token.length > 30);

    const decoded = await verifyAdminToken(token);
    assert.strictEqual(decoded.id, 'admin123');
    assert.strictEqual(decoded.email, 'admin@bichitrashop.com');
    assert.strictEqual(decoded.role, 'superadmin');

    const invalid = await verifyAdminToken('tampered.jwt.token');
    assert.strictEqual(invalid, null);
  });

  it('should process guest checkout order with immutable price snapshot and confirmation token', async () => {
    const products = await getCollection('products');
    const orders = await getCollection('orders');

    // Retrieve a product from database
    const testProduct = await products.findOne({ status: 'published' });
    assert.ok(testProduct, 'Test product should exist in database');

    const quantity = 3;
    const deliveryZone = 'inside_dhaka';

    // Recalculate price on server
    const pricing = calculateOrderPricing({
      unitPrice: testProduct.price,
      quantity,
      deliveryZone,
      discount: 0
    });

    assert.strictEqual(pricing.unitPrice, testProduct.price);
    assert.strictEqual(pricing.quantity, 3);
    assert.strictEqual(pricing.subtotal, testProduct.price * 3);
    assert.strictEqual(pricing.deliveryCharge, 70);
    assert.strictEqual(pricing.total, testProduct.price * 3 + 70);

    // Create order with high-entropy confirmation token
    const orderReference = generateOrderReference();
    const plainToken = generateConfirmationToken();
    const confirmationTokenHash = hashConfirmationToken(plainToken);

    const orderDoc = {
      orderReference,
      confirmationTokenHash,
      customer: {
        name: 'রাশেদ খান',
        phone: '01812345678',
        address: 'রোড ৪, সেক্টর ৭, উত্তরা, ঢাকা',
        district: 'ঢাকা'
      },
      items: [
        {
          productId: testProduct._id.toString(),
          productName: testProduct.name,
          slug: testProduct.slug,
          unitPrice: pricing.unitPrice,
          quantity: pricing.quantity,
          subtotal: pricing.subtotal
        }
      ],
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      deliveryCharge: pricing.deliveryCharge,
      deliveryZone,
      total: pricing.total,
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'unpaid',
      orderStatus: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'অর্ডার প্লেস করা হয়েছে'
        }
      ],
      createdAt: new Date().toISOString()
    };

    const insertResult = await orders.insertOne(orderDoc);
    assert.ok(insertResult.acknowledged);

    // Verify confirmation token against stored hash
    const savedOrder = await orders.findOne({ orderReference });
    assert.ok(savedOrder);
    assert.strictEqual(verifyConfirmationToken(plainToken, savedOrder.confirmationTokenHash), true);
    assert.strictEqual(verifyConfirmationToken('fake_token', savedOrder.confirmationTokenHash), false);

    // Test order status update lifecycle
    const newStatus = 'shipped';
    const updatedHistory = [
      ...savedOrder.statusHistory,
      { status: newStatus, timestamp: new Date().toISOString(), note: 'কুরিয়ারে পাঠানো হয়েছে' }
    ];

    await orders.updateOne(
      { orderReference },
      { $set: { orderStatus: newStatus, statusHistory: updatedHistory } }
    );

    const orderAfterStatusChange = await orders.findOne({ orderReference });
    assert.strictEqual(orderAfterStatusChange.orderStatus, 'shipped');
    assert.strictEqual(orderAfterStatusChange.statusHistory.length, 2);
    // Verify prices remained 100% immutable!
    assert.strictEqual(orderAfterStatusChange.total, pricing.total);
    assert.strictEqual(orderAfterStatusChange.items[0].unitPrice, testProduct.price);
  });
});
