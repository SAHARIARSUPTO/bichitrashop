// app/components/FestiveCalligraphySection.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Shirt, ShieldCheck, Truck, ShoppingBag, Eye } from 'lucide-react';
import ProductCard from './ProductCard';

export default function FestiveCalligraphySection({ products = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-4 sm:space-y-6" aria-label="বাঙালি ঐতিহ্য ও উৎসব কালেকশন">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-zinc-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4 text-white stroke-[2]" />
          </div>
          <div>
            <h2 className="text-base sm:text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
              <span>বাঙালি ঐতিহ্য ও উৎসব কালেকশন</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-[#08542C] text-xs font-extrabold">
                ফেস্টিভ স্পেশাল
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-600 mt-0.5">
              ঐতিহ্যবাহী নকশি সুতার কাজ, আরামদায়ক সিল্ক-কটন ব্লেন্ড এবং শতভাগ পাকা রঙের নিশ্চয়তা
            </p>
          </div>
        </div>

        <Link
          href="/products?category=mens-fashion"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs sm:text-sm font-bold text-[#08542C] hover:text-black transition-colors"
        >
          <span>সব ফেস্টিভ কালেকশন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Featured Wide Bengali Calligraphy Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-zinc-200 bg-zinc-950 group">
        <Link href="/products/exclusive-embroidered-koti-set" className="block relative aspect-[16/7] sm:aspect-[21/9] w-full">
          <Image
            src="/banners/bengali_calligraphy_festive_banner.jpg"
            alt="বাঙালি ঐতিহ্য ও উৎসব কালেকশন - উৎসবের রঙে সাজুন"
            fill
            sizes="(max-width: 768px) 100vw, 1500px"
            className="object-cover object-center group-hover:scale-[1.015] transition-transform duration-500"
            unoptimized
          />
        </Link>
      </div>

      {/* Trust Badges Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {[
          { icon: Sparkles, title: 'হ্যান্ডক্রাফটেড সুতার কাজ', desc: 'নিখুঁত কারুকাজ ও ফিনিশিং' },
          { icon: ShieldCheck, title: '১০০% কালার গ্যারান্টি', desc: 'শতভাগ পাকা রঙের নিশ্চয়তা' },
          { icon: Truck, title: 'পার্সেল খুলে দেখে পেমেন্ট', desc: 'ক্যাশ অন ডেলিভারি সুবিধা' },
          { icon: Shirt, title: 'আরামদায়ক ফেব্রিক', desc: 'সিল্ক-কটন প্রিমিয়াম ব্লেন্ড' },
        ].map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                <Icon className="w-4 h-4 text-black stroke-[1.8]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] sm:text-xs font-bold text-zinc-900 truncate">{badge.title}</h4>
                <p className="text-[10px] text-zinc-500 truncate">{badge.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Festive Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
