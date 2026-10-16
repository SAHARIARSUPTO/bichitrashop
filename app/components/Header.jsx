// app/components/Header.jsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, PhoneCall, Menu, X, ShieldCheck, ChevronRight, Flame } from 'lucide-react';

export default function Header({ categories = [], announcement = 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে! ৩টি বা ততোধিক পণ্যে ফ্রি ডেলিভারি।' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2ECE3] shadow-xs">
      {/* Top Announcement Bar (Hidden on Mobile for Fast App-like Feel) */}
      <div className="hidden md:block bg-[#08542C] text-white text-xs md:text-sm py-2 px-4 transition-colors">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <p className="font-medium tracking-wide flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
            <span>{announcement.replace(/[🎉✨🔥🚚]/g, '').trim()}</span>
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="tel:+8801761674164"
              className="flex items-center gap-1.5 hover:text-white/80 transition-colors py-0.5 px-2.5 rounded-full bg-white/10"
            >
              <PhoneCall className="w-3.5 h-3.5 text-white" />
              <span>হটলাইন: 01761-674164</span>
            </a>
            <Link href="/admin" className="text-white/80 hover:text-white underline text-[11px] hidden md:inline">
              অ্যাডমিন পোর্টাল
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 sm:h-16 md:h-20 gap-2 sm:gap-4">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#08542C]/20 p-0.5 bg-white shadow-2xs group-hover:scale-105 transition-transform">
              <Image
                src="/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png"
                alt="Bichitra Shop - বিচিত্র শপ লোগো"
                fill
                sizes="(max-width: 640px) 36px, (max-width: 768px) 44px, 64px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="font-black text-base sm:text-xl md:text-2xl text-[#DC2626] tracking-tight">Bichitra</span>
                <span className="font-black text-base sm:text-xl md:text-2xl text-[#08542C] tracking-tight">Shop</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#08542C] tracking-wide -mt-0.5 hidden sm:block">
                বিশ্বস্ত পণ্য | স্মার্ট কেনাকাটা
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="পণ্য বা ক্যাটাগরি সার্চ করুন (যেমন: কোটি সেট, পাঞ্জাবি, মধু)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-11 py-2 rounded-full border border-[#E2ECE3] focus:border-[#08542C] focus:ring-2 focus:ring-[#08542C]/20 outline-none text-sm bg-[#F6FAF7] transition-all text-[#0F2417] placeholder:text-[#4B6354]/60"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-full bg-[#08542C] text-white hover:bg-[#064423] transition-colors flex items-center justify-center cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Navigation Links and Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/products"
              className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-[#0F2417] hover:text-[#08542C] transition-colors px-3 py-2 rounded-lg hover:bg-[#E8F5EC]"
            >
              <ShoppingBag className="w-4 h-4 text-black stroke-[2]" />
              <span>সকল পণ্য</span>
            </Link>

            <Link
              href="/products?featured=true"
              className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F2417] hover:text-[#08542C] transition-colors px-3 py-2 rounded-lg hover:bg-[#E8F5EC]"
            >
              <Flame className="w-4 h-4 text-black stroke-[2]" />
              <span>হট ডিল</span>
            </Link>

            {/* Quick Order Now Button */}
            <Link
              href="/products"
              className="flex items-center gap-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span className="hidden sm:inline">অর্ডার করুন</span>
              <span className="sm:hidden">শপ</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-1.5 text-[#0F2417] hover:text-[#08542C] rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Compact Search Bar */}
        <div className="md:hidden pb-2 pt-0.5">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="পণ্য বা ক্যাটাগরি সার্চ করুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3.5 pr-9 py-1.5 rounded-full border border-[#E2ECE3] focus:border-[#08542C] outline-none text-xs bg-[#F6FAF7] text-[#0F2417] placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-2.5 rounded-full bg-[#08542C] text-white flex items-center justify-center cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Categories Bar (Desktop) */}
      <nav aria-label="Product categories" className="hidden md:block bg-[#F6FAF7] border-t border-[#E2ECE3]/80">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto py-2.5 text-xs sm:text-sm font-semibold text-[#4B6354] scrollbar-none">
            <Link
              href="/products"
              className="text-[#08542C] hover:text-[#064423] font-bold shrink-0 flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-black stroke-[2]" />
              <span>সব কালেকশন</span>
            </Link>
            <Link href="/products?category=mens-fashion" className="hover:text-[#08542C] shrink-0">
              মেনস ফ্যাশন
            </Link>
            <Link href="/products?category=womens-fashion" className="hover:text-[#08542C] shrink-0">
              উইমেনস ফ্যাশন
            </Link>
            <Link href="/products?category=home-living" className="hover:text-[#08542C] shrink-0">
              হোম ও লিভিং
            </Link>
            <Link href="/products?category=organic-food" className="hover:text-[#08542C] shrink-0">
              অর্গানিক ফুড ও মধু
            </Link>
            <div className="ml-auto text-xs font-semibold text-zinc-900 flex items-center gap-1.5 shrink-0">
              <ShieldCheck className="w-4 h-4 text-black stroke-[2]" />
              <span>১০০% ক্যাশ অন ডেলিভারি</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E2ECE3] px-4 pt-4 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="text-xs font-bold text-[#4B6354] uppercase tracking-wider mb-2">
            ক্যাটাগরি সমূহ
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#E8F5EC] text-[#08542C] font-bold text-xs"
            >
              <span>সব পণ্য</span>
              <ChevronRight className="w-3.5 h-3.5 text-black" />
            </Link>
            <Link
              href="/products?featured=true"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#FEF2F2] text-[#DC2626] font-bold text-xs"
            >
              <span>হট ডিল অফার</span>
              <ChevronRight className="w-3.5 h-3.5 text-black" />
            </Link>
            <Link
              href="/products?category=mens-fashion"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg border border-[#E2ECE3] text-xs font-medium text-[#0F2417] hover:bg-[#F6FAF7]"
            >
              মেনস ফ্যাশন
            </Link>
            <Link
              href="/products?category=womens-fashion"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg border border-[#E2ECE3] text-xs font-medium text-[#0F2417] hover:bg-[#F6FAF7]"
            >
              উইমেনস ফ্যাশন
            </Link>
            <Link
              href="/products?category=home-living"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg border border-[#E2ECE3] text-xs font-medium text-[#0F2417] hover:bg-[#F6FAF7]"
            >
              হোম ও লিভিং
            </Link>
            <Link
              href="/products?category=organic-food"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg border border-[#E2ECE3] text-xs font-medium text-[#0F2417] hover:bg-[#F6FAF7]"
            >
              অর্গানিক ফুড
            </Link>
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <a
              href="tel:+8801761674164"
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#08542C] text-white font-bold text-xs"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>কল করুন: 01761-674164</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs text-gray-500 hover:text-gray-900 py-1"
            >
              অ্যাডমিন লগইন
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
