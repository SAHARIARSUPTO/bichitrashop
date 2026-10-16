// app/api/admin/settings/route.js
// Admin API: View and update store settings (shipping rates, contact, announcements, hero banners, and promotional advertise banners)

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { DEFAULT_SHIPPING_RATES } from '@/lib/pricing';
import { DEFAULT_HERO_BANNERS, DEFAULT_PROMO_BANNERS } from '@/lib/banners';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const settings = await getCollection('settings');
    const config = await settings.findOne({ key: 'store_settings' });

    return Response.json({
      success: true,
      settings: {
        ...(config || {}),
        key: 'store_settings',
        shippingRates: config?.shippingRates || DEFAULT_SHIPPING_RATES,
        contact: config?.contact || {
          phone: '+880 1700-000000',
          email: 'support@bichitrashop.com',
          address: 'Mirpur, Dhaka, Bangladesh'
        },
        announcement: config?.announcement || 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে!',
        heroBanners: Array.isArray(config?.heroBanners) ? config.heroBanners : DEFAULT_HERO_BANNERS,
        promoBanners: Array.isArray(config?.promoBanners) ? config.promoBanners : DEFAULT_PROMO_BANNERS
      }
    });
  } catch (error) {
    return Response.json({ success: false, error: 'সেটিংস লোড করা যায়নি।' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const body = await request.json();
    const settings = await getCollection('settings');

    const updateDoc = {
      key: 'store_settings',
      shippingRates: {
        inside_dhaka: Math.max(0, parseInt(body.shippingRates?.inside_dhaka ?? 70, 10)),
        outside_dhaka: Math.max(0, parseInt(body.shippingRates?.outside_dhaka ?? 130, 10))
      },
      contact: {
        phone: body.contact?.phone || '+880 1700-000000',
        email: body.contact?.email || 'support@bichitrashop.com',
        address: body.contact?.address || 'Mirpur, Dhaka, Bangladesh'
      },
      announcement: body.announcement || 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে!',
      heroBanners: Array.isArray(body.heroBanners)
        ? body.heroBanners
        : DEFAULT_HERO_BANNERS,
      promoBanners: Array.isArray(body.promoBanners)
        ? body.promoBanners
        : DEFAULT_PROMO_BANNERS,
      updatedAt: new Date().toISOString()
    };

    await settings.updateOne(
      { key: 'store_settings' },
      { $set: updateDoc },
      { upsert: true }
    );

    return Response.json({
      success: true,
      message: 'স্টোর, ব্যানার ও বিজ্ঞাপন সেটিংস সফলভাবে সংরক্ষিত হয়েছে।',
      settings: updateDoc
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return Response.json({ success: false, error: 'সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
