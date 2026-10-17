import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { OFFICIAL_GTM_ID } from '../lib/seo.js';
import {
  OFFICIAL_GTM_ID as GTM_ID_FROM_GTM_LIB,
  pushDataLayerEvent,
  trackGtmViewItem,
  trackGtmAddToCart,
  trackGtmBeginCheckout,
  trackGtmPurchase
} from '../lib/gtm.js';

describe('Google Tag Manager (GTM) Integration Suite', () => {
  it('exports the official Google Tag Manager container ID GTM-T7BT3F2L', () => {
    assert.strictEqual(
      OFFICIAL_GTM_ID,
      'GTM-T7BT3F2L',
      'OFFICIAL_GTM_ID in lib/seo.js must match GTM-T7BT3F2L'
    );
    assert.strictEqual(
      GTM_ID_FROM_GTM_LIB,
      'GTM-T7BT3F2L',
      'OFFICIAL_GTM_ID in lib/gtm.js must match GTM-T7BT3F2L'
    );
  });

  it('lib/gtm.js functions safely execute when window is undefined without throwing', () => {
    assert.doesNotThrow(() => {
      pushDataLayerEvent('custom_event', { key: 'val' });
      trackGtmViewItem({ name: 'পাঞ্জাবি', price: 1200, slug: 'panjabi', category: 'mens' });
      trackGtmAddToCart({ name: 'পাঞ্জাবি', price: 1200, slug: 'panjabi' }, 2);
      trackGtmBeginCheckout([{ name: 'পাঞ্জাবি', price: 1200, slug: 'panjabi' }], 2400);
      trackGtmPurchase({ orderReference: 'BC-123456', total: 2470, items: [{ slug: 'panjabi', unitPrice: 1200, quantity: 2 }] });
    });
  });

  it('lib/gtm.js properly populates window.dataLayer with standard GA4/GTM ecommerce events', () => {
    const dataLayer = [];
    global.window = { dataLayer };

    try {
      trackGtmViewItem({ name: 'কোটি সেট', price: 1850, slug: 'koti-set', category: 'mens-fashion' });
      assert.strictEqual(dataLayer.length, 1);
      assert.strictEqual(dataLayer[0].event, 'view_item');
      assert.strictEqual(dataLayer[0].ecommerce.value, 1850);
      assert.strictEqual(dataLayer[0].ecommerce.currency, 'BDT');
      assert.strictEqual(dataLayer[0].ecommerce.items[0].item_name, 'কোটি সেট');

      trackGtmAddToCart({ name: 'কোটি সেট', price: 1850, slug: 'koti-set', category: 'mens-fashion' }, 2);
      assert.strictEqual(dataLayer.length, 2);
      assert.strictEqual(dataLayer[1].event, 'add_to_cart');
      assert.strictEqual(dataLayer[1].ecommerce.value, 3700);

      trackGtmBeginCheckout([{ name: 'কোটি সেট', price: 1850, quantity: 2 }], 3770);
      assert.strictEqual(dataLayer.length, 3);
      assert.strictEqual(dataLayer[2].event, 'begin_checkout');
      assert.strictEqual(dataLayer[2].ecommerce.value, 3770);

      trackGtmPurchase({ orderReference: 'BC-999888', total: 3770, items: [{ productName: 'কোটি সেট', unitPrice: 1850, quantity: 2 }] });
      assert.strictEqual(dataLayer.length, 4);
      assert.strictEqual(dataLayer[3].event, 'purchase');
      assert.strictEqual(dataLayer[3].ecommerce.transaction_id, 'BC-999888');
      assert.strictEqual(dataLayer[3].ecommerce.value, 3770);
    } finally {
      delete global.window;
    }
  });

  it('app/components/GoogleTagManager.jsx exists and loads gtm.js and noscript iframe', () => {
    const filePath = path.join(process.cwd(), 'app', 'components', 'GoogleTagManager.jsx');
    assert.ok(fs.existsSync(filePath), 'GoogleTagManager.jsx must exist');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('https://www.googletagmanager.com/gtm.js?id='), 'Must load GTM script');
    assert.ok(content.includes('https://www.googletagmanager.com/ns.html?id='), 'Must include GTM noscript iframe');
    assert.ok(content.includes('GTM-T7BT3F2L'), 'Must default to container GTM-T7BT3F2L');
    assert.ok(content.includes('usePathname'), 'Must track route changes');
  });

  it('app/layout.jsx renders Google Tag Manager noscript and client component', () => {
    const filePath = path.join(process.cwd(), 'app', 'layout.jsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('GoogleTagManager'), 'RootLayout must import GoogleTagManager');
    assert.ok(content.includes('googletagmanager.com/ns.html?id='), 'RootLayout must contain GTM noscript iframe');
    assert.ok(content.includes('<GoogleTagManager gtmId={googleTagManagerId} />'), 'RootLayout must render GoogleTagManager');
  });

  it('app/admin/settings/SettingsManager.jsx provides UI for Google Tag Manager ID', () => {
    const filePath = path.join(process.cwd(), 'app', 'admin', 'settings', 'SettingsManager.jsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('googleTagManagerId'), 'SettingsManager must manage googleTagManagerId');
    assert.ok(content.includes('GTM-T7BT3F2L'), 'SettingsManager must mention GTM-T7BT3F2L as default/placeholder');
  });

  it('app/api/admin/settings/route.js stores and returns googleTagManagerId', () => {
    const filePath = path.join(process.cwd(), 'app', 'api', 'admin', 'settings', 'route.js');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('googleTagManagerId'), 'Settings route must handle googleTagManagerId in GET and POST');
  });
});
