// tests/order-ref.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  generateOrderReference,
  generateConfirmationToken,
  hashConfirmationToken,
  verifyConfirmationToken
} from '../lib/order-ref.js';

describe('Order Reference and Token Security', () => {
  it('should generate non-sequential order reference matching format BC-XXXXXX-XX', () => {
    const ref1 = generateOrderReference();
    const ref2 = generateOrderReference();

    assert.ok(ref1.startsWith('BC-'), 'Order reference must start with BC-');
    assert.ok(ref2.startsWith('BC-'), 'Order reference must start with BC-');
    assert.notStrictEqual(ref1, ref2, 'Sequential references should not collide');
    assert.match(ref1, /^BC-\d{6}-[A-Z0-9]{2}$/);
  });

  it('should generate high-entropy tokens and verify correctly using constant-time hash', () => {
    const token = generateConfirmationToken();
    assert.strictEqual(token.length, 64); // 32 bytes hex = 64 characters

    const hash = hashConfirmationToken(token);
    assert.strictEqual(hash.length, 64); // SHA-256 hex = 64 characters

    // Correct token verification
    assert.strictEqual(verifyConfirmationToken(token, hash), true);

    // Tampered token verification rejection
    assert.strictEqual(verifyConfirmationToken('tampered_token_string', hash), false);
    assert.strictEqual(verifyConfirmationToken(null, hash), false);
    assert.strictEqual(verifyConfirmationToken(token, 'invalid_hash'), false);
  });
});
