// lib/banners.js
// Default hero banners, promotional advertise banners, and sample banner images for Bichitra Shop
// All images feature authentic Bangladeshi vibe and Bengali calligraphy aesthetics

export const DEFAULT_HERO_BANNERS = [
  {
    id: 1,
    title: 'উৎসবের রঙে সাজুন – এক্সক্লুসিভ কোটি ও পাঞ্জাবি সেট',
    subtitle: 'নিখুঁত হ্যান্ডক্রাফটেড সুতার কাজ, আরামদায়ক সিল্ক-কটন ব্লেন্ড এবং শতভাগ পাকা রঙের নিশ্চয়তা',
    badge: 'ঐতিহ্যবাহী উৎসব',
    tag: 'মেনস ফ্যাশন',
    price: 1850,
    comparePrice: 2450,
    discount: '৳৬০০ ছাড় (২৫%)',
    slug: 'exclusive-embroidered-koti-set',
    image: '/banners/bengali_calligraphy_festive_banner.jpg',
    active: true
  },
  {
    id: 2,
    title: 'দেশি কিচেন ও হোম অ্যাপ্লায়েন্স – ব্লেন্ডার ও কুকার',
    subtitle: 'খাঁটি মসলা বাটা ও আধুনিক রান্নার জন্য ১০০% কপার মোটর ব্লেন্ডার ও রাইস কুকার',
    badge: 'দেশি গৃহস্থালি',
    tag: 'হোম অ্যাপ্লায়েন্স',
    price: 1950,
    comparePrice: 2600,
    discount: '৳৬৫০ ছাড় (২৫%)',
    slug: '/products?category=home-appliances',
    image: '/banners/bengali_calligraphy_kitchen_banner.jpg',
    active: true
  },
  {
    id: 3,
    title: 'মার্জিত ও স্নিগ্ধ ফ্যাশন – প্রিমিয়াম দুবাই চেরি আবায়া',
    subtitle: 'মার্জিত কাট, নিখুঁত স্টোন ও হ্যান্ড এম্ব্রয়ডারি ওয়ার্ক এবং আরামদায়ক প্রিমিয়াম দুবাই ফেব্রিক',
    badge: 'নতুন কালেকশন',
    tag: 'উইমেনস ফ্যাশন',
    price: 2250,
    comparePrice: 2850,
    discount: '৳৬০০ ছাড় (২১%)',
    slug: 'luxury-dubai-cherry-georgette-abaya',
    image: '/banners/bengali_calligraphy_abaya_banner.jpg',
    active: true
  },
  {
    id: 4,
    title: 'ধামাকা অফার সপ্তাহ – ৫০% পর্যন্ত বিশেষ ছাড়',
    subtitle: 'হোম অ্যাপ্লায়েন্স, প্রিমিয়াম পোশাক ও স্মার্ট গ্যাজেটে সীমিত সময়ের অবিশ্বাস্য মূল্যছাড়',
    badge: 'ধামাকা সেল',
    tag: 'হট ডিল',
    price: 890,
    comparePrice: 1350,
    discount: '৫০% পর্যন্ত ছাড়',
    slug: 'wireless-stereo-earbuds',
    image: '/banners/bengali_calligraphy_dhamaka_sale.jpg',
    active: true
  },
  {
    id: 5,
    title: 'খাঁটি দেশি পণ্যের আস্থা – সুন্দরবনের কাঁচা মধু ও তেল',
    subtitle: 'সুন্দরবনের প্রাকৃতিক মৌচাকের মধু ও দেশি কাঠের ঘানিতে ভাঙানো খাঁটি সরিষার তেল কম্বো',
    badge: '১০০% খাঁটি পণ্য',
    tag: 'অর্গানিক ফুড',
    price: 980,
    comparePrice: 1250,
    discount: '৳২৭০ ছাড় (২২%)',
    slug: 'sundarban-raw-honey-mustard-oil-bundle',
    image: '/banners/bengali_calligraphy_organic_deshi.jpg',
    active: true
  }
];

