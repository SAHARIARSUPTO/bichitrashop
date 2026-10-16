// scripts/sync-store-data.js
// Synchronize categories, products, and banners with 100% authentic Bangladeshi-vibe images

import { getCollection } from '../lib/mongodb.js';
import { DEFAULT_HERO_BANNERS, DEFAULT_PROMO_BANNERS } from '../lib/banners.js';

async function sync() {
  console.log('[Sync] Starting full store data synchronization with Bangladeshi vibe assets...');

  const categories = await getCollection('categories');
  const products = await getCollection('products');
  const settings = await getCollection('settings');

  // 1. Synchronize Categories with Local Bangladeshi Images
  const defaultCategories = [
    {
      name: "মেনস ফ্যাশন",
      slug: "mens-fashion",
      description: "পাঞ্জাবি, কোটি ও এক্সক্লুসিভ পুরুষদের পোশাক",
      image: "/categories/mens_fashion.jpg",
      status: "active"
    },
    {
      name: "উইমেনস ফ্যাশন",
      slug: "womens-fashion",
      description: "আবায়া, থ্রি-পিস ও আধুনিক নারীদের ট্রেন্ডি পোশাক",
      image: "/categories/womens_fashion.jpg",
      status: "active"
    },
    {
      name: "স্মার্ট গ্যাজেটস",
      slug: "gadgets",
      description: "ব্লুটুথ ইয়ারবাডস, স্মার্টওয়াচ ও টেক গ্যাজেটস",
      image: "/categories/gadgets.jpg",
      status: "active"
    },
    {
      name: "হোম ও কিচেন অ্যাপ্লায়েন্স",
      slug: "home-appliances",
      description: "ব্লেন্ডার, ইলেকট্রিক কেটলি ও আধুনিক গৃহস্থালি সরঞ্জাম",
      image: "/categories/home_appliances.jpg",
      status: "active"
    },
    {
      name: "হোম ও লিভিং",
      slug: "home-living",
      description: "স্মার্ট হোম গ্যাজেটস ও লাইফস্টাইল সমাধান",
      image: "/categories/home_living.jpg",
      status: "active"
    },
    {
      name: "অর্গানিক ফুড",
      slug: "organic-food",
      description: "খাঁটি মধু, সরিষার তেল ও পুষ্টিকর খাদ্যপণ্য",
      image: "/categories/organic_food.jpg",
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
  console.log('[Sync] Categories synchronized with local images.');

  // 2. Update existing products to replace third-party URLs with authentic local Bangladeshi images
  const productUpdates = [
    {
      slug: 'exclusive-embroidered-koti-set',
      images: [
        '/products/koti_set_navy_gold.jpg',
        '/products/koti_embroidery_detail.jpg'
      ]
    },
    {
      slug: 'traditional-jamdani-cotton-panjabi',
      images: [
        '/products/jamdani_panjabi_white.jpg',
        '/products/koti_set_navy_gold.jpg'
      ]
    },
    {
      slug: 'luxury-dubai-cherry-georgette-abaya',
      images: [
        '/products/cherry_georgette_abaya.jpg',
        '/products/cherry_abaya_detail.jpg'
      ]
    },
    {
      slug: 'sundarban-raw-honey-mustard-oil-bundle',
      images: [
        '/products/sundarban_honey_mustard_oil.jpg',
        '/products/organic_spices_bundle.jpg'
      ]
    },
    {
      slug: 'multi-function-foldable-laptop-table',
      images: [
        '/products/deshi_cookware_kitchen.jpg',
        '/products/deshi_biryani_pot.jpg'
      ]
    },
    {
      slug: 'wireless-stereo-earbuds',
      category: 'gadgets',
      images: [
        '/products/wireless_earbuds_smartwatch.jpg'
      ]
    },
    {
      slug: 'electric-fast-heating-stainless-kettle',
      images: [
        '/products/electric_kettle_stainless.jpg',
        '/products/blender_grinder_appliance.jpg'
      ]
    }
  ];

  for (const item of productUpdates) {
    const updateFields = { images: item.images };
    if (item.category) updateFields.category = item.category;

    await products.updateOne(
      { slug: item.slug },
      { $set: updateFields }
    );
  }
  console.log('[Sync] Existing products updated with local Bangladeshi images.');

  // 3. Ensure Home Appliance products exist
  const existingBlender = await products.findOne({ slug: 'deshi-super-blender-grinder-copper-motor' });
  if (!existingBlender) {
    await products.insertOne({
      name: 'দেশি সুপার ব্লেন্ডার ও মসলা গ্রাইন্ডার ১০০০W (Heavy Duty Blender Grinder)',
      slug: 'deshi-super-blender-grinder-copper-motor',
      shortDescription: 'খাঁটি দেশি হলুদ, জিরা, আদা-রসুন বাটা ও স্মুদির জন্য ১০০% কপার মোটর ব্লেন্ডার।',
      description: `বাঙালি রান্নার আসল স্বাদ খাঁটি বাটা মসলায়। ঝামেলাহীনভাবে সব ধরণের শক্ত মসলা মিহি করতে বিচিত্র শপের শক্তিশালী ব্লেন্ডার গ্রাইন্ডার।

মূল সুবিধাসমূহ:
• ১০০০ ওয়াট ১০০% পিওর কপার মোটর
• ৩টি আনব্রেকেবল স্টেইনলেস স্টিল জার
• শক্ত মসলা, চালের গুঁড়া ও জুস তৈরিতে পারফেক্ট
• ওভারলোড প্রটেকশন ও ২ বছরের মোটর ওয়ারেন্টি
• ক্যাশ অন ডেলিভারিতে চেক করে মূল্য পরিশোধ`,
      category: 'home-appliances',
      price: 1950,
      compareAtPrice: 2600,
      images: [
        '/products/blender_grinder_appliance.jpg',
        '/products/modern_kitchen_appliances.jpg'
      ],
      variants: {
        specs: '1000W কপার মোটর, ৩টি জার, স্টেইনলেস ব্লেড',
        warranty: '২ বছর মোটর রিপ্লেসমেন্ট ওয়ারেন্টি'
      },
      stockQuantity: 35,
      status: 'published',
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log('[Sync] Added Heavy Duty Blender & Grinder product.');
  }

  // 4. Update store settings with new vibrant Calligraphy DEFAULT_HERO_BANNERS and PROMO_BANNERS
  await settings.updateOne(
    { key: 'store_settings' },
    {
      $set: {
        heroBanners: DEFAULT_HERO_BANNERS,
        promoBanners: DEFAULT_PROMO_BANNERS,
        updatedAt: new Date().toISOString()
      }
    },
    { upsert: true }
  );
  console.log('[Sync] Store settings updated with calligraphy hero & promo banners.');

  console.log('[Sync] Synchronization completed successfully! 🎉');
  process.exit(0);
}

sync().catch((err) => {
  console.error('[Sync] Error during synchronization:', err);
  process.exit(1);
});
