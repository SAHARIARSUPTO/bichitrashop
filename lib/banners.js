// lib/banners.js
// Default hero banners and sample banner images for Bichitra Shop

export const DEFAULT_HERO_BANNERS = [
  {
    id: 1,
    title: 'এক্সক্লুসিভ অ্যামব্রয়ডারি প্রিমিয়াম কোটি ও পাঞ্জাবি সেট',
    subtitle: 'পারিবারিক অনুষ্ঠান ও উৎসবের জন্য আরামদায়ক সিল্ক-কটন ব্লেন্ড এবং নিখুঁত হ্যান্ডক্রাফটেড ফিনিশিং',
    badge: 'ফেস্টিভ অফার',
    tag: 'মেনস ফ্যাশন',
    price: 1850,
    comparePrice: 2450,
    discount: '৳৬০০ ছাড় (২৫%)',
    slug: 'exclusive-embroidered-koti-set',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1600&q=80',
    active: true
  },
  {
    id: 2,
    title: 'দুবাই চেরি জর্জেট পার্টি আবায়া ও বোরকা কালেকশন',
    subtitle: 'মার্জিত ডিজাইন, শতভাগ পাকা রঙ ও আরামদায়ক প্রিমিয়াম দুবাই চেরি জর্জেট ফেব্রিক',
    badge: 'নতুন কালেকশন',
    tag: 'উইমেনস ফ্যাশন',
    price: 2250,
    comparePrice: 2850,
    discount: '৳৬০০ ছাড় (২১%)',
    slug: 'luxury-dubai-cherry-georgette-abaya',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80',
    active: true
  },
  {
    id: 3,
    title: 'স্মার্ট ওয়্যারলেস ব্লুটুথ ইয়ারবাডস ও অডিও গ্যাজেটস',
    subtitle: 'ডিপ বাস, নয়েজ ক্যান্সেলেশন এবং ২০ ঘণ্টার লং ব্যাটারি ব্যাকআপযুক্ত ডিজিটাল ডিসপ্লে গ্যাজেট',
    badge: 'স্মার্ট গ্যাজেটস',
    tag: 'গেজেটস অফার',
    price: 890,
    comparePrice: 1350,
    discount: '৳৪৬০ ছাড় (৩৪%)',
    slug: 'wireless-stereo-earbuds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1600&q=80',
    active: true
  },
  {
    id: 4,
    title: 'মাল্টিফাংশন হোম ও কিচেন অ্যাপ্লায়েন্স',
    subtitle: 'আধুনিক গৃহস্থালির সহজ রান্নাবান্না ও লাইফস্টাইলের জন্য প্রিমিয়াম ইলেকট্রিক ব্লেন্ডার ও কিচেন গ্যাজেট',
    badge: 'হোম ও কিচেন',
    tag: 'অ্যাপ্লায়েন্স',
    price: 1950,
    comparePrice: 2600,
    discount: '৳৬৫০ ছাড় (২৫%)',
    slug: 'multi-function-foldable-laptop-table',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    active: true
  },
  {
    id: 5,
    title: 'সুন্দরবনের প্রাকৃতিক কাঁচা মধু ও ঘানির সরিষার তেল',
    subtitle: 'প্রাকৃতিক মৌচাকের খাঁটি মধু এবং দেশি কাঠের ঘানিতে ভাঙানো প্রথম চাপের ঝাঁঝালো সরিষার তেল কম্বো',
    badge: '১০০% খাঁটি পণ্য',
    tag: 'অর্গানিক ফুড',
    price: 980,
    comparePrice: 1250,
    discount: '৳২৭০ ছাড় (২২%)',
    slug: 'sundarban-raw-honey-mustard-oil-bundle',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1600&q=80',
    active: true
  }
];

export const SAMPLE_BANNER_IMAGES = [
  { label: 'মেনস কোটি ও পাঞ্জাবি', url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1600&q=80' },
  { label: 'উইমেনস দুবাই আবায়া', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80' },
  { label: 'স্মার্ট ইয়ারবাডস ও গ্যাজেটস', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1600&q=80' },
  { label: 'হোম ও কিচেন অ্যাপ্লায়েন্স', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80' },
  { label: 'খাঁটি মধু ও সরিষার তেল', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1600&q=80' },
  { label: 'ফোল্ডেবল ল্যাপটপ টেবিল', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80' },
  { label: 'স্মার্ট ওয়াচ ও এক্সেসরিজ', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80' }
];
