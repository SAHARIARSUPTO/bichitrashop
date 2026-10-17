// app/components/Footer.jsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';
import FacebookIcon from './FacebookIcon';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-zinc-800 mt-auto">
      {/* Trust Guarantee Band */}
      <div className="border-b border-zinc-800 bg-zinc-950 py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">সারা দেশে ডেলিভারি</h4>
              <p className="text-xs text-zinc-400">ঢাকা ও ঢাকার বাইরে দ্রুততম ডেলিভারি</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-zinc-400">পণ্য হাতে পেয়ে চেক করে পেমেন্ট করুন</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">সহজ এক্সচেঞ্জ পলিসি</h4>
              <p className="text-xs text-zinc-400">যেকোনো ত্রুটিতে রয়েছে দ্রুত সমাধান</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">সার্বক্ষণিক সহায়তা</h4>
              <p className="text-xs text-zinc-400">সরাসরি ফোন বা হেল্পলাইনে সাপোর্ট</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
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
                <p className="text-xs text-[#22C55E] font-medium">বিশ্বস্ত পণ্য | স্মার্ট কেনাকাটা</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              বিচিত্র শপ – আপনার নিত্যপ্রয়োজনীয় রুচিশীল পোশাক, প্রিমিয়াম কোটি সেট, স্বাস্থ্যকর অর্গানিক ফুড ও আধুনিক লাইফস্টাইল সমাধানের নির্ভরযোগ্য অনলাইন শপ।
            </p>
            <div className="text-xs text-[#22C55E] font-semibold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#DC2626] fill-[#DC2626]" />
              <span>আপনার বিশ্বস্ততাই আমাদের অনুপ্রেরণা</span>
            </div>
            <div className="pt-1">
              <a
                href="https://www.facebook.com/bichitra.shop44"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-[#1877F2]/15 border border-zinc-800 hover:border-[#1877F2]/40 text-white text-xs font-semibold transition-all group"
                title="বিচিত্র শপ অফিসিয়াল ফেসবুক পেজ"
              >
                <div className="w-6 h-6 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FacebookIcon className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300">অফিসিয়াল ফেসবুক পেজ</span>
                  <span className="text-white text-xs font-bold group-hover:text-[#1877F2] transition-colors">facebook.com/bichitra.shop44</span>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">
              জনপ্রিয় ক্যাটাগরি
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/products?category=mens-fashion" className="hover:text-white transition-colors">
                  মেনস কোটি ও পাঞ্জাবি কালেকশন
                </Link>
              </li>
              <li>
                <Link href="/products?category=womens-fashion" className="hover:text-white transition-colors">
                  উইমেনস বোরকা ও পার্টি আবায়া
                </Link>
              </li>
              <li>
                <Link href="/products?category=gadgets" className="hover:text-white transition-colors">
                  স্মার্ট গ্যাজেটস ও ব্লুটুথ ইয়ারবাডস
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-appliances" className="hover:text-white transition-colors">
                  হোম ও কিচেন অ্যাপ্লায়েন্স
                </Link>
              </li>
              <li>
                <Link href="/products?category=organic-food" className="hover:text-white transition-colors">
                  খাঁটি মধু ও কাঠের ঘানির সরিষার তেল
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-white transition-colors font-bold text-[#DC2626]">
                  হট ডিল অফার
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies for Google Crawler & Customers */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">
              গ্রাহক সেবা ও পলিসি
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  আমাদের সম্পর্কে (About Us)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  যোগাযোগ ও কাস্টমার কেয়ার
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  শিপিং ও ডেলিভারি পলিসি
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-white transition-colors">
                  রিটার্ন ও এক্সচেঞ্জ পলিসি
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  প্রাইভেসি পলিসি (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  ব্যবহারের শর্তাবলী (Terms)
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  সাধারণ জিজ্ঞাসা (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">
              যোগাযোগ ও হেল্পলাইন
            </h3>
            <ul className="space-y-3 text-xs text-zinc-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+8801761674164" className="font-bold text-white hover:text-[#22C55E] block text-sm">
                    01761-674164
                  </a>
                  <span className="text-xs text-zinc-500">সকাল ৯টা – রাত ১০টা (প্রতিদিন)</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <a href="mailto:support@bichitrashop.com" className="hover:text-white transition-colors">
                  support@bichitrashop.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <FacebookIcon className="w-2.5 h-2.5 fill-current" />
                </div>
                <a
                  href="https://www.facebook.com/bichitra.shop44"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1877F2] transition-colors"
                >
                  facebook.com/bichitra.shop44
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>রহনপুর, চাঁপাইনবাবগঞ্জ, বাংলাদেশ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-zinc-800 bg-black py-4 px-4 text-center text-xs text-zinc-500">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Bichitra Shop (বিচিত্র শপ). সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/bichitra.shop44"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-[#1877F2] transition-colors font-medium text-xs"
            >
              <FacebookIcon className="w-3.5 h-3.5 fill-current" />
              <span>Facebook Page</span>
            </a>
            <span className="text-zinc-700">|</span>
            <p className="text-xs text-zinc-500">
              নিরাপদ ক্যাশ অন ডেলিভারি সার্ভিস
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
