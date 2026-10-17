// app/about/page.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  ShieldCheck,
  Truck,
  Heart,
  PackageCheck,
  CheckCircle2,
  Users,
  Building,
  PhoneCall,
  ShoppingBag,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export const metadata = {
  title: 'আমাদের সম্পর্কে (About Us)',
  description: 'বিচিত্র শপ – বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম। প্রিমিয়াম কোটি, ঐতিহ্যবাহী পাঞ্জাবি, আধুনিক বোরকা ও আবায়া, স্মার্ট গ্যাজেটস এবং খাঁটি খাদ্যপণ্য।',
  alternates: {
    canonical: 'https://bichitrashop.vercel.app/about'
  }
};

async function getCategories() {
  try {
    await initDatabase();
    const categoriesColl = await getCollection('categories');
    const categories = await categoriesColl.find({ status: 'active' }).toArray();
    return JSON.parse(JSON.stringify(categories));
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
      <Header categories={categories} />

      <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-zinc-200 shadow-xs space-y-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-900">
            <Sparkles className="w-4 h-4 text-black stroke-[2]" />
            <span>আমাদের পরিচিতি ও অঙ্গীকার</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 leading-tight">
            বিচিত্র শপ (Bichitra Shop) – বিশ্বস্ত পণ্য ও স্মার্ট কেনাকাটা
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            বিচিত্র শপ বাংলাদেশের একটি নির্ভরযোগ্য অনলাইন শপিং প্রতিষ্ঠান। আমাদের মূল লক্ষ্য গ্রাহকের হাতে প্রিমিয়াম কোয়ালিটির পণ্য সাশ্রয়ী মূল্যে এবং শতভাগ নিরাপদ ক্যাশ অন ডেলিভারি সুবিধায় পৌঁছে দেওয়া।
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left">
            <div className="p-3.5 rounded-2xl bg-[#F6FAF7] border border-zinc-200">
              <span className="text-xl sm:text-2xl font-black text-zinc-900 block">১০০%</span>
              <span className="text-xs text-zinc-600 font-semibold">আসল পণ্যের নিশ্চয়তা</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F6FAF7] border border-zinc-200">
              <span className="text-xl sm:text-2xl font-black text-zinc-900 block">০ অগ্রিম</span>
              <span className="text-xs text-zinc-600 font-semibold">ক্যাশ অন ডেলিভারি</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F6FAF7] border border-zinc-200">
              <span className="text-xl sm:text-2xl font-black text-zinc-900 block">২৪-৪৮h</span>
              <span className="text-xs text-zinc-600 font-semibold">ঢাকা সিটিতে ডেলিভারি</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F6FAF7] border border-zinc-200">
              <span className="text-xl sm:text-2xl font-black text-zinc-900 block">৭ দিন</span>
              <span className="text-xs text-zinc-600 font-semibold">সহজ এক্সচেঞ্জ পলিসি</span>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-black stroke-[2]" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">আমাদের লক্ষ্য (Our Mission)</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              অনলাইন শপিংয়ে মানুষের আস্থা ফিরিয়ে আনা। কোনো প্রতারণা বা ভুয়া ছবির আশ্রয় না নিয়ে সত্যিকারের মানসম্মত পণ্য গ্রাহকের হাতে তুলে দেওয়া।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center">
              <PackageCheck className="w-5 h-5 text-black stroke-[2]" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">পার্সেল দেখে নেওয়ার অধিকার</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              ডেলিভারিম্যানের সামনে পার্সেল খুলে কোয়ালিটি ও সাইজ মিলিয়ে দেখে টাকা পরিশোধের পূর্ণ স্বাধীনতা প্রদান করি আমরা।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-black stroke-[2]" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">সরাসরি কল ও সহায়তা</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              যেকোনো জিজ্ঞাসা, অর্ডার কনফার্মেশন বা পণ্য সংক্রান্ত তথ্যের জন্য সকাল ৯টা থেকে রাত ১০টা পর্যন্ত আমাদের হটলাইন টিম সক্রিয় থাকে।
            </p>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="bg-[#08542C] text-white rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-black">আমাদের পণ্যের ক্যাটালগ ব্রাউজ করুন</h2>
            <p className="text-xs sm:text-sm text-white/80">
              সেরা ডিসকাউন্টে আপনার পছন্দের পণ্যটি আজই অর্ডার করুন।
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#08542C] font-bold text-xs sm:text-sm shadow-md hover:bg-zinc-100 transition-colors"
          >
            <span>পণ্যসমূহ দেখুন</span>
            <ArrowRight className="w-4 h-4 text-[#08542C]" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
