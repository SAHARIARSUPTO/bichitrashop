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
          phone: '01761674164',
          email: 'support@bichitrashop.com',
          address: 'রহনপুর, চাঁপাইনবাবগঞ্জ, বাংলাদেশ'
        },
        branding: settings?.branding || {
          favicon: '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
          logo: '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
          socialPoster: '/bichitra-social-poster.jpg'
        },
        seo: settings?.seo || {
          metaTitle: 'Bichitra Shop – বিচিত্র শপ | বিশ্বস্ত পণ্য ও স্মার্ট কেনাকাটা',
          metaDescription: 'বিচিত্র শপ – প্রিমিয়াম কোটি সেট, পাঞ্জাবি, বোরকা ও আবায়া, খাঁটি অর্গানিক ফুড এবং আধুনিক লাইফস্টাইল পণ্য।',
          keywords: 'বিচিত্র শপ, Bichitra Shop, অনলাইন শপিং বাংলাদেশ, ক্যাশ অন ডেলিভারি',
          ogImage: '/bichitra-social-poster.jpg'
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
        contact: { phone: '01761674164', email: 'support@bichitrashop.com', address: 'রহনপুর, চাঁপাইনবাবগঞ্জ, বাংলাদেশ' },
        branding: {
          favicon: '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
          logo: '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
          socialPoster: '/bichitra-social-poster.jpg'
        },
        seo: {
          metaTitle: 'Bichitra Shop – বিচিত্র শপ | বিশ্বস্ত পণ্য ও স্মার্ট কেনাকাটা',
          metaDescription: 'বিচিত্র শপ – প্রিমিয়াম কোটি সেট, পাঞ্জাবি, বোরকা ও আবায়া, খাঁটি অর্গানিক ফুড এবং আধুনিক লাইফস্টাইল পণ্য।',
          keywords: 'বিচিত্র শপ, Bichitra Shop, অনলাইন শপিং বাংলাদেশ, ক্যাশ অন ডেলিভারি',
          ogImage: '/bichitra-social-poster.jpg'
        },
        announcement: 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে!',
        heroBanners: []
      }
    });
  }
}
