// lib/seo.js
// Centralized SEO, OpenGraph metadata and contact configuration

import { getCollection } from './mongodb.js';

export const OFFICIAL_HOTLINE = '01761674164';
export const OFFICIAL_HOTLINE_FORMATTED = '01761-674164';
export const OFFICIAL_HOTLINE_TEL = '+8801761674164';
export const OFFICIAL_WHATSAPP_NUMBER = '8801761674164';

export const DEFAULT_SITE_URL = 'https://bichitrashop.vercel.app';
export const DEFAULT_SOCIAL_POSTER = '/bichitra-social-poster.jpg';
export const DEFAULT_SITE_ICON = '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png';

export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return DEFAULT_SITE_URL;
}

/**
 * Convert any image URL (relative or CDN) into an absolute URL
 * Required for Facebook, WhatsApp, Twitter, and Telegram OpenGraph scrapers
 */
export function toAbsoluteUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return `${getSiteUrl()}${DEFAULT_SOCIAL_POSTER}`;
  }
  const trimmed = imageUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${getSiteUrl()}${cleanPath}`;
}

/**
 * Fetch dynamic store settings for SEO, Contact and Branding
 */
export async function getStoreSettings() {
  try {
    const settingsColl = await getCollection('settings');
    const settings = await settingsColl.findOne({ key: 'store_settings' });
    return settings || null;
  } catch (error) {
    console.error('Failed to load store settings for SEO:', error);
    return null;
  }
}
