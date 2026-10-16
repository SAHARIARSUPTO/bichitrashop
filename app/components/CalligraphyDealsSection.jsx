// app/components/CalligraphyDealsSection.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Flame, Leaf, ArrowRight } from 'lucide-react';

export default function CalligraphyDealsSection() {
  const cards = [
    {
      title: 'ধামাকা অফার সপ্তাহ',
      badge: '৫০% পর্যন্ত ছাড়',
      tag: 'মেগা সেল',
      icon: Flame,
      image: '/banners/bengali_calligraphy_dhamaka_sale.jpg',
      href: '/products?featured=true',
      color: 'from-red-950 via-red-900 to-black'
    },
    {
      title: 'খাঁটি দেশি অর্গানিক সমাহার',
      badge: '১০০% বিশুদ্ধ',
      tag: 'সুন্দরবনের মধু ও তেল',
      icon: Leaf,
      image: '/banners/bengali_calligraphy_organic_deshi.jpg',
      href: '/products/sundarban-raw-honey-mustard-oil-bundle',
      color: 'from-emerald-950 via-teal-900 to-black'
    },
    {
      title: 'মার্জিত আবায়া কালেকশন',
      badge: 'নতুন কালেকশন',
      tag: 'দুবাই চেরি জর্জেট',
      icon: Sparkles,
      image: '/banners/bengali_calligraphy_abaya_banner.jpg',
      href: '/products/luxury-dubai-cherry-georgette-abaya',
      color: 'from-purple-950 via-rose-950 to-black'
    }
  ];

  return (
    <section className="space-y-4" aria-label="ধামাকা ডিল ও দেশি স্পেশাল">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="group relative rounded-2xl overflow-hidden border border-zinc-200 shadow-2xs hover:shadow-md transition-all duration-300 bg-zinc-950 flex flex-col"
            >
              <div className="relative aspect-[16/8] sm:aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 500px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
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
                  <span>অর্ডার</span>
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
