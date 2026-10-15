// app/not-found.jsx
import React from 'react';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '৪০৪ - পৃষ্ঠাটি পাওয়া যায়নি | Bichitra Shop',
  robots: {
    index: false,
    follow: false
  }
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
      <Header />

      <main className="max-w-md mx-auto my-auto p-8 text-center space-y-5 bg-white rounded-3xl border border-[#E2ECE3] shadow-sm my-16">
        <div className="text-6xl font-black text-[#08542C]">
          ৪০৪
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2417]">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-xs text-[#4B6354] leading-relaxed">
          আপনি যে লিংকটি অনুসন্ধান করছেন তা পরিবর্তিত হতে পারে অথবা মুছে ফেলা হয়েছে। আমাদের হোমপেজে ফিরে গিয়ে কেনাকাটা চালিয়ে যান।
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#08542C] text-white text-xs font-bold shadow-sm hover:bg-[#064423] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#F6FAF7] border border-[#E2ECE3] text-[#0F2417] text-xs font-bold hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-[#DC2626]" />
            <span>সকল পণ্য দেখুন</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
