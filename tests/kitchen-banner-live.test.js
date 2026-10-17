import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { DEFAULT_KITCHEN_BANNER } from '../lib/banners.js';

describe('Deshi Kitchen & Home Appliances Zone Dynamic Banner Integration', () => {
  it('lib/banners.js exports DEFAULT_KITCHEN_BANNER', () => {
    assert.ok(DEFAULT_KITCHEN_BANNER, 'DEFAULT_KITCHEN_BANNER should be defined');
    assert.strictEqual(
      DEFAULT_KITCHEN_BANNER,
      '/banners/bengali_calligraphy_kitchen_banner.jpg',
      'DEFAULT_KITCHEN_BANNER should point to the calligraphy kitchen banner'
    );
  });

  it('app/components/DeshiAppliancesSection.jsx accepts banner prop and resolves dynamic image', () => {
    const compPath = path.join(process.cwd(), 'app', 'components', 'DeshiAppliancesSection.jsx');
    const content = fs.readFileSync(compPath, 'utf-8');

    assert.ok(
      content.includes('banner = null') || content.includes('banner'),
      'DeshiAppliancesSection should accept banner prop'
    );
    assert.ok(
      content.includes('DEFAULT_KITCHEN_BANNER'),
      'DeshiAppliancesSection should import and fallback to DEFAULT_KITCHEN_BANNER'
    );
    assert.ok(
      content.includes('src={bannerSrc}'),
      'DeshiAppliancesSection should use resolved dynamic bannerSrc'
    );
  });

  it('app/page.jsx fetches kitchenBanner and passes it to DeshiAppliancesSection', () => {
    const pagePath = path.join(process.cwd(), 'app', 'page.jsx');
    const content = fs.readFileSync(pagePath, 'utf-8');

    assert.ok(
      content.includes('kitchenBanner: settings?.kitchenBanner'),
      'getHomeData should extract kitchenBanner from settings'
    );
    assert.ok(
      content.includes('<DeshiAppliancesSection products={applianceProducts} banner={kitchenBanner} />'),
      'HomePage should pass banner={kitchenBanner} to DeshiAppliancesSection'
    );
  });

  it('app/api/admin/settings/route.js handles kitchenBanner in GET and POST with cache revalidation', () => {
    const routePath = path.join(process.cwd(), 'app', 'api', 'admin', 'settings', 'route.js');
    const content = fs.readFileSync(routePath, 'utf-8');

    assert.ok(
      content.includes('kitchenBanner: config?.kitchenBanner || DEFAULT_KITCHEN_BANNER'),
      'GET should return kitchenBanner with default fallback'
    );
    assert.ok(
      content.includes('kitchenBanner: body.kitchenBanner !== undefined'),
      'POST should store kitchenBanner'
    );
    assert.ok(
      content.includes("revalidatePath('/', 'page')"),
      'POST should revalidate homepage cache'
    );
  });

  it('app/admin/banners/BannerManager.jsx provides dedicated single-image upload tab for kitchen zone', () => {
    const bannerMgrPath = path.join(process.cwd(), 'app', 'admin', 'banners', 'BannerManager.jsx');
    const content = fs.readFileSync(bannerMgrPath, 'utf-8');

    assert.ok(
      content.includes("setActiveTab('kitchen')"),
      'BannerManager should have kitchen tab'
    );
    assert.ok(
      content.includes('kitchenBanner') && content.includes('setKitchenBanner'),
      'BannerManager should manage kitchenBanner state'
    );
    assert.ok(
      content.includes('handleKitchenFileUpload'),
      'BannerManager should support direct image file upload'
    );
    assert.ok(
      content.includes('দেশি কিচেন ও হোম অ্যাপ্লায়েন্স জোন ব্যানার'),
      'BannerManager should display clear kitchen zone title'
    );
  });

  it('app/admin/settings/SettingsManager.jsx also includes kitchen zone single image uploader', () => {
    const settingsMgrPath = path.join(process.cwd(), 'app', 'admin', 'settings', 'SettingsManager.jsx');
    const content = fs.readFileSync(settingsMgrPath, 'utf-8');

    assert.ok(
      content.includes("setActiveTab('kitchen')"),
      'SettingsManager should have kitchen tab'
    );
    assert.ok(
      content.includes('kitchenBanner') && content.includes('setKitchenBanner'),
      'SettingsManager should manage kitchenBanner state'
    );
    assert.ok(
      content.includes('ImageUploader') && content.includes('folder="bichitra_shop/banners"'),
      'SettingsManager should render ImageUploader for kitchen banner'
    );
  });
});
