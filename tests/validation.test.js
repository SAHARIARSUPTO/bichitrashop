// tests/validation.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  normalizeBangladeshPhone,
  bangladeshPhoneRegex,
  checkoutSchema,
  productSchema,
  orderStatusUpdateSchema
} from '../lib/validation.js';

describe('Validation Engine and Schema Rules', () => {
  it('should validate and normalize authentic Bangladesh phone numbers', () => {
    // Valid phone numbers
    assert.strictEqual(bangladeshPhoneRegex.test('01712345678'), true);
    assert.strictEqual(bangladeshPhoneRegex.test('+8801812345678'), true);
    assert.strictEqual(bangladeshPhoneRegex.test('8801912345678'), true);
    assert.strictEqual(bangladeshPhoneRegex.test('01312345678'), true);

    // Normalization to 01XXXXXXXXX
    assert.strictEqual(normalizeBangladeshPhone('+8801712345678'), '01712345678');
    assert.strictEqual(normalizeBangladeshPhone('8801812345678'), '01812345678');
    assert.strictEqual(normalizeBangladeshPhone('01912345678'), '01912345678');

    // Invalid phone numbers
    assert.strictEqual(bangladeshPhoneRegex.test('01212345678'), false); // invalid prefix 012
    assert.strictEqual(bangladeshPhoneRegex.test('0171234567'), false);  // only 10 digits
    assert.strictEqual(bangladeshPhoneRegex.test('12345678901'), false); // not starting with 01
  });

  it('should accept valid guest checkout submission', () => {
    const validData = {
      customerName: 'তানভীর আহমেদ',
      customerPhone: '01712345678',
      customerAddress: 'হাউজ ১২, রোড ৫, মিরপুর ১০',
      customerDistrict: 'ঢাকা (Dhaka)',
      productId: 'exclusive-koti-set',
      quantity: 2,
      deliveryZone: 'inside_dhaka'
    };

    const res = checkoutSchema.safeParse(validData);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.customerPhone, '01712345678');
    assert.strictEqual(res.data.quantity, 2);
  });

  it('should reject invalid guest checkout submissions', () => {
    const missingPhone = {
      customerName: 'তানভীর আহমেদ',
      customerPhone: '123',
      customerAddress: 'মিরপুর',
      customerDistrict: 'ঢাকা',
      productId: 'prod1',
      deliveryZone: 'inside_dhaka'
    };

    const res = checkoutSchema.safeParse(missingPhone);
    assert.strictEqual(res.success, false);
    assert.ok(res.error.issues.some(i => i.path.includes('customerPhone')));
  });

  it('should validate allowed order status updates', () => {
    const allowed = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    for (const status of allowed) {
      const res = orderStatusUpdateSchema.safeParse({ status });
      assert.strictEqual(res.success, true);
    }

    const invalid = orderStatusUpdateSchema.safeParse({ status: 'refunded_unknown' });
    assert.strictEqual(invalid.success, false);
  });
});
