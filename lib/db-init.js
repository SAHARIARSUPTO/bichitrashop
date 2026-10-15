// lib/db-init.js
// Database initialization, indexing, and seed data for Bichitra Shop

import { getCollection, ObjectId } from './mongodb.js';
import { hashPassword } from './auth.js';

export async function initDatabase() {
  try {
    const products = await getCollection('products');
    const orders = await getCollection('orders');
    const admins = await getCollection('admins');
    const categories = await getCollection('categories');
    const settings = await getCollection('settings');

    // Create Indexes
    await products.createIndex({ slug: 1 }, { unique: true });
    await products.createIndex({ status: 1, createdAt: -1 });
    await products.createIndex({ category: 1, status: 1 });
    await products.createIndex({ featured: 1, status: 1 });

    await orders.createIndex({ orderReference: 1 }, { unique: true });
    await orders.createIndex({ createdAt: -1 });
    await orders.createIndex({ orderStatus: 1, createdAt: -1 });
    await orders.createIndex({ idempotencyKey: 1 }, { sparse: true });

    await admins.createIndex({ email: 1 }, { unique: true });
    await categories.createIndex({ slug: 1 }, { unique: true });

    // Seed default settings if not exists
    const existingSettings = await settings.findOne({ key: 'store_settings' });
    if (!existingSettings) {
      await settings.insertOne({
        key: 'store_settings',
        shippingRates: {
          inside_dhaka: 70,
          outside_dhaka: 130
        },
        contact: {
          phone: '+880 1700-000000',
          email: 'support@bichitrashop.com',
          address: 'Mirpur, Dhaka-1216, Bangladesh'
        },
        announcement: 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে! পণ্য হাতে পেয়ে মূল্য পরিশোধের নিশ্চয়তা।',
        createdAt: new Date().toISOString()
      });
    }

    // Seed default admin if none exists
    const adminCount = await admins.countDocuments({});
    if (adminCount === 0) {
      const email = process.env.ADMIN_EMAIL || 'admin@bichitrashop.com';
      const plainPassword = process.env.ADMIN_PASSWORD || 'BichitraAdmin2026!';
      const passwordHash = await hashPassword(plainPassword);

      await admins.insertOne({
        email,
        passwordHash,
        role: 'superadmin',
        name: 'Bichitra Shop Administrator',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`[Bichitra Shop] Created initial administrator: ${email}`);
    }

    // Seed and synchronize categories with gadgets & home-appliances
    const defaultCategories = [
      {
        name: "মেনস ফ্যাশন",
        slug: "mens-fashion",
        description: "পাঞ্জাবি, কোটি ও এক্সক্লুসিভ পুরুষদের পোশাক",
        image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        name: "উইমেনস ফ্যাশন",
        slug: "womens-fashion",
        description: "আবায়া, থ্রি-পিস ও আধুনিক নারীদের ট্রেন্ডি পোশাক",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        name: "স্মার্ট গ্যাজেটস",
        slug: "gadgets",
        description: "ব্লুটুথ ইয়ারবাডস, স্মার্টওয়াচ ও টেক গ্যাজেটস",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        name: "হোম ও কিচেন অ্যাপ্লায়েন্স",
        slug: "home-appliances",
        description: "ব্লেন্ডার, ইলেকট্রিক কেটলি ও আধুনিক গৃহস্থালি সরঞ্জাম",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        name: "হোম ও লিভিং",
        slug: "home-living",
        description: "স্মার্ট হোম গ্যাজেটস ও লাইফস্টাইল সমাধান",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        name: "অর্গানিক ফুড",
        slug: "organic-food",
        description: "খাঁটি মধু, সরিষার তেল ও পুষ্টিকর খাদ্যপণ্য",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
        status: "active",
        createdAt: new Date().toISOString()
      }
    ];

    for (const cat of defaultCategories) {
      await categories.updateOne(
        { slug: cat.slug },
        { $set: { name: cat.name, description: cat.description, image: cat.image, status: cat.status }, $setOnInsert: { createdAt: cat.createdAt } },
        { upsert: true }
      );
    }

    // Seed initial products if empty
    const productCount = await products.countDocuments({});
    if (productCount === 0) {
      const sampleProducts = [
        {
          name: "এক্সক্লুসিভ অ্যামব্রয়ডারি প্রিমিয়াম কোটি সেট (Exclusive Embroidered Koti Set)",
          slug: "exclusive-embroidered-koti-set",
          shortDescription: "উৎসব ও বিশেষ অনুষ্ঠানের জন্য প্রিমিয়াম কারুকাজ করা পুরুষদের কোটি সেট। আরামদায়ক ও আভিজাত্যপূর্ণ।",
          description: `বিচিত্র শপের স্পেশাল কালেকশন – এক্সক্লুসিভ অ্যামব্রয়ডারি প্রিমিয়াম কোটি সেট। 
এটি তৈরি করা হয়েছে হাই-গ্রেড সিল্ক ও সুতি ব্লেন্ড কাপড়ে, যার ওপর রয়েছে সূক্ষ্ম হ্যান্ডক্রাফটেড অ্যামব্রয়ডারি নকশা। 

বৈশিষ্ট্যসমূহ:
• প্রিমিয়াম মানের ফেব্রিক যা দীর্ঘস্থায়ী ও আরামদায়ক
• নিখুঁত ফিনিশিং এবং রয়েল লুক
• কালার গ্যারান্টি
• ক্যাশ অন ডেলিভারিতে চেক করে নেওয়ার সুবিধা
• সাইজ: M (৩৮), L (৪০), XL (৪২), XXL (৪৪)`,
          category: "mens-fashion",
          price: 1850,
          compareAtPrice: 2450,
          images: [
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
          ],
          variants: {
            sizes: ["M (38)", "L (40)", "XL (42)", "XXL (44)"],
            colors: ["রয়েল নেভি ব্লু", "ডিপ মেরুন", "ক্লাসিক ব্ল্যাক"]
          },
          stockQuantity: 45,
          status: "published",
          featured: true,
          seo: {
            title: "এক্সক্লুসিভ অ্যামব্রয়ডারি প্রিমিয়াম কোটি সেট | Bichitra Shop",
            description: "আকর্ষণীয় অফারে কিনুন এক্সক্লুসিভ কোটি সেট। ক্যাশ অন ডেলিভারি সারা বাংলাদেশে। বিচিত্র শপ।"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          name: "ঐতিহ্যবাহী জামদানি কটন পাঞ্জাবি (Traditional Jamdani Cotton Panjabi)",
          slug: "traditional-jamdani-cotton-panjabi",
          shortDescription: "১০০% প্রিমিয়াম সুতি কাপড়ে ঐতিহ্যবাহী জামদানি মোটিফে নিখুঁত বুননের পাঞ্জাবি।",
          description: `বাঙালির চিরায়ত আভিজাত্য ফুটিয়ে তুলতে জামদানি উইভিং কটন পাঞ্জাবি। ১০০% সুতি ফেব্রিক হওয়ায় যেকোনো আবহাওয়ায় চমৎকার আরামদায়ক।

বিশেষত্ব:
• সফট প্রিমিয়াম কটন ফেব্রিক
• জামদানি মোটিফে উইভিং ডিজাইন
• ফেস্টিভ বা ক্যাজুয়াল ব্যবহারের জন্য পারফেক্ট
• সাইজ অপশন: 40, 42, 44`,
          category: "mens-fashion",
          price: 1450,
          compareAtPrice: 1950,
          images: [
            "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
          ],
          variants: {
            sizes: ["40", "42", "44"],
            colors: ["সাদা (White)", "অফ-হোয়াইট (Off White)", "পেস্ট গ্রিন"]
          },
          stockQuantity: 30,
          status: "published",
          featured: true,
          seo: {
            title: "ঐতিহ্যবাহী জামদানি কটন পাঞ্জাবি | Bichitra Shop",
            description: "১০০% প্রিমিয়াম সুতি জামদানি পাঞ্জাবি ক্যাশ অন ডেলিভারিতে অর্ডার করুন বিচিত্র শপ থেকে।"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          name: "দুবাই চেরি জর্জেট পার্টি বোরকা ও আবায়া (Luxury Dubai Cherry Georgette Abaya)",
          slug: "luxury-dubai-cherry-georgette-abaya",
          shortDescription: "অরিজিনাল দুবাই চেরি জর্জেট কাপড়ে তৈরি রুচিশীল ও মার্জিত ডিজাইনার আবায়া।",
          description: `বিচিত্র শপের নারীদের পছন্দের তালিকায় শীর্ষে থাকা প্রিমিয়াম চেরি জর্জেট আবায়া। এটি যেমন মার্জিত ও শালীন, তেমনি স্টাইলিশ।

সুবিধাসমূহ:
• আরামদায়ক দুবাই চেরি ফেব্রিক
• সহজে ভাঁজ পড়ে না, কালার ১০০% পাকা
• ফ্রি সাইজ ও ফ্লেক্সিবল কাটিং
• হাতা ও কলারের চমৎকার ডিজাইন`,
          category: "womens-fashion",
          price: 2250,
          compareAtPrice: 2850,
          images: [
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
          ],
          variants: {
            sizes: ["52 (লম্বা)", "54 (লম্বা)", "56 (লম্বা)"],
            colors: ["জেট ব্ল্যাক", "ডিপ কফি", "এমেরাল্ড গ্রিন"]
          },
          stockQuantity: 25,
          status: "published",
          featured: true,
          seo: {
            title: "দুবাই চেরি জর্জেট পার্টি আবায়া | Bichitra Shop",
            description: "মার্জিত ও আকর্ষণীয় দুবাই চেরি আবায়া কিনুন বিচিত্র শপ থেকে সেরা মূল্যে।"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          name: "খাঁটি সুন্দরবনের প্রাকৃতিক মধু ও সরিষার তেল কম্বো (Sundarban Raw Honey & Mustard Oil Bundle)",
          slug: "sundarban-raw-honey-mustard-oil-bundle",
          shortDescription: "শতভাগ খাঁটি সুন্দরবনের প্রাকৃতিক মধু (৫০০ গ্রাম) এবং কোল্ড-প্রেসড কাঠের ঘানির সরিষার তেল (১ লিটার)।",
          description: `সুস্থ জীবনের নিশ্চয়তায় বিচিত্র শপের খাঁটি খাবার কম্বো প্যাক। 
সুন্দরবনের প্রাকৃতিক মৌচাক থেকে সংগ্রহ করা কাঁচা মধু এবং দেশি কাঠের ঘানিতে ভাঙানো প্রথম চাপের ঝাঁঝালো সরিষার তেল।

প্যাকেজে অন্তর্ভুক্ত:
• ৫০০ গ্রাম সুন্দরবনের কাঁচা প্রাকৃতিক মধু
• ১ লিটার খাঁটি ঘানির সরিষার তেল
• রাসায়নিক বা ভেজালমুক্ত গ্যারান্টি`,
          category: "organic-food",
          price: 980,
          compareAtPrice: 1250,
          images: [
            "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80"
          ],
          variants: {
            sizes: ["স্ট্যান্ডার্ড কম্বো প্যাক"]
          },
          stockQuantity: 60,
          status: "published",
          featured: true,
          seo: {
            title: "সুন্দরবনের প্রাকৃতিক মধু ও খাঁটি সরিষার তেল কম্বো | Bichitra Shop",
            description: "১০০% খাঁটি সুন্দরবনের মধু ও ঘানির সরিষার তেল কম্বো প্যাক ক্যাশ অন ডেলিভারিতে কিনুন।"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          name: "মাল্টিফাংশন ফোল্ডেবল পোর্টেবল ল্যাপটপ টেবিল (Multi-Function Foldable Laptop Table)",
          slug: "multi-function-foldable-laptop-table",
          shortDescription: "বিছানায় বসে আরামদায়ক পড়াশোনা ও ল্যাপটপ কাজের জন্য কাপ হোল্ডারযুক্ত ফোল্ডেবল টেবিল।",
          description: `অফিস ওয়ার্ক বা স্টুডেন্টদের স্টাডির জন্য অত্যন্ত সুবিধাজনক ফোল্ডেবল ল্যাপটপ ডেস্ক।
মজবুত মেটাল লেগ এবং অ্যান্টি-স্লিপ গ্রিপ।

বৈশিষ্ট্য:
• ট্যাবলেট/মোবাইল স্ট্যান্ড স্লট
• গ্লাস/মগ হোল্ডার
• সহজে ভাঁজ করে সংরক্ষণযোগ্য
• টেকসই ও ওয়াটারপ্রুফ সারফেস`,
          category: "home-living",
          price: 750,
          compareAtPrice: 1050,
          images: [
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
          ],
          variants: {
            colors: ["উডেন ব্রাউন", "ম্যাট ব্ল্যাক", "হালকা পিঙ্ক"]
          },
          stockQuantity: 40,
          status: "published",
          featured: false,
          seo: {
            title: "মাল্টিফাংশন ফোল্ডেবল ল্যাপটপ টেবিল | Bichitra Shop",
            description: "স্মার্ট পোর্টেবল ফোল্ডেবল ল্যাপটপ টেবিল ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি নিন।"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          name: "প্রিমিয়াম ওয়্যারলেস ব্লুটুথ ইয়ারবাডস TWS (Wireless Stereo Earbuds)",
          slug: "wireless-stereo-earbuds",
          shortDescription: "ডিপ বাস, অ্যাক্টিভ নয়েজ ক্যান্সেলেশন এবং ২০ ঘণ্টার লং ব্যাটারি ব্যাকআপযুক্ত ডিজিটাল ডিসপ্লে ইয়ারবাডস।",
          description: `ক্রিস্টাল ক্লিয়ার কলিং এবং পাওয়ারফুল সাউন্ড কোয়ালিটির ব্লুটুথ ৫.৩ ওয়্যারলেস ইয়ারবাডস।
ডিজিটাল ব্যাটারি পার্সেন্টেজ ডিসপ্লে।

ফিচার:
• এইচডি স্টেরিও সাউন্ড উইথ ডিপ বাস
• টাচ কন্ট্রোল ফিচার
• সোয়েট অ্যান্ড ওয়াটার রেজিস্ট্যান্ট
• চার্জিং কেসসহ ২০ ঘণ্টার প্লেব্যাক`,
          category: "home-living",
          price: 890,
          compareAtPrice: 1350,
          images: [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80"
          ],
          variants: {
            colors: ["গ্লসি ব্ল্যাক", "ম্যাট হোয়াইট"]
          },
          stockQuantity: 35,
          status: "published",
          featured: false,
          seo: {
            title: "প্রিমিয়াম ওয়্যারলেস ব্লুটুথ ইয়ারবাডস TWS | Bichitra Shop",
            description: "হাই-কোয়ালিটি সাউন্ড ও ডিজিটাল ডিসপ্লে ব্লুটুথ ইয়ারবাডস। ক্যাশ অন ডেলিভারি।"
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      await products.insertMany(sampleProducts);
      console.log(`[Bichitra Shop] Seeded ${sampleProducts.length} initial products successfully.`);
    }

    return { success: true };
  } catch (err) {
    console.error('[Bichitra Shop] Database init error:', err);
    throw err;
  }
}
