// app/faq/page.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { HelpCircle, ChevronRight, PhoneCall, ShieldCheck } from 'lucide-react';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export const metadata = {
  title: 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)',
  description: 'বিচিত্র শপে কেনাকাটা, ক্যাশ অন ডেলিভারি, ডেলিভারি চার্জ, পার্সেল চেক করা এবং পণ্য পরিবর্তন সংক্রান্ত সকল প্রশ্নের উত্তর।',
  alternates: {
    canonical: 'https://bichitrashop.com/faq'
  }
};

const FAQ_ITEMS = [
  {
    q: 'অর্ডার করতে কি কোনো অগ্রিম টাকা দিতে হবে?',
    a: 'না, কোনো অগ্রিম টাকা দিতে হবে না। বিচিত্র শপ ১০০% ক্যাশ অন ডেলিভারি সুবিধা প্রদান করে। পার্সেল হাতে পেয়ে ডেলিভারিম্যানকে টাকা পরিশোধ করবেন।'
  },
  {
    q: 'ডেলিভারিম্যানের সামনে কি পার্সেল খুলে দেখার সুযোগ আছে?',
    a: 'হ্যাঁ, অবশ্যই। ডেলিভারিম্যানের সামনে পার্সেল খুলে পণ্যের সাইজ, কালার ও কোয়ালিটি চেক করে দেখে নেওয়ার পূর্ণ সুযোগ রয়েছে।'
  },
  {
    q: 'ডেলিভারি চার্জ কত এবং কতদিন সময় লাগে?',
    a: 'ঢাকা সিটির ভেতরে ডেলিভারি চার্জ ৳৭০ এবং সময় লাগে ২৪ থেকে ৪৮ ঘণ্টা। ঢাকা সিটির বাইরে সারা দেশে ডেলিভারি চার্জ ৳১৩০ এবং সময় লাগে ২ থেকে ৪ কার্যদিবস। ৩টি বা তার বেশি পণ্যের অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি।'
  },
  {
    q: 'পণ্য পছন্দ না হলে বা সাইজে সমস্যা হলে কী করব?',
    a: 'যদি পণ্য পছন্দ না হয়, ডেলিভারিম্যানের সামনেই সঙ্গে সঙ্গে ফেরত দিতে পারবেন। আর যদি পরবর্তীতে সাইজ বা কালার এক্সচেঞ্জ করতে চান, তবে ৭ দিনের মধ্যে আমাদের হেল্পলাইনে (+880 1700-000000) যোগাযোগ করলেই দ্রুত পরিবর্তন করে দেওয়া হবে।'
  },
  {
    q: 'গ্যাজেট ও হোম অ্যাপ্লায়েন্সের ওয়ারেন্টি কীভাবে পাব?',
    a: 'প্রতিটি গ্যাজেট ও হোম অ্যাপ্লায়েন্স পণ্যের সাথে ক্যাশ মেমো ও ওয়ারেন্টি নিশ্চয়তা থাকে। ওয়ারেন্টি মেয়াদের মধ্যে কোনো টেকনিক্যাল সমস্যা হলে আমাদের হটলাইনে কল করলেই ফ্রিতে সার্ভিসিং বা রিপ্লেসমেন্ট প্রদান করা হবে।'
  },
  {
    q: 'সরাসরি ফোনে কথা বলে অর্ডার করা যাবে কি?',
    a: 'হ্যাঁ, সকাল ৯টা থেকে রাত ১০টা পর্যন্ত যেকোনো সময় আমাদের কাস্টমার কেয়ার হটলাইন নম্বর 01700-000000-এ কল করে সরাসরি আপনার কাঙ্ক্ষিত পণ্যটি অর্ডার করতে পারবেন।'
  }
];

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

export default async function FAQPage() {
  const categories = await getCategories();

  // JSON-LD Schema for Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header categories={categories} />

      <main className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-900">
            <HelpCircle className="w-4 h-4 text-black stroke-[2]" />
            <span>সাহায্য ও প্রশ্নোত্তর</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900">
            সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            বিচিত্র শপে কেনাকাটা, ডেলিভারি ও সার্ভিস সংক্রান্ত প্রয়োজনীয় সকল তথ্যের উত্তর
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-2xs space-y-2 hover:border-zinc-300 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 text-black text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 pl-8 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        {/* Assistance Box */}
        <div className="p-6 rounded-3xl bg-zinc-100 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-sm text-zinc-900">আপনার প্রশ্নের উত্তর খুঁজে পাননি?</h4>
            <p className="text-xs text-zinc-600 mt-0.5">
              আমাদের সাপোর্ট টিম সপ্তাহে ৭ দিনই আপনার সেবায় প্রস্তুত আছে।
            </p>
          </div>
          <a
            href="tel:+8801700000000"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold shrink-0 shadow-xs"
          >
            <PhoneCall className="w-4 h-4 text-white" />
            <span>কল করুন: 01700-000000</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
