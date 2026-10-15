// scripts/test-product-creation.js
// Test API validation and creation of gadget, appliance, and food products

import { productSchema } from '../lib/validation.js';

function runTests() {
  console.log('Testing product validation schemas...');

  // Test 1: Gadget product (NO sizes, has warranty, specs, colors, Cloudinary image)
  const gadgetPayload = {
    name: 'ম্যাগনেটিক ওয়্যারলেস পাওয়ার ব্যাংক ১০,০০০mAh',
    shortDescription: 'ফাস্ট চার্জিং ম্যাগসেফ সাপোর্টেড পোর্টেবল পাওয়ার ব্যাংক।',
    description: `স্মার্টফোন দ্রুত চার্জ করার জন্য প্রিমিয়াম ১০,০০০mAh ম্যাগনেটিক ওয়্যারলেস পাওয়ার ব্যাংক।
২০W পিডি ফাস্ট চার্জিং সুবিধা।
টাইপ-সি ইনপুট ও আউটপুট পোর্ট।
ওভারহিটিং ও শর্ট সার্কিট প্রটেকশন।`,
    category: 'gadgets',
    price: 1850,
    compareAtPrice: 2200,
    images: ['https://res.cloudinary.com/bichitra/image/upload/v12345/powerbank.jpg'],
    variants: {
      colors: ['মেটালিক গ্রে', 'ম্যাট ব্ল্যাক'],
      warranty: '৬ মাস রিপ্লেসমেন্ট ওয়ারেন্টি',
      specs: '১০,০০০mAh, ২০W PD ফাস্ট চার্জিং'
    },
    stockQuantity: 30,
    status: 'published',
    featured: true
  };

  const gadgetResult = productSchema.safeParse(gadgetPayload);
  if (!gadgetResult.success) {
    console.error('Gadget schema validation failed:', gadgetResult.error.issues);
    process.exit(1);
  }
  console.log('✔ Gadget product validation passed (no apparel sizes required)');

  // Test 2: Home appliance product (has capacities, warranty, colors)
  const appliancePayload = {
    name: 'হাই স্পিড ইলেকট্রিক ফুড প্রসেসর ও ব্লেন্ডার',
    shortDescription: '১০০০ ওয়াট কপার মোটর ও ৩টি স্টেইনলেস স্টিল জারসহ পাওয়ারফুল ব্লেন্ডার।',
    description: `মসলা গুঁড়ো করা, জুস বানানো ও মাংসের কিমা তৈরির জন্য সেরা হেভি ডিউটি ইলেকট্রিক ব্লেন্ডার।
১০০০ ওয়াট হাই টর্ক পিওর কপার মোটর।
৩টি আনব্রেকেবল স্টেইনলেস স্টিল জার।
২ বছর ফ্রি সার্ভিস ওয়ারেন্টি।`,
    category: 'home-appliances',
    price: 3450,
    compareAtPrice: 4200,
    images: [
      'https://res.cloudinary.com/bichitra/image/upload/v12345/blender-1.jpg',
      'https://res.cloudinary.com/bichitra/image/upload/v12345/blender-2.jpg'
    ],
    variants: {
      capacities: ['1.5 Litre (Blender)', '1.0 Litre (Grinder)', '400ml (Chutney)'],
      colors: ['সিলভার ও ব্ল্যাক'],
      warranty: '২ বছর মোটর ওয়ারেন্টি',
      specs: '১০০০W কপার মোটর, ৩ স্পিড কন্ট্রোল'
    },
    stockQuantity: 25,
    status: 'published',
    featured: false
  };

  const applianceResult = productSchema.safeParse(appliancePayload);
  if (!applianceResult.success) {
    console.error('Appliance schema validation failed:', applianceResult.error.issues);
    process.exit(1);
  }
  console.log('✔ Home appliance product validation passed (capacities & warranty supported)');

  // Test 3: Organic food product (weights, pack sizes)
  const foodPayload = {
    name: 'খাঁটি গাওয়া ঘি ও পাহাড়ি কালোজিরা কম্বো',
    shortDescription: '১০০% খাঁটি দেশি গরুর দুধের গাওয়া ঘি এবং পরিষ্কার বাছাইকৃত কালোজিরা।',
    description: `সুস্থ ও সতেজ থাকার জন্য বিচিত্র শপের স্পেশাল অর্গানিক কম্বো।
শতভাগ ভেজালমুক্ত ও সুগন্ধযুক্ত গাওয়া ঘি।
কালোজিরা ও খাঁটি ঘি এর অসাধারণ পুষ্টিগুণ।`,
    category: 'organic-food',
    price: 1250,
    compareAtPrice: '',
    images: ['https://res.cloudinary.com/bichitra/image/upload/v12345/ghee.jpg'],
    variants: {
      weights: ['৫০০ গ্রাম ঘি + ২৫০ গ্রাম কালোজিরা'],
      specs: '১০০% খাঁটি দেশি গাওয়া ঘি'
    },
    stockQuantity: 40,
    status: 'published',
    featured: true
  };

  const foodResult = productSchema.safeParse(foodPayload);
  if (!foodResult.success) {
    console.error('Organic food schema validation failed:', foodResult.error.issues);
    process.exit(1);
  }
  console.log('✔ Organic food product validation passed (empty compareAtPrice handled properly)');

  // Test 4: Fashion product (with sizes)
  const fashionPayload = {
    name: 'এক্সক্লুসিভ প্রিমিয়াম কাবলি সেট',
    shortDescription: 'উৎসব ও জুমার নামাজের জন্য আরামদায়ক সুতি কাবলি পায়জামা সেট।',
    description: `উচ্চমানের কটন ফেব্রিক দিয়ে নিখুঁত ফিনিশিংয়ে তৈরি স্টাইলিশ পুরুষদের কাবলি সেট।`,
    category: 'mens-fashion',
    price: 2150,
    compareAtPrice: 2800,
    images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800'],
    variants: {
      sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
      colors: ['অলিভ গ্রিন', 'নেভি ব্লু', 'অফ হোয়াইট']
    },
    stockQuantity: 20
  };

  const fashionResult = productSchema.safeParse(fashionPayload);
  if (!fashionResult.success) {
    console.error('Fashion schema validation failed:', fashionResult.error.issues);
    process.exit(1);
  }
  console.log('✔ Fashion product validation passed with apparel sizes');

  console.log('All product validation tests passed successfully!');
}

runTests();
