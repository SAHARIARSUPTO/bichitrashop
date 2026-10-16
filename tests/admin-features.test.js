// tests/admin-features.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getCollection } from '../lib/mongodb.js';
import { generateOrderReference } from '../lib/order-ref.js';
import { getDeliveryCharge, calculateOrderPricing } from '../lib/pricing.js';

describe('Admin Product Bulk & Complete Deletion in Database Engine', () => {
  it('should delete selected products using deleteMany with $in condition', async () => {
    const productsColl = await getCollection('test_products_bulk');
    // Clear test coll
    await productsColl.deleteMany({});

    // Insert dummy products
    await productsColl.insertOne({ _id: 'prod-1', name: 'Item 1', status: 'published' });
    await productsColl.insertOne({ _id: 'prod-2', name: 'Item 2', status: 'published' });
    await productsColl.insertOne({ _id: 'prod-3', name: 'Item 3', status: 'published' });

    let count = (await productsColl.find({}).toArray()).length;
    assert.strictEqual(count, 3);

    // Delete selected: prod-1 and prod-3
    const deleteRes = await productsColl.deleteMany({ _id: { $in: ['prod-1', 'prod-3'] } });
    assert.strictEqual(deleteRes.deletedCount, 2);

    const remaining = await productsColl.find({}).toArray();
    assert.strictEqual(remaining.length, 1);
    assert.strictEqual(remaining[0]._id, 'prod-2');
  });

  it('should delete all products using deleteMany with empty query', async () => {
    const productsColl = await getCollection('test_products_all');
    await productsColl.deleteMany({});

    await productsColl.insertOne({ _id: 'all-1', name: 'Product A' });
    await productsColl.insertOne({ _id: 'all-2', name: 'Product B' });
    assert.strictEqual((await productsColl.find({}).toArray()).length, 2);

    const result = await productsColl.deleteMany({});
    assert.strictEqual(result.deletedCount, 2);
    assert.strictEqual((await productsColl.find({}).toArray()).length, 0);
  });
});

describe('Admin Orders & Revenue Sync Engine', () => {
  it('should accurately compute synchronized revenue statistics across orders', () => {
    const testOrders = [
      { orderReference: 'BC-001', status: 'delivered', total: 1200 },
      { orderReference: 'BC-002', status: 'confirmed', total: 850 },
      { orderReference: 'BC-003', status: 'pending', total: 500 },
      { orderReference: 'BC-004', status: 'cancelled', total: 600 },
      { orderReference: 'BC-005', status: 'delivered', total: 1400 },
    ];

    const activeOrders = testOrders.filter(o => o.status !== 'cancelled');
    const totalActiveRevenue = activeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const deliveredRevenue = testOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingRevenue = testOrders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).reduce((sum, o) => sum + (o.total || 0), 0);

    assert.strictEqual(totalActiveRevenue, 1200 + 850 + 500 + 1400); // 3950
    assert.strictEqual(deliveredRevenue, 1200 + 1400); // 2600
    assert.strictEqual(pendingRevenue, 850 + 500); // 1350
  });

  it('should calculate valid manual order with pricing and reference structure', () => {
    const ref = generateOrderReference();
    assert.match(ref, /^BC-[A-Z0-9]{6}-[A-Z0-9]{2}$/);

    const delivery = getDeliveryCharge('inside_dhaka'); // 70
    assert.strictEqual(delivery, 70);

    const pricing = calculateOrderPricing({
      unitPrice: 500,
      quantity: 3,
      deliveryZone: 'inside_dhaka',
      discount: 100
    });

    assert.strictEqual(pricing.subtotal, 1500);
    assert.strictEqual(pricing.deliveryCharge, 70);
    assert.strictEqual(pricing.discount, 100);
    assert.strictEqual(pricing.total, 1470);
  });
});
