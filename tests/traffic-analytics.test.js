// tests/traffic-analytics.test.js
// Unit tests for Traffic Tracking, Source Detection (Facebook vs Google), and Store Location settings

import test from 'node:test';
import assert from 'node:assert/strict';

function detectTrafficSource(referrerUrl, utmSource, fullUrl = '') {
  const ref = (referrerUrl || '').toLowerCase();
  const utm = (utmSource || '').toLowerCase();
  const full = (fullUrl || '').toLowerCase();

  // Facebook
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

  // Google
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

  // Direct / Organic
  if (!ref || ref.includes('bichitrashop') || ref.includes('localhost') || ref.includes('127.0.0.1')) {
    return 'Direct / Organic';
  }

  try {
    const urlObj = new URL(referrerUrl);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return 'Other Referral';
  }
}

test('Customer Traffic Source Detection Engine', async (t) => {
  await t.test('should identify Facebook traffic from referrers, utm, or fbclid', () => {
    assert.equal(detectTrafficSource('https://l.facebook.com/l.php?u=...'), 'Facebook');
    assert.equal(detectTrafficSource('https://m.facebook.com/'), 'Facebook');
    assert.equal(detectTrafficSource('', 'facebook_ads', '/products/koti'), 'Facebook');
    assert.equal(detectTrafficSource('', '', '/products/koti?fbclid=IwAR123abc'), 'Facebook');
  });

  await t.test('should identify Google Search traffic from referrers, utm, or gclid', () => {
    assert.equal(detectTrafficSource('https://www.google.com/'), 'Google Search');
    assert.equal(detectTrafficSource('https://www.google.com.bd/search?q=koti'), 'Google Search');
    assert.equal(detectTrafficSource('', 'google_cpc'), 'Google Search');
    assert.equal(detectTrafficSource('', '', '/products/abaya?gclid=EAIaIQobCh...'), 'Google Search');
  });

  await t.test('should identify WhatsApp and Instagram referrals', () => {
    assert.equal(detectTrafficSource('https://web.whatsapp.com/'), 'WhatsApp');
    assert.equal(detectTrafficSource('https://l.instagram.com/'), 'Instagram');
  });

  await t.test('should categorize direct visitors or internal navigation as Direct / Organic', () => {
    assert.equal(detectTrafficSource(''), 'Direct / Organic');
    assert.equal(detectTrafficSource('http://localhost:3000/'), 'Direct / Organic');
  });
});

test('Store Location & Hotline Verification', async (t) => {
  await t.test('should verify shop address is updated to রহনপুর, চাঁপাইনবাবগঞ্জ and hotline is 01761674164', async () => {
    const { getCollection } = await import('../lib/mongodb.js');
    const { initDatabase } = await import('../lib/db-init.js');

    await initDatabase();
    const settings = await getCollection('settings');
    const storeSettings = await settings.findOne({ key: 'store_settings' });

    assert.ok(storeSettings, 'store settings document must exist');
    assert.ok(
      storeSettings.contact.address.includes('রহনপুর') && storeSettings.contact.address.includes('চাঁপাইনবাবগঞ্জ'),
      `Expected address to contain Rohanpur and Chapainawabganj, got: ${storeSettings.contact.address}`
    );
    assert.equal(storeSettings.contact.phone, '01761674164');
  });
});
