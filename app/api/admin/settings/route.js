// app/api/admin/settings/route.js
// Admin API: View and update store settings (shipping rates, contact, announcements, hero banners, and promotional advertise banners)

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { DEFAULT_SHIPPING_RATES } from '@/lib/pricing';
import { DEFAULT_HERO_BANNERS, DEFAULT_PROMO_BANNERS, DEFAULT_KITCHEN_BANNER } from '@/lib/banners';
import { OFFICIAL_FACEBOOK_PAGE, OFFICIAL_FACEBOOK_PIXEL_ID } from '@/lib/seo';
import { revalidatePath } from 'next/cache';

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
          phone: '01761674164',
          email: 'support@bichitrashop.com',
          address: 'রহনপুর, চাঁপাইনবাবগঞ্জ, বাংলাদেশ'
        },
        social: config?.social || {
          facebook: config?.social?.facebook || OFFICIAL_FACEBOOK_PAGE,
          whatsapp: '01761674164'
        },
        marketing: config?.marketing || {
          facebookPixelId: config?.marketing?.facebookPixelId || config?.seo?.facebookPixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || OFFICIAL_FACEBOOK_PIXEL_ID,
          googleAnalyticsId: config?.marketing?.googleAnalyticsId || config?.seo?.googleAnalyticsId || ''
        },
        branding: config?.branding || {
          favicon: '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
          logo: '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
          socialPoster: '/bichitra-social-poster.jpg'
        },
        seo: config?.seo || {
          metaTitle: 'Bichitra Shop – বিচিত্র শপ | বিশ্বস্ত পণ্য ও স্মার্ট কেনাকাটা',
          metaDescription: 'বিচিত্র শপ – প্রিমিয়াম কোটি সেট, পাঞ্জাবি, বোরকা ও আবায়া, খাঁটি অর্গানিক ফুড এবং আধুনিক লাইফস্টাইল পণ্য। ক্যাশ অন ডেলিভারি সারা বাংলাদেশে।',
          keywords: 'বিচিত্র শপ, Bichitra Shop, অনলাইন শপিং বাংলাদেশ, ক্যাশ অন ডেলিভারি',
          ogImage: '/bichitra-social-poster.jpg',
          googleVerification: 'EOaABPHPI_eAaNXucQ1HhkIJaDn3uocSezsHHmnAI-A',
          googleAnalyticsId: ''
        },
        announcement: config?.announcement || 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে!',
        heroBanners: Array.isArray(config?.heroBanners) ? config.heroBanners : DEFAULT_HERO_BANNERS,
        promoBanners: Array.isArray(config?.promoBanners) ? config.promoBanners : DEFAULT_PROMO_BANNERS,
        kitchenBanner: config?.kitchenBanner || DEFAULT_KITCHEN_BANNER
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
    const existing = await settings.findOne({ key: 'store_settings' });

    const updateDoc = {
      key: 'store_settings',
      shippingRates: body.shippingRates ? {
        inside_dhaka: Math.max(0, parseInt(body.shippingRates?.inside_dhaka ?? 70, 10)),
        outside_dhaka: Math.max(0, parseInt(body.shippingRates?.outside_dhaka ?? 130, 10))
      } : (existing?.shippingRates || DEFAULT_SHIPPING_RATES),
      contact: body.contact ? {
        phone: body.contact?.phone || '01761674164',
        email: body.contact?.email || 'support@bichitrashop.com',
        address: body.contact?.address || 'রহনপুর, চাঁপাইনবাবগঞ্জ, বাংলাদেশ'
      } : (existing?.contact || {
        phone: '01761674164',
        email: 'support@bichitrashop.com',
        address: 'রহনপুর, চাঁপাইনবাবগঞ্জ, বাংলাদেশ'
      }),
      social: body.social ? {
        facebook: body.social?.facebook?.trim() || existing?.social?.facebook || OFFICIAL_FACEBOOK_PAGE,
        whatsapp: body.social?.whatsapp?.trim() || existing?.social?.whatsapp || '01761674164'
      } : (existing?.social || {
        facebook: OFFICIAL_FACEBOOK_PAGE,
        whatsapp: '01761674164'
      }),
      marketing: body.marketing ? {
        facebookPixelId: body.marketing?.facebookPixelId !== undefined
          ? body.marketing.facebookPixelId.trim()
          : (existing?.marketing?.facebookPixelId || ''),
        googleAnalyticsId: body.marketing?.googleAnalyticsId !== undefined
          ? body.marketing.googleAnalyticsId.trim()
          : (existing?.marketing?.googleAnalyticsId || '')
      } : (existing?.marketing || {
        facebookPixelId: OFFICIAL_FACEBOOK_PIXEL_ID,
        googleAnalyticsId: ''
      }),
      branding: body.branding ? {
        favicon: body.branding?.favicon || existing?.branding?.favicon || '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
        logo: body.branding?.logo || existing?.branding?.logo || '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
        socialPoster: body.branding?.socialPoster || existing?.branding?.socialPoster || '/bichitra-social-poster.jpg'
      } : (existing?.branding || {
        favicon: '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
        logo: '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
        socialPoster: '/bichitra-social-poster.jpg'
      }),
      seo: body.seo ? {
        metaTitle: body.seo?.metaTitle || existing?.seo?.metaTitle || 'Bichitra Shop – বিচিত্র শপ | বিশ্বস্ত পণ্য ও স্মার্ট কেনাকাটা',
        metaDescription: body.seo?.metaDescription || existing?.seo?.metaDescription || 'বিচিত্র শপ – প্রিমিয়াম কোটি সেট, পাঞ্জাবি, বোরকা ও আবায়া, খাঁটি অর্গানিক ফুড এবং আধুনিক লাইফস্টাইল পণ্য।',
        keywords: body.seo?.keywords || existing?.seo?.keywords || 'বিচিত্র শপ, Bichitra Shop, অনলাইন শপিং বাংলাদেশ, ক্যাশ অন ডেলিভারি',
        ogImage: body.seo?.ogImage || existing?.seo?.ogImage || '/bichitra-social-poster.jpg',
        googleVerification: body.seo?.googleVerification || existing?.seo?.googleVerification || 'EOaABPHPI_eAaNXucQ1HhkIJaDn3uocSezsHHmnAI-A',
        googleAnalyticsId: body.seo?.googleAnalyticsId || existing?.seo?.googleAnalyticsId || ''
      } : (existing?.seo || {
        metaTitle: 'Bichitra Shop – বিচিত্র শপ | বিশ্বস্ত পণ্য ও স্মার্ট কেনাকাটা',
        metaDescription: 'বিচিত্র শপ – প্রিমিয়াম কোটি সেট, পাঞ্জাবি, বোরকা ও আবায়া, খাঁটি অর্গানিক ফুড এবং আধুনিক লাইফস্টাইল পণ্য।',
        keywords: 'বিচিত্র শপ, Bichitra Shop, অনলাইন শপিং বাংলাদেশ, ক্যাশ অন ডেলিভারি',
        ogImage: '/bichitra-social-poster.jpg',
        googleVerification: 'EOaABPHPI_eAaNXucQ1HhkIJaDn3uocSezsHHmnAI-A',
        googleAnalyticsId: ''
      }),
      announcement: body.announcement !== undefined
        ? body.announcement
        : (existing?.announcement || 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে!'),
      heroBanners: Array.isArray(body.heroBanners)
        ? body.heroBanners
        : (existing?.heroBanners || DEFAULT_HERO_BANNERS),
      promoBanners: Array.isArray(body.promoBanners)
        ? body.promoBanners
        : (existing?.promoBanners || DEFAULT_PROMO_BANNERS),
      kitchenBanner: body.kitchenBanner !== undefined
        ? (typeof body.kitchenBanner === 'string' ? body.kitchenBanner.trim() : body.kitchenBanner)
        : (existing?.kitchenBanner || DEFAULT_KITCHEN_BANNER),
      updatedAt: new Date().toISOString()
    };

    await settings.updateOne(
      { key: 'store_settings' },
      { $set: updateDoc },
      { upsert: true }
    );

    try {
      revalidatePath('/', 'page');
      revalidatePath('/admin/settings');
      revalidatePath('/admin/banners');
    } catch (e) {
      // ignore in tests or non-request context
    }

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
