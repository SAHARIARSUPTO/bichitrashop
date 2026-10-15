// scripts/sync-store-data.js
// Synchronize categories, sample products for gadgets/home-appliances, and update store settings

import { getCollection } from '../lib/mongodb.js';
import { DEFAULT_HERO_BANNERS } from '../lib/banners.js';

async function sync() {
  console.log('[Sync] Starting store data synchronization...');

  const categories = await getCollection('categories');
  const products = await getCollection('products');
  const settings = await getCollection('settings');

  // 1. Synchronize Categories
  const defaultCategories = [
    {
      name: "মেনস ফ্যাশন",
      slug: "mens-fashion",
      description: "পাঞ্জাবি, কোটি ও এক্সক্লুসিভ পুরুষদের পোশাক",
      image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80",
      status: "active"
    },
    {
      name: "উইমেনস ফ্যাশন",
      slug: "womens-fashion",
      description: "আবায়া, থ্রি-পিস ও আধুনিক নারীদের ট্রেন্ডি পোশাক",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
      status: "active"
    },
    {
      name: "স্মার্ট গ্যাজেটস",
      slug: "gadgets",
      description: "ব্লুটুথ ইয়ারবাডস, স্মার্টওয়াচ ও টেক গ্যাজেটস",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
      status: "active"
    },
    {
      name: "হোম ও কিচেন অ্যাপ্লায়েন্স",
      slug: "home-appliances",
      description: "ব্লেন্ডার, ইলেকট্রিক কেটলি ও আধুনিক গৃহস্থালি সরঞ্জাম",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
      status: "active"
    },
    {
      name: "হোম ও লিভিং",
      slug: "home-living",
      description: "স্মার্ট হোম গ্যাজেটস ও লাইফস্টাইল সমাধান",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      status: "active"
    },
    {
      name: "অর্গানিক ফুড",
      slug: "organic-food",
      description: "খাঁটি মধু, সরিষার তেল ও পুষ্টিকর খাদ্যপণ্য",
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
      status: "active"
    }
  ];

  for (const cat of defaultCategories) {
    await categories.updateOne(
      { slug: cat.slug },
      {
        $set: {
          name: cat.name,
          description: cat.description,
          image: cat.image,
          status: cat.status
        },
        $setOnInsert: { createdAt: new Date().toISOString() }
      },
      { upsert: true }
    );
  }
  console.log('[Sync] Categories synchronized successfully.');

  // 2. Synchronize wireless-stereo-earbuds to category 'gadgets'
  await products.updateOne(
    { slug: 'wireless-stereo-earbuds' },
    {
      $set: {
        category: 'gadgets',
        'variants.warranty': '৬ মাস রিপ্লেসমেন্ট ওয়ারেন্টি',
        'variants.specs': 'ব্লুটুথ ৫.৩, ২০ ঘণ্টা ব্যাকআপ, এইচডি ডিপ বাস'
      }
    }
  );

  // 3. Add home appliance product if not existing
  const existingAppliance = await products.findOne({ slug: 'electric-fast-heating-stainless-kettle' });
  if (!existingAppliance) {
    await products.insertOne({
      name: 'প্রিমিয়াম ২ লিটার স্টেইনলেস স্টিল ইলেকট্রিক কেটলি (Electric Fast Heating Kettle)',
      slug: 'electric-fast-heating-stainless-kettle',
      shortDescription: 'অটো শাট-অফ, ওভারহিট প্রোটেকশন ও দ্রুত পানি গরম করার স্টেইনলেস স্টিল ইলেকট্রিক কেটলি।',
      description: `প্রতিদিনের চা, কফি বা গরম পানির জন্য আধুনিক ও নিরাপদ ইলেকট্রিক কেটলি। 
উচ্চমানের ফুড গ্রেড স্টেইনলেস স্টিল দিয়ে তৈরি, যা সম্পূর্ণ মরিচারোধী ও টেকসই।

মূল বৈশিষ্ট্য:
• ক্যাপাসিটি: ২.০ লিটার
• পাওয়ার: ১৫০০ ওয়াট দ্রুত হিটিং
• অটোমেটিক শাট-অফ প্রযুক্তি (পানি ফুটলে নিজে থেকেই বন্ধ হয়ে যায়)
• ড্রাই বয়েল প্রোটেকশন
• ৩৬০ ডিগ্রি রোটেটিং বেস ও কর্ডলেস ব্যবহার
• ১ বছর অফিসিয়াল সার্ভিস ওয়ারেন্টি`,
      category: 'home-appliances',
      price: 950,
      compareAtPrice: 1350,
      images: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
      ],
      variants: {
        capacities: ['2.0 Litre (1500W)'],
        colors: ['সিলভার-ব্ল্যাক', 'মেটালিক রেড'],
        warranty: '১ বছর অফিসিয়াল সার্ভিস ওয়ারেন্টি',
        specs: '১৫০০W পাওয়ার, অটো শাট-অফ, ফুড গ্রেড স্টিল'
      },
      stockQuantity: 40,
      status: 'published',
      featured: true,
      seo: {
        title: '২ লিটার স্টেইনলেস স্টিল ইলেকট্রিক কেটলি | Bichitra Shop',
        description: 'দ্রুত পানি গরম করার জন্য প্রিমিয়াম ইলেকট্রিক কেটলি। ক্যাশ অন ডেলিভারি সারা বাংলাদেশে।'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log('[Sync] Created sample home-appliances product.');
  }

  // 4. Update store settings with new vibrant DEFAULT_HERO_BANNERS
  await settings.updateOne(
    { key: 'store_settings' },
    {
      $set: {
        heroBanners: DEFAULT_HERO_BANNERS,
        updatedAt: new Date().toISOString()
      }
    },
    { upsert: true }
  );
  console.log('[Sync] Store settings & hero banners updated.');

  console.log('[Sync] All data synchronized successfully!');
  process.exit(0);
}

sync().catch(err => {
  console.error('[Sync Error]', err);
  process.exit(1);
});
