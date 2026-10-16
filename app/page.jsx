// app/page.jsx
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, RotateCcw, BadgeCheck, Headphones, PhoneCall, ShoppingBag, Zap, Home, LayoutGrid } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ModernHero from './components/ModernHero';
import HomePaginatedProducts from './components/HomePaginatedProducts';
import FestiveCalligraphySection from './components/FestiveCalligraphySection';
import DeshiAppliancesSection from './components/DeshiAppliancesSection';
import CalligraphyDealsSection from './components/CalligraphyDealsSection';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export const dynamic = 'force-dynamic';

const DEFAULT_ANNOUNCEMENT = 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে! ৩টি বা ততোধিক পণ্যে ফ্রি ডেলিভারি।';
const CATEGORY_FALLBACK_IMAGE = '/categories/mens_fashion.jpg';

const SERVICE_PERKS = [
  { icon: Truck, title: 'ক্যাশ অন ডেলিভারি', text: 'সারা বাংলাদেশে' },
  { icon: BadgeCheck, title: '১০০% অরিজিনাল', text: 'কোয়ালিটি গ্যারান্টি' },
  { icon: RotateCcw, title: 'সহজ রিটার্ন', text: 'পার্সেল খুলে চেক করুন' },
  { icon: Headphones, title: 'সাপোর্ট', text: 'সকাল ১০টা – রাত ১০টা' },
];

const ORDER_STEPS = [
  { title: 'পণ্য বাছাই করুন', text: 'সাইজ ও পরিমাণ ঠিক করে কার্টে যোগ করুন।' },
  { title: 'ঠিকানা দিন', text: 'নাম, মোবাইল নম্বর ও ঠিকানা দিয়ে অর্ডার কনফার্ম করুন।' },
  { title: 'হাতে পেয়ে টাকা দিন', text: 'পার্সেল চেক করে ডেলিভারিম্যানকে মূল্য পরিশোধ করুন।' },
];


const BOTTOM_NAV_ITEMS = [
  { href: '/', label: 'হোম', icon: Home, active: true },
  { href: '/products', label: 'পণ্য', icon: LayoutGrid },
  { href: 'tel:+8801700000000', label: 'কল', icon: PhoneCall },
];

