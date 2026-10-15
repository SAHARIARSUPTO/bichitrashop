// app/components/Footer.jsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#04321A] text-white border-t border-[#08542C] mt-auto">
      {/* Trust Guarantee Band */}
      <div className="border-b border-white/10 bg-[#074326]/60 py-7 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">সারা দেশে ডেলিভারি</h4>
              <p className="text-xs text-white/70">ঢাকা ও ঢাকার বাইরে দ্রুততম ডেলিভারি</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-white/70">পণ্য হাতে পেয়ে চেক করে পেমেন্ট করুন</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">সহজ এক্সচেঞ্জ পলিসি</h4>
              <p className="text-xs text-white/70">যেকোনো ত্রুটিতে রয়েছে দ্রুত সমাধান</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">সার্বক্ষণিক সহায়তা</h4>
              <p className="text-xs text-white/70">সরাসরি ফোন বা হেল্পলাইনে সাপোর্ট</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 shrink-0">
                <Image
                  src="/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png"
                  alt="Bichitra Shop"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-black text-xl text-[#DC2626]">Bichitra </span>
                <span className="font-black text-xl text-white">Shop</span>
                <p className="text-[11px] text-[#22C55E] font-medium">বিশ্বস্ত পণ্য | স্মার্ট কেনাকাটা</p>
              </div>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              বিচিত্র শপ – আপনার নিত্যপ্রয়োজনীয় রুচিশীল পোশাক, প্রিমিয়াম কোটি সেট, স্বাস্থ্যকর অর্গানিক ফুড ও আধুনিক লাইফস্টাইল সমাধানের নির্ভরযোগ্য অনলাইন শপ।
            </p>
            <div className="text-xs text-[#22C55E] font-semibold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#DC2626] fill-[#DC2626]" />
              <span>আপনার বিশ্বস্ততাই আমাদের অনুপ্রেরণা</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              জনপ্রিয় ক্যাটাগরি
            </h3>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/products?category=mens-fashion" className="hover:text-[#22C55E] transition-colors">
                  মেনস কোটি ও পাঞ্জাবি কালেকশন
                </Link>
              </li>
              <li>
                <Link href="/products?category=womens-fashion" className="hover:text-[#22C55E] transition-colors">
                  উইমেনস বোরকা ও পার্টি আবায়া
                </Link>
              </li>
              <li>
                <Link href="/products?category=gadgets" className="hover:text-[#22C55E] transition-colors">
                  স্মার্ট গ্যাজেটস ও ব্লুটুথ ইয়ারবাডস
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-appliances" className="hover:text-[#22C55E] transition-colors">
                  হোম ও কিচেন অ্যাপ্লায়েন্স
                </Link>
              </li>
              <li>
                <Link href="/products?category=organic-food" className="hover:text-[#22C55E] transition-colors">
                  খাঁটি মধু ও কাঠের ঘানির সরিষার তেল
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-[#22C55E] transition-colors font-semibold text-[#DC2626]">
                  হট ডিল অফার
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies for Google Crawler & Customers */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              গ্রাহক সেবা ও পলিসি
            </h3>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/about" className="hover:text-[#22C55E] transition-colors">
                  আমাদের সম্পর্কে (About Us)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#22C55E] transition-colors">
                  যোগাযোগ ও কাস্টমার কেয়ার
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#22C55E] transition-colors">
                  শিপিং ও ডেলিভারি পলিসি
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-[#22C55E] transition-colors">
                  রিটার্ন ও এক্সচেঞ্জ পলিসি
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#22C55E] transition-colors">
                  প্রাইভেসি পলিসি (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#22C55E] transition-colors">
                  ব্যবহারের শর্তাবলী (Terms)
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#22C55E] transition-colors">
                  সাধারণ জিজ্ঞাসা (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              যোগাযোগ ও হেল্পলাইন
            </h3>
            <ul className="space-y-3 text-xs text-white/80">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+8801700000000" className="font-bold text-white hover:text-[#22C55E] block text-sm">
                    +880 1700-000000
                  </a>
                  <span className="text-[11px] text-white/60">সকাল ৯টা – রাত ১০টা (প্রতিদিন)</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <a href="mailto:support@bichitrashop.com" className="hover:text-[#22C55E]">
                  support@bichitrashop.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>মিরপুর, ঢাকা-১২১৬, বাংলাদেশ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-black/30 py-4 px-4 text-center text-xs text-white/60">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Bichitra Shop (বিচিত্র শপ). সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-[11px] text-white/50">
            নিরাপদ ক্যাশ অন ডেলিভারি ও দ্রুততম হোম ডেলিভারি সার্ভিস।
          </p>
        </div>
      </div>
    </footer>
  );
}
