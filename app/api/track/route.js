// app/api/track/route.js
// High-performance visitor & customer traffic tracking endpoint for SEO analytics

import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

function detectTrafficSource(referrerUrl, utmSource, fullUrl = '') {
  const ref = (referrerUrl || '').toLowerCase();
  const utm = (utmSource || '').toLowerCase();
  const full = (fullUrl || '').toLowerCase();

  // Facebook (Organic, Ads, Messenger, l.facebook.com, m.facebook.com, fbclid)
  if (
    ref.includes('facebook.com') ||
    ref.includes('fb.me') ||
    ref.includes('messenger.com') ||
    utm.includes('facebook') ||
    utm.includes('fb') ||
    full.includes('fbclid=')
  ) {
    return 'Facebook';
  }

  // Google (Google Search, Discover, Ads, gclid)
  if (
    ref.includes('google.com') ||
    ref.includes('google.com.bd') ||
    utm.includes('google') ||
    full.includes('gclid=')
  ) {
    return 'Google Search';
  }

  // Instagram
  if (ref.includes('instagram.com') || utm.includes('instagram') || utm.includes('ig')) {
    return 'Instagram';
  }

  // TikTok
  if (ref.includes('tiktok.com') || utm.includes('tiktok')) {
    return 'TikTok';
  }

  // YouTube
  if (ref.includes('youtube.com') || ref.includes('youtu.be') || utm.includes('youtube')) {
    return 'YouTube';
  }

  // WhatsApp
  if (ref.includes('whatsapp') || ref.includes('wa.me') || utm.includes('whatsapp')) {
    return 'WhatsApp';
  }

  // Direct / Internal navigation
  if (!ref || ref.includes('bichitrashop') || ref.includes('localhost') || ref.includes('127.0.0.1')) {
    return 'Direct / Organic';
  }

  // Other External Referral Website
  try {
    const urlObj = new URL(referrerUrl);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return 'Other Referral';
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      path,
      title,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      device = 'Mobile',
      sessionId
    } = body;

    // Disregard tracking for admin panel and internal system routes
    if (!path || path.startsWith('/admin') || path.startsWith('/api')) {
      return Response.json({ success: true, ignored: true });
    }

    const source = detectTrafficSource(referrer, utmSource, path);

    await initDatabase();
    const analytics = await getCollection('analytics_events');

    const event = {
      path: path.split('?')[0],
      fullPath: path,
      title: title || 'Bichitra Shop',
      referrer: referrer || '',
      source,
      utm: {
        source: utmSource || '',
        medium: utmMedium || '',
        campaign: utmCampaign || ''
      },
      device: device || 'Mobile',
      sessionId: sessionId || 'anon',
      createdAt: new Date().toISOString()
    };

    await analytics.insertOne(event);

    return Response.json({ success: true });
  } catch (error) {
    // Fail silently so tracking never disrupts customer experience
    return Response.json({ success: false }, { status: 200 });
  }
}