// Static on purpose: this page is the homepage, so "Home" is always the active tab.
// That avoids needing a 'use client' component (and usePathname) in this file.
function MobileBottomNav() {
  return (
    <nav
      aria-label="মোবাইল নেভিগেশন"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E2ECE3] bg-white/90 backdrop-blur-md md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-3">
        {BOTTOM_NAV_ITEMS.map(({ href, label, icon: Icon, active }) => (
          <li key={label}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${
                active ? 'text-black' : 'text-zinc-500 hover:text-black'
              }`}
            >
              <Icon className="w-5 h-5 text-black stroke-[1.8]" aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function formatSaleEnd(isoString) {
  return new Intl.DateTimeFormat('bn-BD', {
    timeZone: 'Asia/Dhaka',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(isoString));
}

function endOfTodayInDhaka() {
  // Dhaka is UTC+6 with no DST, so a fixed offset is safe.
  const dhakaNow = new Date(Date.now() + 6 * 60 * 60 * 1000);
  dhakaNow.setUTCHours(23, 59, 59, 999);
  return new Date(dhakaNow.getTime() - 6 * 60 * 60 * 1000).toISOString();
}

async function getHomeData() {
  try {
    await initDatabase();
    const [productsColl, categoriesColl, settingsColl] = await Promise.all([
      getCollection('products'),
      getCollection('categories'),
      getCollection('settings'),
    ]);

    const [allProducts, flashProducts, featuredProducts, latestProducts, categories, settings] = await Promise.all([
      productsColl.find({ status: 'published' }).sort({ createdAt: -1 }).limit(48).toArray(),
      productsColl.find({ status: 'published', flashSale: true }).limit(10).toArray(),
      productsColl.find({ status: 'published', featured: true }).limit(8).toArray(),
      productsColl.find({ status: 'published' }).sort({ createdAt: -1 }).limit(8).toArray(),
      categoriesColl.find({ status: 'active' }).toArray(),
      settingsColl.findOne({ key: 'store_settings' }),
    ]);

    const serialize = (docs) => JSON.parse(JSON.stringify(docs));

    return {
      allProducts: serialize(allProducts),
      flashProducts: serialize(flashProducts),
      featuredProducts: serialize(featuredProducts),
      latestProducts: serialize(latestProducts),
      categories: serialize(categories),
      announcement: settings?.announcement || DEFAULT_ANNOUNCEMENT,
      heroBanners: settings?.heroBanners || [],
      promoBanners: settings?.promoBanners || [],
      flashSaleEndsAt: settings?.flashSaleEndsAt
        ? new Date(settings.flashSaleEndsAt).toISOString()
        : endOfTodayInDhaka(),
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      allProducts: [],
      flashProducts: [],
      featuredProducts: [],
      latestProducts: [],
      categories: [],
      announcement: DEFAULT_ANNOUNCEMENT,
      heroBanners: [],
      promoBanners: [],
      flashSaleEndsAt: endOfTodayInDhaka(),
    };
  }
}

function SectionHeader({ title, href, linkLabel = 'সব দেখুন', children }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="text-lg sm:text-2xl font-extrabold text-[#0F2417] truncate">{title}</h2>
        {children}
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[#08542C] px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#08542C] transition-colors hover:bg-[#08542C] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08542C]"
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}

export default async function HomePage() {
  const { allProducts, flashProducts, featuredProducts, latestProducts, categories, announcement, heroBanners, promoBanners, flashSaleEndsAt } =
    await getHomeData();

  const combinedProducts = allProducts.length > 0
    ? allProducts
    : Array.from(new Map([...flashProducts, ...featuredProducts, ...latestProducts].map(p => [p.slug, p])).values());

  const hasAnyProducts = combinedProducts.length > 0;

  // Filter dedicated products for specialized showcase zones
  const festiveProducts = combinedProducts.filter(
    (p) => p.category === 'mens-fashion' || p.category === 'womens-fashion'
  ).slice(0, 4);

  const applianceProducts = combinedProducts.filter(
    (p) => p.category === 'home-appliances'
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F7F4]">
      <Header categories={categories} announcement={announcement} />
      <ModernHero categories={categories} banners={heroBanners} />

      <main className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-24 md:pb-12 space-y-8 sm:space-y-12">
        {/* DIRECT MOBILE-FIRST PRODUCT CARDS FEED WITH PAGING TECHNIQUE */}
        {hasAnyProducts ? (
          <HomePaginatedProducts
            initialProducts={combinedProducts}
            categories={categories}
            flashSaleEndsAt={flashSaleEndsAt}
          />
        ) : (
          <div className="mx-auto max-w-md space-y-4 rounded-3xl bg-white p-10 text-center shadow-[0_1px_3px_rgba(15,36,23,0.06)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5EC] text-[#08542C]">
              <ShoppingBag className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#0F2417]">এখনো কোনো পণ্য যোগ করা হয়নি</h3>
            <p className="text-sm text-[#4B6354]">অ্যাডমিন ড্যাশবোর্ড থেকে পণ্য যোগ করলে এখানে দেখা যাবে।</p>
            <Link
              href="/admin/products"
              className="inline-flex rounded-full bg-[#08542C] px-5 py-2.5 text-sm font-bold text-white"
            >
              পণ্য যোগ করুন
            </Link>
          </div>
        )}

        {/* NEW SECTION 1: BENGALI CALLIGRAPHY FESTIVE & HERITAGE COLLECTION */}
        {festiveProducts.length > 0 && (
          <FestiveCalligraphySection products={festiveProducts} />
        )}

        {/* NEW SECTION 2: 3-COLUMN CALLIGRAPHIC PROMO & FLASH DEALS GRID */}
        <CalligraphyDealsSection />

        {/* NEW SECTION 3: DESHI KITCHEN & HOME APPLIANCES FEATURE ZONE */}
        {applianceProducts.length > 0 && (
          <DeshiAppliancesSection products={applianceProducts} />
        )}


        {/* Single, compact promo strip */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-[#08542C] p-5 sm:p-8 text-white shadow-xs">
          <div className="space-y-1.5 max-w-xl">
            <h2 className="text-lg sm:text-2xl font-extrabold leading-snug">
              পার্সেল দেখে, চেক করে তারপর টাকা দিন
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              ডেলিভারিম্যানের সামনে পার্সেল খুলে দেখার সুযোগ। কোনো সমস্যা থাকলে সঙ্গে সঙ্গে ফেরত।
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[#08542C] transition-colors hover:bg-[#E8F5EC]"
            >
              কেনাকাটা শুরু করুন
            </Link>
            <a
              href="tel:+8801700000000"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold transition-colors hover:bg-white/10"
            >
              <PhoneCall className="w-4 h-4" aria-hidden="true" />
              01700-000000
            </a>
          </div>
        </section>

        {/* Service perks: 2x2 on mobile, one row on desktop */}
        <section aria-label="আমাদের সুবিধা">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {SERVICE_PERKS.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 sm:p-4 shadow-[0_1px_3px_rgba(15,36,23,0.06)] border border-zinc-100"
              >
                <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-black">
                  <Icon className="w-5 h-5 text-black stroke-[1.8]" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] sm:text-sm font-bold text-[#0F2417] leading-tight">{title}</p>
                  <p className="text-[11px] sm:text-xs text-[#4B6354] mt-0.5 truncate">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {!hasAnyProducts && (
          <div className="mx-auto max-w-md space-y-4 rounded-3xl bg-white p-10 text-center shadow-[0_1px_3px_rgba(15,36,23,0.06)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5EC] text-[#08542C]">
              <ShoppingBag className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#0F2417]">এখনো কোনো পণ্য যোগ করা হয়নি</h3>
            <p className="text-sm text-[#4B6354]">অ্যাডমিন ড্যাশবোর্ড থেকে পণ্য যোগ করলে এখানে দেখা যাবে।</p>
            <Link
              href="/admin/products"
              className="inline-flex rounded-full bg-[#08542C] px-5 py-2.5 text-sm font-bold text-white"
            >
              পণ্য যোগ করুন
            </Link>
          </div>
        )}

        {/* How ordering works: this one is a real sequence, so numbers are justified */}
        <section className="rounded-3xl bg-white p-5 sm:p-8 shadow-[0_1px_3px_rgba(15,36,23,0.06)]">
          <h2 className="text-lg sm:text-2xl font-extrabold text-[#0F2417]">অর্ডার করবেন যেভাবে</h2>
          <p className="text-sm text-[#4B6354] mt-1 mb-6">অ্যাকাউন্ট ছাড়াই ৩ ধাপে অর্ডার সম্পন্ন হয়।</p>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ORDER_STEPS.map((step, index) => (
              <li key={step.title} className="flex items-start gap-4 rounded-2xl bg-[#F3F7F4] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-extrabold text-white">
                  {['১', '২', '৩'][index]}
                </span>
                <div>
                  <h3 className="font-bold text-[#0F2417]">{step.title}</h3>
                  <p className="text-sm text-[#4B6354] mt-1 leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}