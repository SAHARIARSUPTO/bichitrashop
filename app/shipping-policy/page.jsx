// app/shipping-policy/page.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Truck,
  ShieldCheck,
  Clock,
  PackageCheck,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export const metadata = {
  title: 'শিপিং ও ডেলিভারি পলিসি (Shipping & Delivery Policy)',
  description: 'বিচিত্র শপ ডেলিভারি নিয়মাবলী। ঢাকা সিটির ভেতরে ডেলিভারি চার্জ ৳৭০ (২৪-৪৮ ঘণ্টা) এবং বাইরে ৳১৩০ (২-৪ দিন)। ক্যাশ অন ডেলিভারিতে চেক করে টাকা পরিশোধের সুযোগ।',
  alternates: {
    canonical: 'https://bichitrashop.com/shipping-policy'
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

export default async function ShippingPolicyPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
      <Header categories={categories} />

      <main className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-900">
            <Truck className="w-4 h-4 text-black stroke-[2]" />
            <span>সারা দেশে ক্যাশ অন ডেলিভারি</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900">
            শিপিং ও ডেলিভারি পলিসি
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            বিচিত্র শপের পণ্য ডেলিভারির সময়সীমা, চার্জ ও নিয়মাবলী
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#08542C] uppercase">ঢাকা সিটির ভেতরে</span>
              <span className="text-lg font-black text-zinc-900">৳৭০</span>
            </div>
            <p className="text-xs text-zinc-600">
              অর্ডার কনফার্মেশনের ২৪ থেকে ৪৮ ঘণ্টার মধ্যে সরাসরি হোম ডেলিভারি সম্পন্ন হয়।
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#08542C] uppercase">ঢাকা সিটির বাইরে</span>
              <span className="text-lg font-black text-zinc-900">৳১৩০</span>
            </div>
            <p className="text-xs text-zinc-600">
              সারা দেশের যেকোনো জেলা ও থানা সদরে ২ থেকে ৪ কার্যদিবসের মধ্যে হোম ডেলিভারি।
            </p>
          </div>
        </div>

        {/* Detailed Policy Article */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-xs space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>১. অর্ডার নিশ্চিতকরণ ও ট্র্যাকিং</span>
            </h2>
            <p>
              ওয়েবসাইটে অর্ডার সাবমিট করার পর আমাদের কাস্টমার প্রতিনিধি আপনার মোবাইল নম্বরে ফোন করে অর্ডারটি কনফার্ম করবেন। কনফার্মেশনের পর পণ্যটি সুন্দরভাবে প্যাকেজিং করে কুরিয়ার সার্ভিসে হস্তান্তর করা হয়।
            </p>
          </section>

          <section className="space-y-3 border-t border-zinc-100 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>২. ক্যাশ অন ডেলিভারি (COD) সুবিধা</span>
            </h2>
            <p>
              বিচিত্র শপে কেনাকাটার ক্ষেত্রে আপনাকে কোনো অগ্রিম টাকা প্রদান করতে হবে না। পণ্য আপনার ঠিকানায় পৌঁছানোর পর আপনি পার্সেল হাতে পেয়ে ডেলিভারিম্যানকে নির্ধারিত মূল্য পরিশোধ করবেন।
            </p>
          </section>

          <section className="space-y-3 border-t border-zinc-100 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>৩. পার্সেল চেক করার অধিকার</span>
            </h2>
            <p>
              গ্রাহকের পূর্ণ নিরাপত্তার স্বার্থে ডেলিভারিম্যানের উপস্থিতিতে পার্সেলটি খুলে পণ্যের সঠিক কোয়ালিটি, সাইজ এবং রঙ যাচাই করে নেওয়ার সুযোগ রয়েছে। কোনো অমিল বা সমস্যা পরিলক্ষিত হলে ডেলিভারিম্যানের কাছে সঙ্গে সঙ্গেই ফেরত দেওয়া যাবে।
            </p>
          </section>

          <section className="space-y-3 border-t border-zinc-100 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>৪. ডেলিভারি বিলম্বের ক্ষেত্রে করণীয়</span>
            </h2>
            <p>
              প্রাকৃতিক দুর্যোগ, হরতাল বা সরকারি ছুটির কারণে কোনো কোনো ক্ষেত্রে ডেলিভারি কিছুটা বিলম্বিত হতে পারে। যেকোনো অনাকাঙ্ক্ষিত বিলম্বের তথ্য আমরা তাৎক্ষণিকভাবে ফোন বা এসএমএসের মাধ্যমে গ্রাহককে অবহিত করি।
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
