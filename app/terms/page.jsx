// app/terms/page.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, CheckCircle2 } from 'lucide-react';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export const metadata = {
  title: 'ব্যবহারের শর্তাবলী (Terms & Conditions)',
  description: 'বিচিত্র শপ ওয়েবসাইট ব্যবহারের নিয়মাবলী, অর্ডার প্রক্রিয়া এবং পেমেন্ট সংক্রান্ত শর্তাবলী। বিস্তারিত তথ্য জানুন।',
  alternates: {
    canonical: 'https://bichitrashop.vercel.app/terms'
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

export default async function TermsPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
      <Header categories={categories} />

      <main className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-900">
            <FileText className="w-4 h-4 text-black stroke-[2]" />
            <span>নিয়মাবলী ও চুক্তি</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900">
            ব্যবহারের শর্তাবলী (Terms of Service)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            বিচিত্র শপের মাধ্যমে কেনাকাটা করার ক্ষেত্রে প্রযোজ্য নিয়মাবলী
          </p>
        </div>

        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-xs space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>১. সাধারণ নিয়মাবলী</span>
            </h2>
            <p>
              বিচিত্র শপ ওয়েবসাইট ব্যবহারের মাধ্যমে আপনি আমাদের সকল শর্তাবলী মেনে নিতে সম্মত হচ্ছেন। বিচিত্র শপ কর্তৃপক্ষ যেকোনো সময়ে কোনো পূর্ব বিজ্ঞপ্তি ছাড়াই শর্তাবলীতে পরিবর্তন বা পরিবর্ধন করার অধিকার সংরক্ষণ করে।
            </p>
          </section>

          <section className="space-y-3 border-t border-zinc-100 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>২. অর্ডার গ্রহণ ও বাতিলকরণ</span>
            </h2>
            <p>
              ওয়েবসাইটে অর্ডার করার পর আমাদের কাস্টমার কেয়ার টিম ফোনের মাধ্যমে যাচাই করে অর্ডার চূড়ান্ত করেন। কোনো গ্রাহক যদি একাধিকবার মিথ্যা তথ্য দিয়ে বা ফেক অর্ডার করেন, তবে কর্তৃপক্ষ সংশ্লিষ্ট অর্ডার বাতিল ও ফোন নম্বর সাময়িকভাবে ব্লক করার ক্ষমতা রাখে।
            </p>
          </section>

          <section className="space-y-3 border-t border-zinc-100 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>৩. মূল্য নির্ধারণ ও স্টক প্রাপ্যতা</span>
            </h2>
            <p>
              ওয়েবসাইটে প্রদর্শিত সকল পণ্যের মূল্য টাকায় (BDT) উল্লিখিত। স্টকের প্রাপ্যতার ওপর ভিত্তি করে অর্ডার কার্যকর হয়। বিশেষ কারণে কোনো পণ্য অপ্রত্যাশিতভাবে আউট-অব-স্টক হয়ে গেলে গ্রাহককে ফোন করে তাৎক্ষণিক অবহিত করা হবে।
            </p>
          </section>

          <section className="space-y-3 border-t border-zinc-100 pt-5">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              <span>৪. মেধাস্বত্ব ও কপিরাইট</span>
            </h2>
            <p>
              বিচিত্র শপ ব্র্যান্ড লোগো, পণ্যের ছবি, বিবরণ ও কনটেন্টের সকল মেধাস্বত্ব বিচিত্র শপ কর্তৃপক্ষের নিজস্ব সম্পত্তি। অনুমতি ছাড়া এই কনটেন্ট বাণিজ্যিক উদ্দেশ্যে নকল বা পুনঃপ্রকাশ আইনত দণ্ডনীয়।
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
