// app/contact/page.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ShieldCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export const metadata = {
  title: 'যোগাযোগ ও হেল্পলাইন (Contact Us)',
  description: 'বিচিত্র শপ কাস্টমার সাপোর্ট ও হেল্পলাইন। ফোন: 01761-674164, ইমেইল: support@bichitrashop.com। সকাল ৯টা থেকে রাত ১০টা পর্যন্ত সক্রিয়।',
  alternates: {
    canonical: 'https://bichitrashop.com/contact'
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

export default async function ContactPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
      <Header categories={categories} />

      <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#08542C] uppercase tracking-wider">
            কাস্টমার কেয়ার
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900">
            যোগাযোগ ও সার্বক্ষণিক সহায়তা
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            যেকোনো তথ্য, অর্ডার আপডেট বা সহায়তার জন্য আমাদের সাপোর্ট টিমের সাথে সরাসরি যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-black stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase">হটলাইন কল সাপোর্ট</h3>
                <a
                  href="tel:+8801761674164"
                  className="text-base sm:text-lg font-black text-zinc-900 hover:text-[#08542C] block mt-0.5"
                >
                  01761-674164
                </a>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  সরাসরি ফোনে অর্ডার করতে বা পরামর্শ নিতে কল করুন।
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-black stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase">সাপোর্ট ইমেইল</h3>
                <a
                  href="mailto:support@bichitrashop.com"
                  className="text-sm sm:text-base font-bold text-zinc-900 hover:text-[#08542C] block mt-0.5"
                >
                  support@bichitrashop.com
                </a>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  যেকোনো লিখিত পরামর্শ বা ইনভয়েস সংক্রান্ত তথ্যের জন্য ইমেইল করুন।
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-black stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase">অফিস ও ওয়্যারহাউজ</h3>
                <p className="text-sm font-bold text-zinc-900 mt-0.5">
                  রহনপুর, চাঁপাইনবাবগঞ্জ, বাংলাদেশ
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  কেন্দ্রীয় বিতরণ হাব ও কাস্টমার সার্ভিস অফিস।
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-black stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase">সাপোর্ট সময়সূচী</h3>
                <p className="text-sm font-bold text-zinc-900 mt-0.5">
                  সকাল ৯:০০ টা – রাত ১০:০০ টা
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  সপ্তাহের ৭ দিনই আমাদের গ্রাহক সহায়তা চালু থাকে।
                </p>
              </div>
            </div>
          </div>

          {/* Quick Message / Query Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-lg font-bold text-zinc-900">
                আমাদের মেসেজ পাঠান
              </h2>
              <p className="text-xs text-zinc-500">
                ফর্মটি পূরণ করুন, আমাদের প্রতিনিধি খুব দ্রুত আপনার সাথে যোগাযোগ করবেন।
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    আপনার নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="পূর্ণ নাম লিখুন"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs outline-none bg-zinc-50 focus:bg-white focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs outline-none bg-zinc-50 focus:bg-white focus:border-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">
                  ইমেইল এড্রেস (ঐচ্ছিক)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs outline-none bg-zinc-50 focus:bg-white focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">
                  আপনার বার্তা বা অনুসন্ধানের বিবরণ <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="আপনার কাঙ্ক্ষিত পণ্য, অর্ডার বা সমস্যা সম্পর্কে বিস্তারিত লিখুন..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs outline-none bg-zinc-50 focus:bg-white focus:border-zinc-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span>বার্তা পাঠান</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
