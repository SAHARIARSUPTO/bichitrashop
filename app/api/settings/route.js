// app/api/settings/route.js
// Public API: Get store settings (shipping rates, announcement, contact, hero banners)

import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';
import { DEFAULT_SHIPPING_RATES } from '@/lib/pricing';

export async function GET() {
  try {
    await initDatabase();
    const settingsColl = await getCollection('settings');
    const settings = await settingsColl.findOne({ key: 'store_settings' });

    return Response.json({
      success: true,
      settings: {
        shippingRates: settings?.shippingRates || DEFAULT_SHIPPING_RATES,
        contact: settings?.contact || {
          phone: '+880 1700-000000',
          email: 'support@bichitrashop.com',
          address: 'Mirpur, Dhaka, Bangladesh'
        },
        announcement: settings?.announcement || 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে!',
        heroBanners: settings?.heroBanners || []
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return Response.json({
      success: true,
      settings: {
        shippingRates: DEFAULT_SHIPPING_RATES,
        contact: { phone: '+880 1700-000000', email: 'support@bichitrashop.com' },
        announcement: 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে!',
        heroBanners: []
      }
    });
  }
}
