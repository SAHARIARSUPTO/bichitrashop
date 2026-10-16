// app/components/DeshiAppliancesSection.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Utensils, Zap, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import ProductCard from './ProductCard';

export default function DeshiAppliancesSection({ products = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-4 sm:space-y-6" aria-label="দেশি কিচেন ও হোম অ্যাপ্লায়েন্স জোন">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-zinc-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EA580C] flex items-center justify-center shrink-0 shadow-2xs">
            <Utensils className="w-4 h-4 text-white stroke-[2]" />
          </div>
          <div>
            <h2 className="text-base sm:text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
              <span>দেশি কিচেন ও হোম অ্যাপ্লায়েন্স জোন</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                মেগা অফার
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-600 mt-0.5">
              খাঁটি মসলা বাটা, রাইস কুকার ও দ্রুত পানি গরম করার আধুনিক ও টেকসই কিচেন সরঞ্জাম
            </p>
          </div>
        </div>

        <Link
          href="/products?category=home-appliances"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs sm:text-sm font-bold text-[#EA580C] hover:text-black transition-colors"
        >
          <span>সব অ্যাপ্লায়েন্স দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Featured Calligraphy Kitchen Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs border border-zinc-200 bg-zinc-950 group">
        <Link href="/products?category=home-appliances" className="block relative aspect-[16/7] sm:aspect-[21/9] w-full">
          <Image
            src="/banners/bengali_calligraphy_kitchen_banner.jpg"
            alt="দেশি কিচেন ও হোম অ্যাপ্লায়েন্স - খাঁটি মসলা বাটার ব্লেন্ডার"
            fill
            sizes="(max-width: 768px) 100vw, 1500px"
            className="object-cover object-center group-hover:scale-[1.015] transition-transform duration-500"
            unoptimized
          />
        </Link>
      </div>

      {/* Feature Value Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {[
          { icon: Zap, title: '১০০% কপার মোটর', desc: 'অধিক শক্তিশালী ও দীর্ঘস্থায়ী' },
          { icon: Utensils, title: 'খাঁটি মসলা বাটার সুবিধা', desc: 'আসল দেশি রান্নার স্বাদ' },
          { icon: ShieldCheck, title: 'ব্র্যান্ড সার্ভিস ওয়ারেন্টি', desc: '১ থেকে ২ বছরের নিশ্চয়তা' },
          { icon: Truck, title: 'সারা দেশে হোম ডেলিভারি', desc: 'ক্যাশ অন ডেলিভারিতে চেক করুন' },
        ].map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200">
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

      {/* Kitchen Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
