import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

describe('Biggapon / Promotional Banners Dynamic Homepage Integration', () => {
  it('app/page.jsx passes promoBanners to CalligraphyDealsSection', () => {
    const pagePath = path.join(process.cwd(), 'app', 'page.jsx');
    const pageContent = fs.readFileSync(pagePath, 'utf-8');

    assert.ok(
      pageContent.includes('<CalligraphyDealsSection banners={promoBanners} />'),
      'app/page.jsx should pass banners={promoBanners} to CalligraphyDealsSection'
    );
    assert.ok(
      pageContent.includes('export const revalidate = 0;'),
      'app/page.jsx should set revalidate = 0 to prevent stale cache'
    );
  });

  it('CalligraphyDealsSection dynamically maps active banners and falls back gracefully', () => {
    const compPath = path.join(process.cwd(), 'app', 'components', 'CalligraphyDealsSection.jsx');
    const compContent = fs.readFileSync(compPath, 'utf-8');

    assert.ok(
      compContent.includes('export default function CalligraphyDealsSection({ banners = [] })'),
      'CalligraphyDealsSection should accept banners prop'
    );
    assert.ok(
      compContent.includes('card.image'),
      'CalligraphyDealsSection should display card.image from dynamic banners'
    );
    assert.ok(
      compContent.includes('card.title'),
      'CalligraphyDealsSection should display dynamic card.title'
    );
  });

  it('app/api/admin/settings/route.js calls revalidatePath to instantly purge cache on save', () => {
    const routePath = path.join(process.cwd(), 'app', 'api', 'admin', 'settings', 'route.js');
    const routeContent = fs.readFileSync(routePath, 'utf-8');

    assert.ok(
      routeContent.includes("revalidatePath('/', 'page')"),
      'settings API route should purge homepage cache'
    );
    assert.ok(
      routeContent.includes("revalidatePath('/admin/banners')"),
      'settings API route should purge banners cache'
    );
  });

  it('ModernHero handles both link and slug properties safely without double prefixes', () => {
    const heroPath = path.join(process.cwd(), 'app', 'components', 'ModernHero.jsx');
    const heroContent = fs.readFileSync(heroPath, 'utf-8');

    assert.ok(
      heroContent.includes('slide.link || slide.slug'),
      'ModernHero should safely resolve slide.link or slide.slug'
    );
  });
});
