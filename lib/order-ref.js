// lib/order-ref.js
// Non-sequential public order reference and secure high-entropy confirmation token generation

import crypto from 'crypto';

/**
 * Generate a customer-friendly, non-sequential order reference
 * Format: BC-XXXXXX (e.g. BC-894215)
 */
export function generateOrderReference() {
  const randomBytes = crypto.randomBytes(3);
  const number = parseInt(randomBytes.toString('hex'), 16) % 900000 + 100000;
  const suffix = crypto.randomBytes(1).toString('hex').toUpperCase().slice(0, 2);
  return `BC-${number}-${suffix}`;
}

/**
 * Generate a high-entropy 32-byte secret confirmation token
 */
export function generateConfirmationToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash confirmation token with SHA-256 for safe storage in the database
 */
export function hashConfirmationToken(token) {
  if (!token) return '';
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Constant-time verification of token against stored hash
 */
export function verifyConfirmationToken(token, storedHash) {
  if (!token || !storedHash) return false;
  const computedHash = hashConfirmationToken(token);
  try {
    const a = Buffer.from(computedHash, 'hex');
    const b = Buffer.from(storedHash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
