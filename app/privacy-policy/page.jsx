// app/privacy-policy/page.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export const metadata = {
  title: 'প্রাইভেসি পলিসি (Privacy Policy)',
  description: 'বিচিত্র শপ গ্রাহকদের ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা প্রদান করে। আমরা কোনো তথ্য তৃতীয় পক্ষের কাছে শেয়ার করি না। বিস্তারিত গোপনীয়তা নীতি পড়ুন।',
  alternates: {
    canonical: 'https://bichitrashop.com/privacy-policy'
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

export default async function PrivacyPolicyPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
      <Header categories={categories} />

      <main className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-900">
            <Lock className="w-4 h-4 text-black stroke-[2]" />
            <span>ডেটা নিরাপত্তা ও সুরক্ষা</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900">
            প্রাইভেসি ও ডেটা পলিসি
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            গ্রাহকের তথ্যের গোপনীয়তা ও সুরক্ষা রক্ষা করা আমাদের সর্বোচ্চ অগ্রাধিকার
          </p>
        </div>

        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-xs space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>১. আমরা কী কী তথ্য সংগ্রহ করি?</span>
            </h2>
            <p>
              অর্ডার সফলভাবে সম্পন্ন ও ডেলিভারির সুবিধার্থে আমরা শুধুমাত্র প্রয়োজনীয় মৌলিক তথ্য সংগ্রহ করে থাকি:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-600">
              <li>গ্রাহকের নাম (Customer Name)</li>
              <li>মোবাইল নম্বর (ডেলিভারি কনফার্মেশন ও কুরিয়ার যোগাযোগের জন্য)</li>
              <li>ডেলিভারির সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা/জেলা)</li>
              <li>ঐচ্ছিক ইমেইল এড্রেস (ইনভয়েস বা আপডেটের জন্য)</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-zinc-100 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>২. তথ্যের ব্যবহার কীভাবে করা হয়?</span>
            </h2>
            <p>
              সংগৃহীত তথ্য শুধুমাত্র আপনার অর্ডারের পণ্য নির্দিষ্ট ঠিকানায় পৌঁছে দেওয়া, কাস্টমার সার্ভিস সহায়তা প্রদান এবং বিশেষ অফার বা ডিসকাউন্ট আপডেট জানানোর জন্য ব্যবহৃত হয়। আমরা গ্রাহকের কোনো তথ্য কোনো বাণিজ্যিক বা তৃতীয় পক্ষের কাছে বিক্রয় বা হস্তান্তর করি না।
            </p>
          </section>

          <section className="space-y-3 border-t border-zinc-100 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>৩. ডেটা নিরাপত্তা ও সুরক্ষা</span>
            </h2>
            <p>
              বিচিত্র শপ আধুনিক এসএসএল (SSL 256-bit Encryption) এনক্রিপশন প্রযুক্তির মাধ্যমে গ্রাহকের সব ডেটা সুরক্ষিত রাখে। আমাদের ডাটাবেজে সংরক্ষিত সব রেকর্ড সুরক্ষিত ফায়ারওয়ালের অধীনে সংরক্ষিত থাকে।
            </p>
          </section>

          <section className="space-y-3 border-t border-zinc-100 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>৪. যেকোনো প্রয়োজনে যোগাযোগ</span>
            </h2>
            <p>
              আপনার ব্যক্তিগত তথ্য পরিবর্তন বা মুছে ফেলার জন্য যেকোনো সময় আমাদের ইমেইল <a href="mailto:support@bichitrashop.com" className="font-bold text-black underline">support@bichitrashop.com</a> বা হটলাইন <a href="tel:+8801761674164" className="font-bold text-black underline">01761-674164</a>-এ যোগাযোগ করতে পারেন।
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
