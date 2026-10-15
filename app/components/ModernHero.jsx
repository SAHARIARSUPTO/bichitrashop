// app/components/ModernHero.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  PhoneCall,
  Flame,
  Shirt,
  Leaf,
  Laptop,
  Headphones,
  Tag,
  PackageCheck,
  RotateCcw,
  LayoutGrid,
  CheckCircle2
} from 'lucide-react';
import { formatBDT } from '@/lib/pricing';
import { DEFAULT_HERO_BANNERS } from '@/lib/banners';

export default function ModernHero({ categories = [], banners = [] }) {
  // Use active banners from admin settings if available, else default slides
  const activeSlides = (Array.isArray(banners) && banners.length > 0)
    ? banners.filter(b => b.active !== false)
    : DEFAULT_HERO_BANNERS;

  const slides = activeSlides.length > 0 ? activeSlides : DEFAULT_HERO_BANNERS;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play banner slide every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Quick Circular Category Action Buttons with Black Vector Icons
  const quickCategories = [
    { name: 'হট ডিল অফার', href: '/products?featured=true', icon: Flame, highlight: true },
    { name: 'কোটি সেট', href: '/products/exclusive-embroidered-koti-set', icon: Shirt },
    { name: 'পাঞ্জাবি', href: '/products/traditional-jamdani-cotton-panjabi', icon: Sparkles },
    { name: 'বোরকা ও আবায়া', href: '/products/luxury-dubai-cherry-georgette-abaya', icon: Tag },
    { name: 'খাঁটি মধু ও তেল', href: '/products/sundarban-raw-honey-mustard-oil-bundle', icon: Leaf },
    { name: 'ল্যাপটপ টেবিল', href: '/products/multi-function-foldable-laptop-table', icon: Laptop },
    { name: 'ব্লুটুথ ইয়ারবাডস', href: '/products/wireless-stereo-earbuds', icon: Headphones },
    { name: 'ফ্রি ডেলিভারি অফার', href: '/products', icon: Truck, highlight: true }
  ];

  // Left Sidebar Categories with Clean Black Vector Icons (Othoba / Daraz style)
  const sidebarCategories = [
    {
      name: "মেনস কোটি ও পাঞ্জাবি",
      href: "/products?category=mens-fashion",
      icon: Shirt,
      badge: "হট ডিল",
      badgeColor: "bg-zinc-900 text-white",
      desc: "কোটি সেট, সুতি জামদানি পাঞ্জাবি"
    },
    {
      name: "উইমেনস বোরকা ও আবায়া",
      href: "/products?category=womens-fashion",
      icon: Tag,
      badge: "নতুন",
      badgeColor: "bg-zinc-800 text-white",
      desc: "দুবাই চেরি জর্জেট পার্টি আবায়া"
    },
    {
      name: "খাঁটি অর্গানিক ফুড ও মধু",
      href: "/products?category=organic-food",
      icon: Leaf,
      badge: "১০০% খাঁটি",
      badgeColor: "bg-zinc-900 text-white",
      desc: "সুন্দরবনের মধু, সরিষার তেল"
    },
    {
      name: "স্মার্ট হোম ও লাইফস্টাইল",
      href: "/products?category=home-living",
      icon: Laptop,
      desc: "ফোল্ডেবল ল্যাপটপ টেবিল"
    },
    {
      name: "অডিও ও স্মার্ট গ্যাজেটস",
      href: "/products?category=home-living",
      icon: Headphones,
      desc: "ওয়্যারলেস ব্লুটুথ ইয়ারবাডস"
    },
    {
      name: "বিশেষ ডিসকাউন্ট অফার",
      href: "/products?featured=true",
      icon: Flame,
      badge: "অফার",
      badgeColor: "bg-[#DC2626] text-white",
      desc: "সীমিত সময়ের আকর্ষণীয় মূল্যছাড়"
    },
    {
      name: "সকল পণ্য ক্যাটালগ",
      href: "/products",
      icon: ShoppingBag,
      desc: "সব পণ্য একসাথে ব্রাউজ করুন"
    }
  ];

  return (
    <div className="bg-[#F6FAF7] pt-3 pb-6 space-y-3.5">
      {/* 1. Quick Category Buttons Strip with Crisp Black Icons */}
      <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {quickCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={cat.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border ${
                  cat.highlight
                    ? 'bg-white text-zinc-900 border-zinc-900 hover:bg-zinc-50 shadow-2xs'
                    : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-800 hover:text-black shadow-2xs'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                  <Icon className="w-2.5 h-2.5 text-black stroke-[2]" />
                </span>
                <span className="tracking-tight text-[11px] sm:text-xs">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Main Hero Layout with INCREASED BANNER WIDTH (1536px Container, 9-Column Slider) */}
      <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
          
          {/* COLUMN 1: Left Category Sidebar with Black Icons (Desktop) */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
            <div className="bg-[#08542C] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center">
                  <LayoutGrid className="w-3.5 h-3.5 text-white stroke-[2]" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm tracking-wide">সকল ক্যাটাগরি</h3>
              </div>
              <span className="text-[10px] font-semibold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                মেনু
              </span>
            </div>

            <nav className="p-2 space-y-1 flex-1 flex flex-col justify-between text-xs">
              {sidebarCategories.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 transition-all duration-150 border border-transparent hover:border-zinc-200"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-zinc-100 group-hover:bg-zinc-200 flex items-center justify-center shrink-0 border border-zinc-200 transition-colors shadow-2xs">
                        <ItemIcon className="w-3.5 h-3.5 text-black stroke-[1.8]" />
                      </span>
                      <div className="truncate">
                        <span className="font-bold text-zinc-900 group-hover:text-black transition-colors block truncate text-xs">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 block truncate">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    {item.badge ? (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-1.5 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Helpline Footer in Sidebar */}
            <div className="p-2.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
              <a
                href="tel:+8801700000000"
                className="flex items-center gap-2 text-xs font-bold text-zinc-900 hover:text-black"
              >
                <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center">
                  <PhoneCall className="w-3 h-3 text-black stroke-[2]" />
                </div>
                <span>01700-000000</span>
              </a>
              <span className="text-[10px] font-medium text-zinc-500">২৪/৭ কল সাপোর্ট</span>
            </div>
          </aside>

          {/* COLUMN 2: EXPANSIVE WIDE BANNER SLIDER + PROMO STRIP (9 Columns = 75% Width!) */}
          <div className="lg:col-span-9 flex flex-col justify-between gap-3.5">
            {/* The Main Wide Hero Banner Slider */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-md min-h-[360px] sm:min-h-[420px] md:min-h-[460px] flex flex-col justify-between bg-zinc-900"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {slides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Background Banner Image with Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-zinc-950">
                    {slide.image && (
                      <Image
                        src={slide.image}
                        alt={slide.title || 'Banner'}
                        fill
                        sizes="(max-width: 1024px) 100vw, 75vw"
                        className="object-cover object-center opacity-45 mix-blend-overlay"
                        priority={idx === 0}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
                  </div>

                  {/* Banner Slide Content (Wide layout with generous spacing) */}
                  <div className="relative z-10 h-full p-6 sm:p-10 md:p-12 flex flex-col justify-between text-white max-w-2xl">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {slide.badge && (
                          <span className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-xs bg-[#DC2626]">
                            {slide.badge}
                          </span>
                        )}
                        {slide.tag && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-semibold text-white">
                            {slide.tag}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight drop-shadow-xs line-clamp-2">
                        {slide.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {slide.subtitle}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3">
                      {/* Price and Savings Pill */}
                      {slide.price && (
                        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20">
                          <div>
                            <span className="text-[10px] text-white/80 uppercase tracking-wider block font-semibold">
                              অফার মূল্য
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg sm:text-2xl font-black text-[#22C55E]">
                                {formatBDT(slide.price)}
                              </span>
                              {slide.comparePrice && (
                                <span className="text-xs text-white/60 line-through">
                                  {formatBDT(slide.comparePrice)}
                                </span>
                              )}
                            </div>
                          </div>
                          {slide.discount && (
                            <span className="badge-sale shadow-xs text-xs font-bold">
                              {slide.discount}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action CTA Buttons */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                          href={slide.slug?.startsWith('/') ? slide.slug : `/products/${slide.slug || ''}#checkout`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                          <ShoppingBag className="w-4 h-4 text-white" />
                          <span>এখনই অর্ডার করুন</span>
                        </Link>

                        <Link
                          href={slide.slug?.startsWith('/') ? slide.slug : `/products/${slide.slug || ''}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-xs sm:text-sm transition-colors"
                        >
                          <span>বিস্তারিত দেখুন</span>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Slider Arrow Navigation Controls */}
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors backdrop-blur-xs"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors backdrop-blur-xs"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              {/* Pagination Indicator Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentSlide === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 2 Promo Cards Side-by-Side Right Below the Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Promo Card 1: Cash on Delivery Guarantee */}
              <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-zinc-200 shadow-2xs flex items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-900 text-[10px] font-bold">
                    <PackageCheck className="w-3 h-3 text-black stroke-[2]" />
                    <span>ক্যাশ অন ডেলিভারি</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                    পার্সেল চেক করে টাকা পরিশোধ
                  </h4>
                  <p className="text-[11px] text-zinc-500 truncate">
                    কোনো অগ্রিম পেমেন্ট নেই, সন্তুষ্ট হয়ে টাকা দিন
                  </p>
                </div>

                <a
                  href="tel:+8801700000000"
                  className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-black text-white font-bold text-xs shrink-0 transition-colors shadow-2xs"
                >
                  <PhoneCall className="w-3 h-3 text-white" />
                  <span className="hidden sm:inline">কল অর্ডার</span>
                  <span className="sm:hidden">কল</span>
                </a>
              </div>

              {/* Promo Card 2: Free Delivery Offer */}
              <div className="bg-zinc-50 p-3.5 sm:p-4 rounded-xl border border-zinc-200 shadow-2xs flex items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-900 text-[10px] font-bold">
                    <Truck className="w-3 h-3 text-black stroke-[2]" />
                    <span>ফ্রি শিপিং</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                    যেকোনো ৩টি পণ্যে ফ্রি ডেলিভারি
                  </h4>
                  <p className="text-[11px] text-zinc-500 truncate">
                    সারা বাংলাদেশে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি
                  </p>
                </div>

                <Link
                  href="/products?featured=true"
                  className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs shrink-0 transition-colors shadow-2xs"
                >
                  <Flame className="w-3 h-3 text-white" />
                  <span>হট ডিল</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Modern Value Props Strip (Wider 1536px with Black Icons) */}
      <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 pt-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center gap-2.5 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
              <Truck className="w-3.5 h-3.5 text-black stroke-[2]" />
            </div>
            <div>
              <span className="font-bold text-xs text-zinc-900 block leading-tight">সারা দেশে ডেলিভারি</span>
              <span className="text-[10px] text-zinc-500">ঢাকা ২৪-৪৮h | বাইরে ২-৪ দিন</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-black stroke-[2]" />
            </div>
            <div>
              <span className="font-bold text-xs text-zinc-900 block leading-tight">ক্যাশ অন ডেলিভারি</span>
              <span className="text-[10px] text-zinc-500">পণ্য দেখে মূল্য পরিশোধ</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-black stroke-[2]" />
            </div>
            <div>
              <span className="font-bold text-xs text-zinc-900 block leading-tight">১০০% আসল পণ্য</span>
              <span className="text-[10px] text-zinc-500">সরাসরি প্রস্তুতকারক থেকে</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
              <RotateCcw className="w-3.5 h-3.5 text-black stroke-[2]" />
            </div>
            <div>
              <span className="font-bold text-xs text-zinc-900 block leading-tight">সহজ এক্সচেঞ্জ</span>
              <span className="text-[10px] text-zinc-500">দ্রুত ও নির্ভরযোগ্য সাপোর্ট</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
