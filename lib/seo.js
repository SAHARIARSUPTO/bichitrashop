// lib/seo.js
// Centralized SEO, OpenGraph metadata and contact configuration


export const OFFICIAL_HOTLINE = '01761674164';
export const OFFICIAL_HOTLINE_FORMATTED = '01761-674164';
export const OFFICIAL_HOTLINE_TEL = '+8801761674164';
export const OFFICIAL_WHATSAPP_NUMBER = '8801761674164';
export const OFFICIAL_FACEBOOK_PAGE = 'https://www.facebook.com/bichitra.shop44';
export const OFFICIAL_FACEBOOK_PIXEL_ID = '2204374163789446';

export const FINAL_DOMAIN = 'bichitrashop.vercel.app';
export const DEFAULT_SITE_URL = 'https://bichitrashop.vercel.app';
export const DEFAULT_SOCIAL_POSTER = '/bichitra-social-poster.jpg';
export const DEFAULT_SITE_ICON = '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png';

/**
 * Returns the canonical live site base URL.
 * Strictly filters out invalid/stale domains like bichitrashopbd.com.bd, localhost, etc.,
 * ensuring the verified production domain bichitrashop.vercel.app is always used.
 */
export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    // Ignore invalid/stale domains or localhost in production
    if (
      !trimmed.includes('bichitrashopbd') &&
      !trimmed.includes('localhost') &&
      !trimmed.includes('127.0.0.1')
    ) {
      return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    }
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    const vUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL.trim().replace(/\/+$/, '');
    if (!vUrl.includes('bichitrashopbd')) {
      return `https://${vUrl}`;
    }
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
  if (trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('http://')) {
    return trimmed.replace('http://', 'https://');
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${getSiteUrl()}${cleanPath}`;
}

/**
 * Format image URL specifically for OpenGraph and Twitter cards.
 * If the image is on Cloudinary, automatically applies optimal OpenGraph transformations:
 * - c_fill,w_1200,h_630: Exact 1.91:1 ratio for Facebook & Twitter large card
 * - q_auto,f_jpg: Crisp JPEG under 200KB to satisfy WhatsApp's strict 300KB limit
 * - g_auto: Smart content/product awareness cropping
 */
export function toOgImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return `${getSiteUrl()}${DEFAULT_SOCIAL_POSTER}`;
  }
  let clean = imageUrl.trim();
  if (clean.startsWith('http://')) {
    clean = clean.replace('http://', 'https://');
  }
  if (clean.includes('res.cloudinary.com') && clean.includes('/upload/')) {
    if (!clean.includes('/upload/c_') && !clean.includes('/upload/w_')) {
      clean = clean.replace(
        '/upload/',
        '/upload/c_fill,w_1200,h_630,g_auto,q_auto,f_jpg/'
      );
    }
    return clean;
  }
  return toAbsoluteUrl(clean);
}
