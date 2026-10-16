import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Favicon and Web App Manifest Verification Suite', async (t) => {
  await t.test('Root and App favicon.ico files exist and are synchronized', () => {
    const publicIcoPath = path.join(rootDir, 'public', 'favicon.ico');
    const appIcoPath = path.join(rootDir, 'app', 'favicon.ico');

    assert.ok(fs.existsSync(publicIcoPath), 'public/favicon.ico should exist');
    assert.ok(fs.existsSync(appIcoPath), 'app/favicon.ico should exist');

    const publicIcoStat = fs.statSync(publicIcoPath);
    const appIcoStat = fs.statSync(appIcoPath);

    // The default Next.js triangle icon is 15,086 bytes. Our multi-resolution icon is generated from Bichitra Shop logo.
    assert.notEqual(appIcoStat.size, 15086, 'app/favicon.ico should not be the default Next.js triangle icon');
    assert.equal(publicIcoStat.size, appIcoStat.size, 'public/favicon.ico and app/favicon.ico should match');
  });

  await t.test('All required PNG favicon sizes exist with non-zero size', () => {
    const requiredPngs = [
      'favicon-16x16.png',
      'favicon-32x32.png',
      'favicon-48x48.png',
      'apple-touch-icon.png',
      'apple-touch-icon-precomposed.png',
      'android-chrome-192x192.png',
      'android-chrome-512x512.png',
    ];

    for (const file of requiredPngs) {
      const filePath = path.join(rootDir, 'public', file);
      assert.ok(fs.existsSync(filePath), `public/${file} should exist`);
      const stat = fs.statSync(filePath);
      assert.ok(stat.size > 100, `public/${file} should have meaningful byte length`);
    }
  });

  await t.test('SVG favicons exist and contain valid XML markup', () => {
    const svgFiles = ['favicon.svg', 'icon.svg'];

    for (const file of svgFiles) {
      const filePath = path.join(rootDir, 'public', file);
      assert.ok(fs.existsSync(filePath), `public/${file} should exist`);
      const content = fs.readFileSync(filePath, 'utf-8');
      assert.ok(content.includes('<svg'), `public/${file} should contain <svg tag`);
      assert.ok(content.includes('viewBox="0 0 512 512"'), `public/${file} should contain viewBox`);
      assert.ok(content.includes('data:image/png;base64,'), `public/${file} should contain embedded logo data`);
    }
  });

  await t.test('Web App Manifest files are valid and contain 192x192 and 512x512 icons', () => {
    const manifestFiles = ['site.webmanifest', 'manifest.json', 'manifest.webmanifest'];

    for (const file of manifestFiles) {
      const filePath = path.join(rootDir, 'public', file);
      assert.ok(fs.existsSync(filePath), `public/${file} should exist`);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const manifest = JSON.parse(raw);

      assert.ok(manifest.name.includes('Bichitra'), 'Manifest should contain store name');
      assert.equal(manifest.theme_color, '#08542C', 'Manifest theme_color should match branding');
      assert.ok(Array.isArray(manifest.icons), 'Manifest should have an icons array');

      const sizes = manifest.icons.map((icon) => icon.sizes);
      assert.ok(sizes.includes('192x192'), 'Manifest must have a 192x192 icon for Android');
      assert.ok(sizes.includes('512x512'), 'Manifest must have a 512x512 icon for PWA installs');
    }
  });

  await t.test('app/layout.jsx defines complete icons and manifest config', () => {
    const layoutPath = path.join(rootDir, 'app', 'layout.jsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

    assert.ok(layoutContent.includes("manifest: '/site.webmanifest'"), 'layout.jsx must include manifest');
    assert.ok(layoutContent.includes("url: '/favicon-32x32.png'"), 'layout.jsx must include 32x32 icon');
    assert.ok(layoutContent.includes("sizes: '32x32'"), 'layout.jsx must specify 32x32 size attribute');
    assert.ok(layoutContent.includes("url: '/favicon-16x16.png'"), 'layout.jsx must include 16x16 icon');
    assert.ok(layoutContent.includes("sizes: '16x16'"), 'layout.jsx must specify 16x16 size attribute');
    assert.ok(layoutContent.includes("url: '/apple-touch-icon.png'"), 'layout.jsx must include apple-touch-icon');
    assert.ok(layoutContent.includes("sizes: '180x180'"), 'layout.jsx must specify 180x180 size for apple icon');
    assert.ok(layoutContent.includes("url: '/favicon.svg'"), 'layout.jsx must include SVG favicon');
    assert.ok(layoutContent.includes("shortcut: '/favicon.ico'"), 'layout.jsx must include /favicon.ico shortcut');
  });
});
