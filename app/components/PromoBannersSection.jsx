// app/components/PromoBannersSection.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame, Sparkles, Tag, ShoppingBag, ShieldCheck } from 'lucide-react';
import { DEFAULT_PROMO_BANNERS } from '@/lib/banners';

export default function PromoBannersSection({ banners = [] }) {
  const activeBanners = (Array.isArray(banners) && banners.length > 0)
    ? banners.filter(b => b.active !== false)
    : DEFAULT_PROMO_BANNERS;

  const displayBanners = activeBanners.length > 0 ? activeBanners : DEFAULT_PROMO_BANNERS;

  return (
    <section aria-label="বিজ্ঞাপন ও বিশেষ অফার ব্যানার" className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
            <Flame className="w-4 h-4 text-white stroke-[2]" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-zinc-900 leading-tight">
              ধামাকা অফার ও বিশেষ ছাড়
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-500">
              সীমিত সময়ের আকর্ষণীয় ডিসকাউন্ট ও ক্যাশ অন ডেলিভারি অফার
            </p>
          </div>
        </div>

        <Link
          href="/products?featured=true"
          className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-zinc-800 hover:text-black hover:underline"
        >
          <span>সব অফার</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Promotional Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {displayBanners.map((promo, idx) => (
          <div
            key={promo.id || idx}
            className="group relative rounded-2xl overflow-hidden shadow-2xs border border-zinc-200/80 bg-zinc-950 flex flex-col justify-end min-h-[175px] sm:min-h-[220px] transition-all hover:shadow-md"
          >
            {/* Background Image */}
            {promo.image && (
              <Image
                src={promo.image}
                alt={promo.title || 'Special Offer'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
                unoptimized
              />
            )}

            {/* Gradient Dark Overlay for Crisp Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

            {/* Banner Content Card */}
            <div className="relative z-10 p-3.5 sm:p-5 flex flex-col justify-between h-full space-y-3">
              {/* Badges Top Bar */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DC2626] text-white text-[10px] sm:text-xs font-black shadow-xs tracking-wide uppercase">
                  <Tag className="w-3 h-3 text-white" />
                  {promo.badge || 'স্পেশাল অফার'}
                </span>

                {promo.tag && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] sm:text-[11px] font-semibold text-white">
                    {promo.tag}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-sm sm:text-lg font-black text-white leading-tight drop-shadow-sm group-hover:text-emerald-300 transition-colors line-clamp-1 sm:line-clamp-2">
                  {promo.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed line-clamp-2">
                  {promo.subtitle}
                </p>
              </div>

              {/* Bottom Action Strip */}
              <div className="pt-1 flex items-center justify-between gap-3">
                <Link
                  href={promo.link || '/products'}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs shadow-xs transition-all active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-black" />
                  <span>{promo.ctaText || 'অর্ডার করুন'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </Link>

                <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ক্যাশ অন ডেলিভারি</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
