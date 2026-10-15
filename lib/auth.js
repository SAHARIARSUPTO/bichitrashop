// lib/auth.js
// Secure server-validated admin authentication using bcryptjs and jose (JWT)

import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET_STRING = process.env.ADMIN_JWT_SECRET || 'bichitra_shop_super_secure_admin_jwt_secret_key_2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = 'bichitra_admin_token';

/**
 * Hash password securely with bcrypt salt rounds = 12
 */
export async function hashPassword(plainTextPassword) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainTextPassword, salt);
}

/**
 * Compare password against hash
 */
export async function verifyPassword(plainTextPassword, hashedPassword) {
  if (!plainTextPassword || !hashedPassword) return false;
  return bcrypt.compare(plainTextPassword, hashedPassword);
}

/**
 * Sign admin session JWT (valid for 24 hours)
 */
export async function createAdminToken(payload) {
  return new SignJWT({
    id: payload.id,
    email: payload.email,
    role: payload.role || 'admin',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

/**
 * Verify and decode admin session JWT
 */
export async function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Get current admin session from incoming Next.js Request (Route Handler)
 */
export async function getAdminFromRequest(request) {
  // Check cookie header
  let token = null;
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (match) {
    token = decodeURIComponent(match[1]);
  }

  // Fallback to Authorization: Bearer <token>
  if (!token) {
    const authHeader = request.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Get current admin session from server components (using next/headers cookies)
 */
export async function getAdminSession() {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyAdminToken(token);
  } catch (err) {
    return null;
  }
}

export { COOKIE_NAME };
