// tests/pricing.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateOrderPricing, getDeliveryCharge, formatBDT } from '../lib/pricing.js';

describe('Pricing and Delivery Calculation Engine', () => {
  it('should calculate Inside Dhaka delivery charge correctly (৳70)', () => {
    assert.strictEqual(getDeliveryCharge('inside_dhaka'), 70);
    assert.strictEqual(getDeliveryCharge('Inside Dhaka'), 70);
    assert.strictEqual(getDeliveryCharge('ঢাকা'), 70);
  });

  it('should calculate Outside Dhaka delivery charge correctly (৳130)', () => {
    assert.strictEqual(getDeliveryCharge('outside_dhaka'), 130);
    assert.strictEqual(getDeliveryCharge('Chattogram'), 130);
    assert.strictEqual(getDeliveryCharge('Sylhet'), 130);
  });

  it('should correctly apply the master pricing formula: Total = Subtotal - Discount + Delivery', () => {
    // Formula test: Unit price = ৳1,850, Quantity = 2, Delivery = ৳70
    // Subtotal = 1850 * 2 = 3700
    // Total = 3700 + 70 = 3770
    const pricing = calculateOrderPricing({
      unitPrice: 1850,
      quantity: 2,
      deliveryZone: 'inside_dhaka',
      discount: 0
    });

    assert.strictEqual(pricing.unitPrice, 1850);
    assert.strictEqual(pricing.quantity, 2);
    assert.strictEqual(pricing.subtotal, 3700);
    assert.strictEqual(pricing.deliveryCharge, 70);
    assert.strictEqual(pricing.discount, 0);
    assert.strictEqual(pricing.total, 3770);
  });

  it('should handle discounts safely without exceeding subtotal', () => {
    const pricing = calculateOrderPricing({
      unitPrice: 1000,
      quantity: 1,
      deliveryZone: 'outside_dhaka',
      discount: 200
    });

    assert.strictEqual(pricing.subtotal, 1000);
    assert.strictEqual(pricing.discount, 200);
    assert.strictEqual(pricing.deliveryCharge, 130);
    assert.strictEqual(pricing.total, 930); // 1000 - 200 + 130
  });

  it('should format BDT currency properly with ৳ symbol', () => {
    assert.strictEqual(formatBDT(2490), '৳2,490');
    assert.strictEqual(formatBDT(0), '৳0');
  });
});