// Promotional Advertise Banners (e.g., Sale, Off, Clearance, Combo banners)
export const DEFAULT_PROMO_BANNERS = [
  {
    id: 'promo-1',
    title: 'দেশি কিচেন অ্যাপ্লায়েন্স মেগা সেল',
    subtitle: 'ব্লেন্ডার, রাইস কুকার ও আধুনিক কিচেন সামগ্রীতে আকর্ষণীয় মূল্যছাড়',
    badge: '৫০% পর্যন্ত অফ',
    tag: 'কিচেন ধামাকা',
    ctaText: 'অফার দেখুন',
    link: '/products?category=home-appliances',
    image: '/banners/bengali_calligraphy_kitchen_banner.jpg',
    accentColor: 'from-amber-600 to-red-600',
    active: true
  },
  {
    id: 'promo-2',
    title: 'ধামাকা অফার সপ্তাহ ও ফ্রি হোম ডেলিভারি',
    subtitle: 'যেকোনো ৩টি পণ্য অর্ডারে ঢাকা ও সারা বাংলাদেশে ডেলিভারি সম্পূর্ণ ফ্রি',
    badge: 'ফ্রি শিপিং',
    tag: 'সীমিত অফার',
    ctaText: 'অর্ডার করুন',
    link: '/products',
    image: '/banners/bengali_calligraphy_dhamaka_sale.jpg',
    accentColor: 'from-emerald-700 to-teal-800',
    active: true
  },
  {
    id: 'promo-3',
    title: 'খাঁটি দেশি অর্গানিক খাদ্য ও মধু সমাহার',
    subtitle: 'সুন্দরবনের প্রাকৃতিক কাঁচা মধু ও কাঠের ঘানির সরিষার তেল কম্বো',
    badge: '১০০% খাঁটি',
    tag: 'অর্গানিক ফুড',
    ctaText: 'কালেকশন দেখুন',
    link: '/products/sundarban-raw-honey-mustard-oil-bundle',
    image: '/banners/bengali_calligraphy_organic_deshi.jpg',
    accentColor: 'from-zinc-900 to-black',
    active: true
  }
];

export const SAMPLE_BANNER_IMAGES = [
  { label: 'উৎসবের রঙে সাজুন (ক্যালিগ্রাফি ব্যানার)', url: '/banners/bengali_calligraphy_festive_banner.jpg' },
  { label: 'দেশি কিচেন ও অ্যাপ্লায়েন্স (ক্যালিগ্রাফি ব্যানার)', url: '/banners/bengali_calligraphy_kitchen_banner.jpg' },
  { label: 'মার্জিত আবায়া ও বোরকা (ক্যালিগ্রাফি ব্যানার)', url: '/banners/bengali_calligraphy_abaya_banner.jpg' },
  { label: 'ধামাকা অফার সপ্তাহ (ক্যালিগ্রাফি ব্যানার)', url: '/banners/bengali_calligraphy_dhamaka_sale.jpg' },
  { label: 'খাঁটি দেশি পণ্যের আস্থা (ক্যালিগ্রাফি ব্যানার)', url: '/banners/bengali_calligraphy_organic_deshi.jpg' },
  { label: 'মেনস প্রিমিয়াম কোটি (দেশি মডেল)', url: '/banners/koti_collection_banner.jpg' },
  { label: 'উইমেনস দুবাই আবায়া (মার্জিত ফ্যাশন)', url: '/banners/abaya_collection_banner.jpg' },
  { label: 'দেশি খাঁটি মশলা সমাহার', url: '/banners/deshi_aromatic_spices.jpg' },
  { label: 'ইলেকট্রিক ব্লেন্ডার ও গ্রাইন্ডার', url: '/banners/kitchen_blender_appliance.jpg' },
  { label: 'স্মার্ট গ্যাজেটস ও অডিও', url: '/banners/gadgets_lifestyle_banner.jpg' },
  { label: 'ঐতিহ্যবাহী বিরিয়ানি ও খাদ্য সংস্কৃতি', url: '/banners/deshi_biryani_pot.jpg' }
];
