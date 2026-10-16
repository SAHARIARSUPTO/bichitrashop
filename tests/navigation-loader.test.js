// tests/navigation-loader.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());

test('Cool Glassmorphic Animated Circle Navigation Loader Verification Suite', async (t) => {
  await t.test('ClientNavigationLoader.jsx renders animated circle without text over website state', () => {
    const loaderPath = path.join(projectRoot, 'app', 'components', 'ClientNavigationLoader.jsx');
    assert.ok(fs.existsSync(loaderPath), 'ClientNavigationLoader.jsx must exist');

    const content = fs.readFileSync(loaderPath, 'utf8');

    // Must be a client component
    assert.match(content, /'use client'/, 'Must be a client component');

    // Centered in viewport with subtle blur over website state
    assert.match(content, /fixed inset-0.*items-center justify-center/, 'Must be centered in viewport');
    assert.match(content, /backdrop-blur/, 'Must use backdrop-blur to keep website state visible');

    // Must have cool circular animations (dual spinning rings)
    assert.match(content, /animate-spin/, 'Must have spinning circle animation');
    assert.match(content, /rounded-full/, 'Must use rounded-full circular geometry');

    // Background must NOT be dark or solid slate
    assert.ok(!content.includes('bg-black/80'), 'Must not use dark bg-black/80');
    assert.ok(!content.includes('bg-black/60'), 'Must not use dark bg-black/60');
    assert.ok(!content.includes('bg-zinc-900'), 'Must not use dark bg-zinc-900');

    // STRICTLY NO TEXT NODES
    assert.ok(!content.includes('>Loading<'), 'Must not contain ">Loading<" text');
    assert.ok(!content.includes('লোড হচ্ছে'), 'Must not contain "লোড হচ্ছে" text');
  });

  await t.test('app/loading.jsx is removed so Next.js does not wipe the page to an empty slate canvas', () => {
    const loadingPath = path.join(projectRoot, 'app', 'loading.jsx');
    assert.ok(!fs.existsSync(loadingPath), 'app/loading.jsx must not exist to preserve website state in background');
  });

  await t.test('app/layout.jsx mounts ClientNavigationLoader within Suspense', () => {
    const layoutPath = path.join(projectRoot, 'app', 'layout.jsx');
    const content = fs.readFileSync(layoutPath, 'utf8');

    assert.match(content, /import ClientNavigationLoader from '\.\/components\/ClientNavigationLoader'/, 'Must import ClientNavigationLoader');
    assert.match(content, /<ClientNavigationLoader\s*\/>/, 'Must render ClientNavigationLoader');
  });
});
