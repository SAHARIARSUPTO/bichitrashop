// app/return-policy/page.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  HelpCircle,
  PhoneCall,
  Clock
} from 'lucide-react';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export const metadata = {
  title: 'রিটার্ন ও রিফান্ড পলিসি (Return & Refund Policy)',
  description: 'বিচিত্র শপ সহজ রিটার্ন ও এক্সচেঞ্জ পলিসি। ডেলিভারির সময় পার্সেল দেখে নেওয়ার সুযোগ এবং ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি। কোনো সমস্যা হলে তাৎক্ষণিক রিফান্ড সুবিধা।',
  alternates: {
    canonical: 'https://bichitrashop.com/return-policy'
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

export default async function ReturnPolicyPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
      <Header categories={categories} />

      <main className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-900">
            <RotateCcw className="w-4 h-4 text-black stroke-[2]" />
            <span>গ্রাহক সুরক্ষায় সহজ এক্সচেঞ্জ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900">
            রিটার্ন ও রিফান্ড পলিসি
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            গ্রাহকের সর্বোচ্চ সন্তুষ্টি নিশ্চিত করতে বিচিত্র শপের ৭ দিনের রিটার্ন ও এক্সচেঞ্জ নিয়মাবলী
          </p>
        </div>

        {/* 3 Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-2xs space-y-2">
            <span className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 text-black font-bold text-xs flex items-center justify-center">
              ১
            </span>
            <h3 className="font-bold text-sm text-zinc-900">হাতে পাওয়ার সাথে সাথে চেক</h3>
            <p className="text-xs text-zinc-600">
              ডেলিভারিম্যানের সামনে পণ্য চেক করুন। পছন্দ না হলে কোনো চার্জ ছাড়াই ফেরত দিন।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-2xs space-y-2">
            <span className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 text-black font-bold text-xs flex items-center justify-center">
              ২
            </span>
            <h3 className="font-bold text-sm text-zinc-900">৭ দিনের সাইজ বা মডেল এক্সচেঞ্জ</h3>
            <p className="text-xs text-zinc-600">
              পোশাকের সাইজ বা গ্যাজেটের কোনো ত্রুটি থাকলে ৭ দিনের মধ্যে দ্রুত এক্সচেঞ্জ সুবিধা পাবেন।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-2xs space-y-2">
            <span className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 text-black font-bold text-xs flex items-center justify-center">
              ৩
            </span>
            <h3 className="font-bold text-sm text-zinc-900">দ্রুত রিফান্ড নিশ্চয়তা</h3>
            <p className="text-xs text-zinc-600">
              রিটার্ন পণ্য রিসিভ হওয়ার ২৪ থেকে ৪৮ ঘণ্টার মধ্যে বিকাশ/নগদে টাকা রিফান্ড করা হয়।
            </p>
          </div>
        </div>

        {/* Policy Details Article */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-xs space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>১. রিটার্ন করার শর্তাবলী (Eligibility)</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
              <li>পণ্যটি অব্যবহৃত, অক্ষত এবং মূল প্যাকেজিং/ট্যাগসহ থাকতে হবে।</li>
              <li>পণ্য হাতে পাওয়ার পর সর্বোচ্চ ৭ দিনের মধ্যে আমাদের হেল্পলাইনে যোগাযোগ করতে হবে।</li>
              <li>ভুল পণ্য, কালার বা সাইজের সমস্যা থাকলে কোনো অতিরিক্ত ডেলিভারি ফি ছাড়াই পরিবর্তন করা হবে।</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-zinc-100 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>২. কীভাবে রিটার্ন বা এক্সচেঞ্জ রিকোয়েস্ট করবেন?</span>
            </h2>
            <p>
              রিটার্ন বা পরিবর্তনের জন্য আমাদের হটলাইন নম্বর <a href="tel:+8801761674164" className="font-bold text-black underline">01761-674164</a>-এ কল করুন অথবা ইনবক্স/ইমেইলে আপনার অর্ডারের রেফারেন্স নম্বর জানিয়ে অনুরোধ করুন। আমাদের কুরিয়ার টিম আপনার বাসা থেকে পণ্যটি পিকআপ করবে।
            </p>
          </section>

          <section className="space-y-3 border-t border-zinc-100 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>৩. রিফান্ড প্রক্রিয়া ও সময়সীমা</span>
            </h2>
            <p>
              যদি কোনো কারণে পণ্য এক্সচেঞ্জ করা সম্ভব না হয় বা গ্রাহক রিফান্ড চান, তবে রিটার্নকৃত পণ্য আমাদের ওয়্যারহাউজে পৌঁছানোর পর যাচাই করে ২৪-৪৮ ঘণ্টার মধ্যে গ্রাহকের বিকাশ, নগদ বা ব্যাংক একাউন্টে রিফান্ড ট্রান্সফার করা হবে।
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
