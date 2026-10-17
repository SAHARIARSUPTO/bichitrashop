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
  CheckCircle2,
  Tv,
  Utensils
} from 'lucide-react';
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
    { name: 'স্মার্ট গ্যাজেট', href: '/products?category=gadgets', icon: Headphones },
    { name: 'হোম অ্যাপ্লায়েন্স', href: '/products?category=home-appliances', icon: Utensils },
    { name: 'খাঁটি মধু ও তেল', href: '/products/sundarban-raw-honey-mustard-oil-bundle', icon: Leaf },
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
      name: "স্মার্ট গ্যাজেটস ও অডিও",
      href: "/products?category=gadgets",
      icon: Headphones,
      badge: "ট্রেন্ডিং",
      badgeColor: "bg-blue-600 text-white",
      desc: "ব্লুটুথ ইয়ারবাডস, স্মার্টওয়াচ"
    },
    {
      name: "হোম ও কিচেন অ্যাপ্লায়েন্স",
      href: "/products?category=home-appliances",
      icon: Utensils,
      badge: "জনপ্রিয়",
      badgeColor: "bg-emerald-700 text-white",
      desc: "ব্লেন্ডার, ইলেকট্রিক কেটলি, কুকার"
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
    <div className="bg-[#F6FAF7] pt-2 sm:pt-3 pb-3 sm:pb-6 space-y-3">
      {/* 1. Main Hero Banner Slider (Rendered FIRST on Mobile & Desktop) */}
      <div className="w-full max-w-[1536px] mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          
          {/* COLUMN 1: Left Category Sidebar with Black Icons (Desktop Only) */}
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
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#E8F5EC]/50 transition-all duration-150 border border-transparent hover:border-[#CDE5D4]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-[#E8F5EC] group-hover:bg-[#D5EEDB] flex items-center justify-center shrink-0 border border-[#CDE5D4] text-[#08542C] transition-colors shadow-2xs">
                        <ItemIcon className="w-3.5 h-3.5 text-[#08542C] stroke-[1.8]" />
                      </span>
                      <div className="truncate">
                        <span className="font-bold text-zinc-900 group-hover:text-[#08542C] transition-colors block truncate text-xs">
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
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#08542C] shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Helpline Footer in Sidebar */}
            <div className="p-2.5 bg-[#F6FAF7] border-t border-[#E2ECE3] flex items-center justify-between">
              <a
                href="tel:+8801761674164"
                className="flex items-center gap-2 text-xs font-bold text-zinc-900 hover:text-[#08542C]"
              >
                <div className="w-5 h-5 rounded-full bg-[#E8F5EC] border border-[#CDE5D4] flex items-center justify-center">
                  <PhoneCall className="w-3 h-3 text-[#08542C] stroke-[2]" />
                </div>
                <span>01761-674164</span>
              </a>
              <span className="text-[10px] font-medium text-zinc-500">২৪/৭ কল সাপোর্ট</span>
            </div>
          </aside>

          {/* COLUMN 2: EXPANSIVE WIDE BANNER SLIDER + PROMO STRIP (Full width on Mobile, 9 Columns on Desktop) */}
          <div className="lg:col-span-9 flex flex-col justify-between gap-3">
            {/* The Main Wide Hero Banner Slider */}
            <div
              className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xs aspect-[16/7] sm:aspect-[2.35/1] w-full flex flex-col justify-between bg-zinc-900"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {slides.map((slide, idx) => {
                const rawUrl = slide.link || slide.slug || '/products';
                const targetLink = rawUrl.startsWith('http')
                  ? rawUrl
                  : rawUrl.startsWith('/')
                  ? rawUrl
                  : `/${rawUrl}`;

                return (
                  <div
                    key={slide.id || idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <Link
                      href={targetLink}
                      className="block w-full h-full relative cursor-pointer group"
                      aria-label={slide.title || 'Banner'}
                    >
                      {/* Background Banner Image - 100% Crisp, Full-View & Clickable */}
                      {slide.image && (
                        <Image
                          src={slide.image}
                          alt={slide.title || 'Banner'}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1100px"
                          className="object-cover object-center group-hover:scale-[1.008] transition-transform duration-500"
                          priority={idx === 0}
                          unoptimized
                        />
                      )}
                    </Link>
                  </div>
                );
              })}

              {/* Slider Arrow Navigation Controls */}
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors backdrop-blur-xs cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors backdrop-blur-xs cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </button>

              {/* Pagination Indicator Dots */}
              <div className="absolute bottom-1.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === i ? 'w-4 sm:w-6 bg-white' : 'w-1 sm:w-1.5 bg-white/40 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 2 Promo Cards Side-by-Side Right Below the Banner (Desktop Only) */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Promo Card 1: Cash on Delivery Guarantee */}
              <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-zinc-200 shadow-2xs flex items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#E8F5EC] border border-[#CDE5D4] text-[#08542C] text-[10px] font-bold">
                    <PackageCheck className="w-3.5 h-3.5 text-[#08542C] stroke-[2]" />
                    <span>ক্যাশ অন ডেলিভারি</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                    পার্সেল চেক করে টাকা পরিশোধ
                  </h4>
                  <p className="text-xs text-zinc-500 truncate">
                    কোনো অগ্রিম পেমেন্ট নেই, সন্তুষ্ট হয়ে টাকা দিন
                  </p>
                </div>

                <a
                  href="tel:+8801761674164"
                  className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-[#08542C] hover:bg-[#064423] text-white font-bold text-xs shrink-0 transition-colors shadow-2xs"
                >
                  <PhoneCall className="w-3 h-3 text-white" />
                  <span className="hidden sm:inline">কল অর্ডার</span>
                  <span className="sm:hidden">কল</span>
                </a>
              </div>

              {/* Promo Card 2: Free Delivery Offer */}
              <div className="bg-zinc-50 p-3.5 sm:p-4 rounded-xl border border-zinc-200 shadow-2xs flex items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#E8F5EC] border border-[#CDE5D4] text-[#08542C] text-[10px] font-bold">
                    <Truck className="w-3.5 h-3.5 text-[#08542C] stroke-[2]" />
                    <span>ফ্রি শিপিং</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                    যেকোনো ৩টি পণ্যে ফ্রি ডেলিভারি
                  </h4>
                  <p className="text-xs text-zinc-500 truncate">
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

      {/* 2. MOBILE-ONLY NATIVE APP CATEGORY GRID (Shown right below hero banner on mobile) */}
      <div className="md:hidden w-full px-3">
        <div className="bg-white rounded-2xl p-3 border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-zinc-100">
            <span className="text-xs sm:text-sm font-black text-zinc-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#08542C]"></span>
              জনপ্রিয় ক্যাটাগরি
            </span>
            <Link href="/products" className="text-xs font-bold text-[#08542C] hover:underline flex items-center gap-0.5">
              <span>সব দেখুন</span>
              <ChevronRight className="w-3 h-3 text-[#08542C]" />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { name: 'কোটি সেট', href: '/products?category=mens-fashion', icon: Shirt, badge: 'হট' },
              { name: 'পাঞ্জাবি', href: '/products?category=mens-fashion', icon: Sparkles },
              { name: 'আবায়া বোরকা', href: '/products?category=womens-fashion', icon: Tag, badge: 'নতুন' },
              { name: 'গ্যাজেট', href: '/products?category=gadgets', icon: Headphones },
              { name: 'অ্যাপ্লায়েন্স', href: '/products?category=home-appliances', icon: Utensils },
              { name: 'খাঁটি মধু', href: '/products?category=organic-food', icon: Leaf },
              { name: 'হট ডিল', href: '/products?featured=true', icon: Flame, badge: 'অফার' },
              { name: 'সব পণ্য', href: '/products', icon: ShoppingBag }
            ].map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-[#E8F5EC]/50 active:scale-95 transition-all group"
                >
                  <div className="relative w-12 h-12 rounded-2xl bg-[#E8F5EC] group-hover:bg-[#D5EEDB] border border-[#CDE5D4] group-hover:border-[#08542C]/40 flex items-center justify-center transition-colors shadow-2xs">
                    <ItemIcon className="w-5 h-5 text-[#08542C] stroke-[1.8]" />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-[10px] font-black px-1.5 rounded-full shadow-2xs leading-tight">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-zinc-800 group-hover:text-[#08542C] mt-1.5 line-clamp-1 leading-tight">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. DESKTOP-ONLY Quick Category Buttons Strip */}
      <div className="hidden md:block w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {quickCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={cat.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border ${
                  cat.highlight
                    ? 'bg-white text-zinc-900 border-[#08542C]/40 hover:bg-[#E8F5EC]/40 shadow-2xs'
                    : 'bg-white text-zinc-800 border-zinc-200 hover:border-[#08542C]/40 hover:text-[#08542C] shadow-2xs'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-[#E8F5EC] flex items-center justify-center shrink-0 border border-[#CDE5D4]">
                  <Icon className="w-2.5 h-2.5 text-[#08542C] stroke-[2]" />
                </span>
                <span className="tracking-tight text-xs">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Modern Value Props Strip (Desktop Only) */}
      <div className="hidden md:block w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center gap-2.5 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5EC] border border-[#CDE5D4] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 text-[#08542C] stroke-[2]" />
            </div>
            <div>
              <span className="font-bold text-xs text-zinc-900 block leading-tight">সারা দেশে ডেলিভারি</span>
              <span className="text-[10px] text-zinc-500">ঢাকা ২৪-৪৮h | বাইরে ২-৪ দিন</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5EC] border border-[#CDE5D4] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#08542C] stroke-[2]" />
            </div>
            <div>
              <span className="font-bold text-xs text-zinc-900 block leading-tight">ক্যাশ অন ডেলিভারি</span>
              <span className="text-[10px] text-zinc-500">পণ্য দেখে মূল্য পরিশোধ</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5EC] border border-[#CDE5D4] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#08542C] stroke-[2]" />
            </div>
            <div>
              <span className="font-bold text-xs text-zinc-900 block leading-tight">১০০% আসল পণ্য</span>
              <span className="text-[10px] text-zinc-500">সরাসরি প্রস্তুতকারক থেকে</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5EC] border border-[#CDE5D4] flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4 text-[#08542C] stroke-[2]" />
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
