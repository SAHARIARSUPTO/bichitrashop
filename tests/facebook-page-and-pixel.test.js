import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { OFFICIAL_FACEBOOK_PAGE } from '../lib/seo.js';
import {
  trackPixelEvent,
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase
} from '../lib/pixel.js';

describe('Facebook Page & Meta Pixel Integration', () => {
  it('lib/seo.js exports the official Facebook Page URL', () => {
    assert.strictEqual(
      OFFICIAL_FACEBOOK_PAGE,
      'https://www.facebook.com/bichitra.shop44',
      'OFFICIAL_FACEBOOK_PAGE must match the user’s Facebook page'
    );
  });

  it('lib/pixel.js functions safely execute when window.fbq is unavailable without throwing', () => {
    // Under Node.js test runner window is undefined
    assert.doesNotThrow(() => {
      trackPixelEvent('CustomEvent', { test: true });
      trackViewContent({ name: 'Test Product', price: 950, slug: 'test-product', category: 'fashion' });
      trackAddToCart({ name: 'Test Product', price: 950, slug: 'test-product' }, 2);
      trackInitiateCheckout([{ name: 'Test', price: 950, slug: 'test' }], 1900);
      trackPurchase({ orderReference: 'ORD123', total: 1970, items: [{ slug: 'test' }] });
    });
  });

  it('lib/pixel.js properly dispatches to window.fbq when present', () => {
    const recordedEvents = [];
    global.window = {
      fbq: (action, eventName, params) => {
        recordedEvents.push({ action, eventName, params });
      }
    };

    try {
      trackViewContent({ name: 'পাঞ্জাবি কোটি সেট', price: 1250, slug: 'panjabi-koti', category: 'mens-fashion' });
      assert.strictEqual(recordedEvents.length, 1);
      assert.strictEqual(recordedEvents[0].action, 'track');
      assert.strictEqual(recordedEvents[0].eventName, 'ViewContent');
      assert.strictEqual(recordedEvents[0].params.content_name, 'পাঞ্জাবি কোটি সেট');
      assert.strictEqual(recordedEvents[0].params.currency, 'BDT');
      assert.strictEqual(recordedEvents[0].params.value, 1250);

      trackAddToCart({ name: 'পাঞ্জাবি কোটি সেট', price: 1250, slug: 'panjabi-koti' }, 2);
      assert.strictEqual(recordedEvents.length, 2);
      assert.strictEqual(recordedEvents[1].eventName, 'AddToCart');
      assert.strictEqual(recordedEvents[1].params.value, 2500);

      trackInitiateCheckout([{ slug: 'panjabi-koti' }], 2570);
      assert.strictEqual(recordedEvents.length, 3);
      assert.strictEqual(recordedEvents[2].eventName, 'InitiateCheckout');
      assert.strictEqual(recordedEvents[2].params.value, 2570);

      trackPurchase({ total: 2570, items: [{ slug: 'panjabi-koti' }] });
      assert.strictEqual(recordedEvents.length, 4);
      assert.strictEqual(recordedEvents[3].eventName, 'Purchase');
      assert.strictEqual(recordedEvents[3].params.value, 2570);
    } finally {
      delete global.window;
    }
  });

  it('app/components/FacebookIcon.jsx exists and renders SVG with Meta Facebook brand path', () => {
    const filePath = path.join(process.cwd(), 'app', 'components', 'FacebookIcon.jsx');
    assert.ok(fs.existsSync(filePath), 'FacebookIcon.jsx must exist');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('<svg'), 'FacebookIcon should contain an svg element');
    assert.ok(content.includes('viewBox="0 0 24 24"'), 'FacebookIcon should have standard viewBox');
    assert.ok(content.includes('M24 12.073c0-6.627'), 'FacebookIcon should contain official Facebook path');
  });

  it('app/components/FacebookPixel.jsx handles route changes and noscript fallback', () => {
    const filePath = path.join(process.cwd(), 'app', 'components', 'FacebookPixel.jsx');
    assert.ok(fs.existsSync(filePath), 'FacebookPixel.jsx must exist');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('usePathname'), 'FacebookPixel should listen to pathname changes');
    assert.ok(content.includes('Script'), 'FacebookPixel should use next/script');
    assert.ok(content.includes('connect.facebook.net/en_US/fbevents.js'), 'FacebookPixel should load official fbevents script');
    assert.ok(content.includes('<noscript>'), 'FacebookPixel should include noscript tracking pixel');
  });

  it('app/layout.jsx renders FacebookPixel in root layout and links Facebook page in JSON-LD', () => {
    const filePath = path.join(process.cwd(), 'app', 'layout.jsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('FacebookPixel'), 'app/layout.jsx should import FacebookPixel');
    assert.ok(content.includes('<FacebookPixel pixelId={facebookPixelId} />'), 'app/layout.jsx should render FacebookPixel');
    assert.ok(content.includes('sameAs: ['), 'app/layout.jsx should have sameAs in organization JSON-LD');
  });

  it('app/components/Header.jsx includes Facebook Page link with icon in desktop topbar & mobile menu', () => {
    const filePath = path.join(process.cwd(), 'app', 'components', 'Header.jsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('FacebookIcon'), 'Header should import FacebookIcon');
    assert.ok(
      content.includes('https://www.facebook.com/bichitra.shop44'),
      'Header must include https://www.facebook.com/bichitra.shop44'
    );
  });

  it('app/components/Footer.jsx includes Facebook Page link in brand column, contact list & copyright', () => {
    const filePath = path.join(process.cwd(), 'app', 'components', 'Footer.jsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('FacebookIcon'), 'Footer should import FacebookIcon');
    assert.ok(
      content.includes('https://www.facebook.com/bichitra.shop44'),
      'Footer must link to https://www.facebook.com/bichitra.shop44'
    );
  });

  it('app/contact/page.jsx includes dedicated Facebook Page card with icon', () => {
    const filePath = path.join(process.cwd(), 'app', 'contact', 'page.jsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('FacebookIcon'), 'Contact page should import FacebookIcon');
    assert.ok(content.includes('OFFICIAL_FACEBOOK_PAGE'), 'Contact page should reference OFFICIAL_FACEBOOK_PAGE');
    assert.ok(content.includes('facebook.com/bichitra.shop44'), 'Contact page should display Facebook page link');
  });

  it('app/admin/settings/SettingsManager.jsx provides UI for Facebook Page URL and Meta Pixel ID with warming guide', () => {
    const filePath = path.join(process.cwd(), 'app', 'admin', 'settings', 'SettingsManager.jsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('facebookPage'), 'SettingsManager should manage facebookPage in formData');
    assert.ok(content.includes('facebookPixelId'), 'SettingsManager should manage facebookPixelId in formData');
    assert.ok(content.includes('Pixel Warming'), 'SettingsManager should explain pixel warming to the store owner');
    assert.ok(content.includes('social:'), 'SettingsManager handleSave should submit social data');
    assert.ok(content.includes('marketing:'), 'SettingsManager handleSave should submit marketing pixel data');
  });

  it('app/api/admin/settings/route.js stores and retrieves social.facebook and marketing.facebookPixelId', () => {
    const filePath = path.join(process.cwd(), 'app', 'api', 'admin', 'settings', 'route.js');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('social: config?.social'), 'GET should return social settings');
    assert.ok(content.includes('marketing: config?.marketing'), 'GET should return marketing settings');
    assert.ok(content.includes('facebookPixelId'), 'GET & POST should handle facebookPixelId');
  });

  it('ProductDetailClient, CheckoutForm & OrderSuccessTracker trigger standard Meta Pixel events', () => {
    const productDetail = fs.readFileSync(path.join(process.cwd(), 'app', 'products', '[slug]', 'ProductDetailClient.jsx'), 'utf-8');
    assert.ok(productDetail.includes('trackViewContent(product)'), 'ProductDetailClient should track ViewContent');
    assert.ok(productDetail.includes('trackAddToCart(product'), 'ProductDetailClient should track AddToCart');

    const checkoutForm = fs.readFileSync(path.join(process.cwd(), 'app', 'components', 'CheckoutForm.jsx'), 'utf-8');
    assert.ok(checkoutForm.includes('trackInitiateCheckout'), 'CheckoutForm should track InitiateCheckout');
    assert.ok(checkoutForm.includes('trackPurchase'), 'CheckoutForm should track Purchase');

    const orderSuccessTracker = fs.readFileSync(path.join(process.cwd(), 'app', 'order-success', '[reference]', 'OrderSuccessTracker.jsx'), 'utf-8');
    assert.ok(orderSuccessTracker.includes('trackPurchase'), 'OrderSuccessTracker should track Purchase with deduplication');
  });
});
