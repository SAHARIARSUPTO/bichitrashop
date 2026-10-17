import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import {
  FINAL_DOMAIN,
  DEFAULT_SITE_URL,
  DEFAULT_SOCIAL_POSTER,
  getSiteUrl,
  toAbsoluteUrl,
  toOgImageUrl
} from '../lib/seo.js';

describe('Domain Finalization & Social Share Poster Verification', () => {
  it('FINAL_DOMAIN is bichitrashop.vercel.app and DEFAULT_SITE_URL is https://bichitrashop.vercel.app', () => {
    assert.strictEqual(FINAL_DOMAIN, 'bichitrashop.vercel.app');
    assert.strictEqual(DEFAULT_SITE_URL, 'https://bichitrashop.vercel.app');
  });

  it('getSiteUrl strictly rejects invalid or stale domains (bichitrashopbd, localhost) and defaults to bichitrashop.vercel.app', () => {
    const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;

    // Stale domain test
    process.env.NEXT_PUBLIC_SITE_URL = 'https://bichitrashopbd.com.bd';
    assert.strictEqual(getSiteUrl(), 'https://bichitrashop.vercel.app');

    // Localhost test
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
    assert.strictEqual(getSiteUrl(), 'https://bichitrashop.vercel.app');

    // Valid bichitrashop.vercel.app test
    process.env.NEXT_PUBLIC_SITE_URL = 'https://bichitrashop.vercel.app/';
    assert.strictEqual(getSiteUrl(), 'https://bichitrashop.vercel.app');

    // Clean up
    if (originalEnv) {
      process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    }
  });

  it('toAbsoluteUrl guarantees absolute https URLs anchored to bichitrashop.vercel.app', () => {
    assert.strictEqual(
      toAbsoluteUrl('/products/koti.jpg'),
      'https://bichitrashop.vercel.app/products/koti.jpg'
    );
    assert.strictEqual(
      toAbsoluteUrl('products/koti.jpg'),
      'https://bichitrashop.vercel.app/products/koti.jpg'
    );
    assert.strictEqual(
      toAbsoluteUrl('http://cdn.example.com/image.jpg'),
      'https://cdn.example.com/image.jpg'
    );
    assert.strictEqual(
      toAbsoluteUrl(null),
      'https://bichitrashop.vercel.app/bichitra-social-poster.jpg'
    );
  });

  it('toOgImageUrl applies optimal Open Graph transformation for Cloudinary images', () => {
    const rawCloudinary = 'https://res.cloudinary.com/an4awbat/image/upload/v1792166801/bichitra_shop/products/dqse70vdgryupufmrzww.png';
    const optimized = toOgImageUrl(rawCloudinary);

    assert.ok(optimized.includes('/upload/c_fill,w_1200,h_630,g_auto,q_auto,f_jpg/'), 'Should include 1200x630 and f_jpg');
    assert.ok(optimized.startsWith('https://'), 'Should be secure https');
  });

  it('OpenGraph poster files exist and are within WhatsApp limit (< 300KB)', () => {
    const rootDir = process.cwd();
    const posterFiles = [
      path.join(rootDir, 'public', 'bichitra-social-poster.jpg'),
      path.join(rootDir, 'public', 'opengraph-image.jpg'),
      path.join(rootDir, 'app', 'opengraph-image.jpg'),
      path.join(rootDir, 'app', 'twitter-image.jpg')
    ];

    for (const file of posterFiles) {
      assert.ok(fs.existsSync(file), `File should exist: ${file}`);
      const stats = fs.statSync(file);
      assert.ok(stats.size > 10000, `Poster ${file} should have meaningful content`);
      assert.ok(
        stats.size < 300 * 1024,
        `Poster ${file} size (${stats.size} bytes) must be < 300KB to display on WhatsApp link preview`
      );
    }
  });

  it('all site routes have canonical URLs finalized to bichitrashop.vercel.app', () => {
    const rootDir = process.cwd();
    const filesToCheck = [
      path.join(rootDir, 'app', 'products', 'page.jsx'),
      path.join(rootDir, 'app', 'about', 'page.jsx'),
      path.join(rootDir, 'app', 'contact', 'page.jsx'),
      path.join(rootDir, 'app', 'faq', 'page.jsx'),
      path.join(rootDir, 'app', 'privacy-policy', 'page.jsx'),
      path.join(rootDir, 'app', 'terms', 'page.jsx'),
      path.join(rootDir, 'app', 'shipping-policy', 'page.jsx'),
      path.join(rootDir, 'app', 'return-policy', 'page.jsx')
    ];

    for (const filePath of filesToCheck) {
      const content = fs.readFileSync(filePath, 'utf-8');
      assert.ok(
        content.includes('https://bichitrashop.vercel.app'),
        `${filePath} canonical should point to bichitrashop.vercel.app`
      );
      assert.ok(
        !content.includes('bichitrashop.com/'),
        `${filePath} should not point to unowned bichitrashop.com`
      );
      assert.ok(
        !content.includes('bichitrashopbd'),
        `${filePath} should not reference bichitrashopbd`
      );
    }
  });
});
