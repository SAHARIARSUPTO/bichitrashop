// app/components/CalligraphyDealsSection.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Flame, Leaf, ArrowRight, Tag, ShoppingBag } from 'lucide-react';

const FALLBACK_CARDS = [
  {
    id: 'default-1',
    title: 'ধামাকা অফার সপ্তাহ',
    badge: '৫০% পর্যন্ত ছাড়',
    tag: 'মেগা সেল',
    icon: Flame,
    image: '/banners/bengali_calligraphy_dhamaka_sale.jpg',
    href: '/products?featured=true',
    ctaText: 'অর্ডার'
  },
  {
    id: 'default-2',
    title: 'খাঁটি দেশি অর্গানিক সমাহার',
    badge: '১০০% বিশুদ্ধ',
    tag: 'সুন্দরবনের মধু ও তেল',
    icon: Leaf,
    image: '/banners/bengali_calligraphy_organic_deshi.jpg',
    href: '/products/sundarban-raw-honey-mustard-oil-bundle',
    ctaText: 'অর্ডার'
  },
  {
    id: 'default-3',
    title: 'মার্জিত আবায়া কালেকশন',
    badge: 'নতুন কালেকশন',
    tag: 'দুবাই চেরি জর্জেট',
    icon: Sparkles,
    image: '/banners/bengali_calligraphy_abaya_banner.jpg',
    href: '/products/luxury-dubai-cherry-georgette-abaya',
    ctaText: 'অর্ডার'
  }
];

export default function CalligraphyDealsSection({ banners = [] }) {
  // Use active banners from admin settings if available
  const activeBanners = Array.isArray(banners)
    ? banners.filter((b) => b && b.active !== false && b.image)
    : [];

  const icons = [Flame, Leaf, Sparkles, ShoppingBag];

  const displayCards = activeBanners.length > 0
    ? activeBanners.map((b, idx) => {
        const rawLink = b.link || b.slug || '/products';
        const href = rawLink.startsWith('http')
          ? rawLink
          : rawLink.startsWith('/')
          ? rawLink
          : `/${rawLink}`;

        const Icon = icons[idx % icons.length];

        return {
          id: b.id || `promo-${idx}`,
          title: b.title || 'বিশেষ ধামাকা অফার',
          badge: b.badge || '',
          tag: b.tag || b.subtitle || 'সীমিত সময়ের অফার',
          image: b.image,
          href,
          ctaText: b.ctaText || 'অর্ডার',
          icon: Icon
        };
      })
    : FALLBACK_CARDS;

  const gridClass =
    displayCards.length === 1
      ? 'grid grid-cols-1 max-w-xl mx-auto gap-4'
      : displayCards.length === 2
      ? 'grid grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto gap-3 sm:gap-4'
      : 'grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4';

  return (
    <section className="space-y-4" aria-label="ধামাকা ডিল ও বিজ্ঞাপন অফার">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-amber-400 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-zinc-900 tracking-tight">
              ধামাকা অফার ও বিশেষ কালেকশন
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              সীমিত সময়ের জন্য অবিশ্বাস্য মূল্যছাড় ও ফ্রি ডেলিভারি অফার
            </p>
          </div>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#08542C] hover:text-black transition-colors"
        >
          <span>সব অফার</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className={gridClass}>
        {displayCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.id}
              href={card.href}
              className="group relative rounded-2xl overflow-hidden border border-zinc-200 shadow-2xs hover:shadow-md transition-all duration-300 bg-zinc-950 flex flex-col"
            >
              <div className="relative aspect-16/8 sm:aspect-16/9 w-full overflow-hidden bg-zinc-900">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 500px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />

                {card.badge && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DC2626] text-white text-[10px] sm:text-xs font-black shadow-xs tracking-wide uppercase">
                      <Tag className="w-3 h-3 text-white" />
                      <span>{card.badge}</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-white flex items-center justify-between border-t border-zinc-100">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-black" />
                  </span>
                  <div className="truncate">
                    <span className="text-xs sm:text-sm font-black text-zinc-900 block truncate group-hover:text-[#08542C] transition-colors">
                      {card.title}
                    </span>
                    <span className="text-xs text-zinc-500 block truncate">{card.tag}</span>
                  </div>
                </div>

                <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-full group-hover:bg-[#08542C] group-hover:text-white transition-colors">
                  <span>{card.ctaText}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
