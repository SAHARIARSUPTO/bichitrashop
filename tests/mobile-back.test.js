import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Mobile Back Button Navigation Verification Suite', async (t) => {
  await t.test('Header.jsx contains mobile back button and popstate listener', () => {
    const headerPath = path.join(rootDir, 'app', 'components', 'Header.jsx');
    assert.ok(fs.existsSync(headerPath), 'Header.jsx must exist');
    const content = fs.readFileSync(headerPath, 'utf-8');

    assert.ok(content.includes('ArrowLeft'), 'Header.jsx must import and use ArrowLeft');
    assert.ok(content.includes('usePathname'), 'Header.jsx must use usePathname to detect current route');
    assert.ok(content.includes('handleGoBack'), 'Header.jsx must define handleGoBack');
    assert.ok(content.includes('router.back()'), 'Header.jsx handleGoBack must call router.back()');
    assert.ok(content.includes('!isHomePage'), 'Header.jsx must show mobile back button when not on homepage');
    assert.ok(content.includes('popstate'), 'Header.jsx must listen to popstate for mobile hardware back support');
    assert.ok(content.includes('md:hidden'), 'Back button must be tailored for mobile viewports');
  });

  await t.test('BackButton.jsx reusable component exists and handles navigation safely', () => {
    const backBtnPath = path.join(rootDir, 'app', 'components', 'BackButton.jsx');
    assert.ok(fs.existsSync(backBtnPath), 'BackButton.jsx must exist');
    const content = fs.readFileSync(backBtnPath, 'utf-8');

    assert.ok(content.includes("'use client'"), 'BackButton must be a client component');
    assert.ok(content.includes('router.back()'), 'BackButton must support history navigation');
    assert.ok(content.includes('fallbackHref'), 'BackButton must provide resilient fallback URL');
  });

  await t.test('Checkout page uses BackButton for previous step navigation', () => {
    const checkoutPath = path.join(rootDir, 'app', 'checkout', 'page.jsx');
    assert.ok(fs.existsSync(checkoutPath), 'app/checkout/page.jsx must exist');
    const content = fs.readFileSync(checkoutPath, 'utf-8');

    assert.ok(content.includes('BackButton'), 'Checkout page must import and render BackButton');
    assert.ok(content.includes('fallbackHref'), 'Checkout BackButton must specify fallbackHref');
  });
});
