// app/admin/settings/SettingsManager.jsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Truck,
  Phone,
  Mail,
  MapPin,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sliders,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Globe,
  Share2,
  ShieldCheck,
  Search,
  Eye,
  Check,
  Utensils
} from 'lucide-react';
import { DEFAULT_HERO_BANNERS, DEFAULT_PROMO_BANNERS, DEFAULT_KITCHEN_BANNER, SAMPLE_BANNER_IMAGES } from '@/lib/banners';
import ImageUploader from '@/app/components/ImageUploader';

export default function SettingsManager({ initialSettings = {} }) {
  const [activeTab, setActiveTab] = useState('banners'); // 'banners' | 'promo' | 'kitchen' | 'shipping' | 'contact' | 'seo' | 'branding'
  
  const [formData, setFormData] = useState({
    insideDhaka: initialSettings.shippingRates?.inside_dhaka ?? 70,
    outsideDhaka: initialSettings.shippingRates?.outside_dhaka ?? 130,
    phone: initialSettings.contact?.phone || '01761674164',
    email: initialSettings.contact?.email || 'support@bichitrashop.com',
    address: initialSettings.contact?.address || 'রহনপুর, চাঁপাইনবাবগঞ্জ, বাংলাদেশ',
    announcement: initialSettings.announcement || 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে! ৩টি বা ততোধিক পণ্যে ফ্রি ডেলিভারি।'
  });

  const [branding, setBranding] = useState({
    favicon: initialSettings.branding?.favicon || '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
    logo: initialSettings.branding?.logo || '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
    socialPoster: initialSettings.branding?.socialPoster || '/bichitra-social-poster.jpg'
  });

  const [seo, setSeo] = useState({
    metaTitle: initialSettings.seo?.metaTitle || 'Bichitra Shop – বিচিত্র শপ | বিশ্বস্ত পণ্য ও স্মার্ট কেনাকাটা',
    metaDescription: initialSettings.seo?.metaDescription || 'বিচিত্র শপ – প্রিমিয়াম কোটি সেট, পাঞ্জাবি, বোরকা ও আবায়া, খাঁটি অর্গানিক ফুড এবং আধুনিক লাইফস্টাইল পণ্য। ক্যাশ অন ডেলিভারি সারা বাংলাদেশে।',
    keywords: initialSettings.seo?.keywords || 'বিচিত্র শপ, Bichitra Shop, অনলাইন শপিং বাংলাদেশ, ক্যাশ অন ডেলিভারি, কোটি সেট, পাঞ্জাবি কালেকশন',
    ogImage: initialSettings.seo?.ogImage || '/bichitra-social-poster.jpg',
    googleVerification: initialSettings.seo?.googleVerification || 'EOaABPHPI_eAaNXucQ1HhkIJaDn3uocSezsHHmnAI-A',
    googleAnalyticsId: initialSettings.seo?.googleAnalyticsId || ''
  });

  const [banners, setBanners] = useState(
    Array.isArray(initialSettings.heroBanners) && initialSettings.heroBanners.length > 0
      ? initialSettings.heroBanners
      : DEFAULT_HERO_BANNERS
  );

  const [promoBanners, setPromoBanners] = useState(
    Array.isArray(initialSettings.promoBanners) && initialSettings.promoBanners.length > 0
      ? initialSettings.promoBanners
      : DEFAULT_PROMO_BANNERS
  );

  const [kitchenBanner, setKitchenBanner] = useState(
    initialSettings.kitchenBanner || DEFAULT_KITCHEN_BANNER
  );

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle banner field modification
  const handleBannerChange = (index, field, value) => {
    setBanners((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Add new banner slide
  const handleAddBanner = () => {
    const newId = Date.now();
    const newSlide = {
      id: newId,
      title: 'নতুন আকর্ষণীয় স্পেশাল অফার',
      subtitle: 'বিচিত্র শপের প্রিমিয়াম কালেকশন থেকে আপনার পছন্দের পণ্যটি এখনই অর্ডার করুন।',
      badge: 'হট ডিল',
      tag: 'নতুন কালেকশন',
      price: 1500,
      comparePrice: 1950,
      discount: '৳৪৫০ ছাড়',
      slug: '/products',
      image: SAMPLE_BANNER_IMAGES[0]?.url || '/banners/deshi_spices_curry.jpg',
      active: true
    };
    setBanners((prev) => [newSlide, ...prev]);
  };

  // Delete banner slide
  const handleDeleteBanner = (index) => {
    if (banners.length <= 1) {
      if (!confirm('আপনি কি শেষ ব্যানারটিও মুছে ফেলতে চান?')) return;
    }
    setBanners((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Move banner up / down
  const handleMoveBanner = (index, direction) => {
    setBanners((prev) => {
      const copy = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Promo Banners handlers
  const handlePromoBannerChange = (index, field, value) => {
    setPromoBanners((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddPromoBanner = () => {
    const newId = 'promo-' + Date.now();
    const newPromo = {
      id: newId,
      title: 'নতুন ধামাকা বিজ্ঞাপন অফার',
      subtitle: 'বিচিত্র শপ থেকে আপনার পছন্দের পণ্যে আকর্ষণীয় মূল্যছাড়',
      badge: '৫০% পর্যন্ত অফ',
      tag: 'সীমিত অফার',
      ctaText: 'অফার দেখুন',
      link: '/products',
      image: SAMPLE_BANNER_IMAGES[0]?.url || '/banners/deshi_spices_curry.jpg',
      active: true
    };
    setPromoBanners((prev) => [newPromo, ...prev]);
  };

  const handleDeletePromoBanner = (index) => {
    if (confirm('আপনি কি নিশ্চিত যে এই বিজ্ঞাপন ব্যানারটি মুছে ফেলতে চান?')) {
      setPromoBanners((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleMovePromoBanner = (index, direction) => {
    setPromoBanners((prev) => {
      const copy = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingRates: {
            inside_dhaka: Number(formData.insideDhaka),
            outside_dhaka: Number(formData.outsideDhaka)
          },
          contact: {
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            address: formData.address.trim()
          },
          branding,
          seo,
          announcement: formData.announcement.trim(),
          heroBanners: banners,
          promoBanners: promoBanners,
          kitchenBanner: kitchenBanner
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('স্টোর ও ব্যানার সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setErrorMessage(data.error || 'সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।');
      }
    } catch {
      setErrorMessage('সার্ভার যোগাযোগে সমস্যা হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl">
      {/* Header Bar */}
      <div className="border-b border-zinc-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#08542C] uppercase tracking-wider">
            স্টোর কন্ট্রোল প্যানেল
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-0.5">
            ব্যানার স্লাইডার ও সাইট সেটিংস
          </h1>
          <p className="text-xs text-zinc-600 mt-1">
            হোমপেজের ব্যানার ছবি, লেখা, অফার প্রাইস, ডেলিভারি চার্জ ও হেল্পলাইন সম্পূর্ণ ডাইনামিকভাবে নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50 shrink-0 self-start sm:self-auto"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-white" />}
          <span>সকল পরিবর্তন সংরক্ষণ করুন</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 stroke-[2]" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0 stroke-[2]" />
          <span className="font-bold">{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'banners'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-black stroke-[2]" />
          <span>ব্যানার স্লাইডার ({banners.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('promo')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'promo'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-black stroke-[2]" />
          <span>বিজ্ঞাপন ও অফার ব্যানার ({promoBanners.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kitchen')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'kitchen'
              ? 'border-[#EA580C] text-[#EA580C]'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Utensils className="w-4 h-4 text-[#EA580C] stroke-[2]" />
          <span>দেশি কিচেন ব্যানার</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'shipping'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Truck className="w-4 h-4 text-black stroke-[2]" />
          <span>ডেলিভারি চার্জ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'contact'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Phone className="w-4 h-4 text-black stroke-[2]" />
          <span>যোগাযোগ ও নোটিশ বার</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'seo'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Globe className="w-4 h-4 text-black stroke-[2]" />
          <span>সার্চ ইঞ্জিন এসইও ও সোশ্যাল শেয়ার</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'branding'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-black stroke-[2]" />
          <span>সাইট আইকন ও লোগো</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: HERO BANNERS MANAGEMENT */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#08542C] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#08542C]">নতুন সহজ ব্যানার ও স্লাইডার ম্যানেজার</h4>
                  <p className="text-[11px] text-emerald-800">
                    সরাসরি লাইভ প্রিভিউ, ১-ক্লিক ক্লাউডিনারি আপলোড ও রেডিমেড টেমপ্লেট সহ ব্যানার সাজান।
                  </p>
                </div>
              </div>
              <Link
                href="/admin/banners"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#08542C] hover:bg-[#064423] text-white text-xs font-bold transition-all shadow-xs shrink-0"
              >
                <span>ব্যানার ম্যানেজার ওপেন করুন</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-zinc-900">
                  হোমপেজ ব্যানার স্লাইড সমূহ
                </h3>
                <p className="text-xs text-zinc-500">
                  হোমপেজের মূল ব্যানারে প্রদর্শিত ছবি, বিবরণ, অফার মূল্য ও স্ল্যাগ পরিবর্তন করুন
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddBanner}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#08542C] hover:bg-[#064423] text-white text-xs font-bold shadow-2xs transition-all"
              >
                <Plus className="w-4 h-4 text-white stroke-[2]" />
                <span>নতুন ব্যানার যোগ করুন</span>
              </button>
            </div>

            {/* Banner Slides List */}
            <div className="space-y-5">
              {banners.map((banner, index) => (
                <div
                  key={banner.id || index}
                  className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs space-y-4 transition-all hover:border-zinc-300"
                >
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm font-bold text-zinc-900">
                        {banner.title || 'শিরোনামহীন ব্যানার'}
                      </span>
                      {banner.active ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          সক্রিয়
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[10px] font-bold">
                          নিষ্ক্রিয়
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveBanner(index, -1)}
                        disabled={index === 0}
                        title="উপরে নিন"
                        className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 disabled:opacity-30 text-zinc-700"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-black stroke-[2]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveBanner(index, 1)}
                        disabled={index === banners.length - 1}
                        title="নিচে নিন"
                        className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 disabled:opacity-30 text-zinc-700"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-black stroke-[2]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteBanner(index)}
                        title="মুছে ফেলুন"
                        className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600 stroke-[2]" />
                      </button>
                    </div>
                  </div>

                  {/* Banner Fields Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    {/* Left: Cloudinary Image Uploader & Preview (5 cols) */}
                    <div className="lg:col-span-5 space-y-3">
                      <ImageUploader
                        value={banner.image || ''}
                        onChange={(newUrl) => handleBannerChange(index, 'image', newUrl)}
                        multiple={false}
                        folder="bichitra_shop/banners"
                        label="ব্যানার ছবি (Cloudinary ফাইল আপলোড বা লিংক)"
                      />

                      {/* Quick Sample Image Picker */}
                      <div className="pt-1">
                        <span className="text-[11px] font-bold text-zinc-500 block mb-1">
                          অথবা প্রস্তাবিত ছবি নির্বাচন করুন:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {SAMPLE_BANNER_IMAGES.map((sample, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleBannerChange(index, 'image', sample.url)}
                              className="text-[10px] font-semibold px-2 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors border border-zinc-200 cursor-pointer"
                            >
                              {sample.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Texts & Actions (7 cols) */}
                    <div className="lg:col-span-7 space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-zinc-900 mb-1">
                            ব্যানার শিরোনাম (Title)
                          </label>
                          <input
                            type="text"
                            value={banner.title || ''}
                            onChange={(e) => handleBannerChange(index, 'title', e.target.value)}
                            placeholder="যেমন: এক্সক্লুসিভ কোটি সেট"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-900 mb-1">
                            ট্যাগ / ক্যাটাগরি (Tag)
                          </label>
                          <input
                            type="text"
                            value={banner.tag || ''}
                            onChange={(e) => handleBannerChange(index, 'tag', e.target.value)}
                            placeholder="যেমন: মেনস স্পেশাল"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-900 mb-1">
                          সাব-টাইটেল / বিবরণ (Subtitle)
                        </label>
                        <textarea
                          rows={2}
                          value={banner.subtitle || ''}
                          onChange={(e) => handleBannerChange(index, 'subtitle', e.target.value)}
                          placeholder="উৎসব ও বিশেষ অনুষ্ঠানের জন্য আরামদায়ক কালেকশন..."
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-zinc-900 mb-1">
                            অফার মূল্য (৳)
                          </label>
                          <input
                            type="number"
                            value={banner.price ?? ''}
                            onChange={(e) => handleBannerChange(index, 'price', Number(e.target.value))}
                            placeholder="১৮৫০"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-900 mb-1">
                            পূর্বের মূল্য (৳)
                          </label>
                          <input
                            type="number"
                            value={banner.comparePrice ?? ''}
                            onChange={(e) => handleBannerChange(index, 'comparePrice', Number(e.target.value))}
                            placeholder="২৪৫০"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-900 mb-1">
                            ছাড়ের লেখা (Discount)
                          </label>
                          <input
                            type="text"
                            value={banner.discount || ''}
                            onChange={(e) => handleBannerChange(index, 'discount', e.target.value)}
                            placeholder="৳৬০০ ছাড় (২৫%)"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-xs font-bold text-zinc-900 mb-1">
                            অর্ডার লিংক / প্রোডাক্ট স্ল্যাগ (Slug/URL)
                          </label>
                          <input
                            type="text"
                            value={banner.slug || ''}
                            onChange={(e) => handleBannerChange(index, 'slug', e.target.value)}
                            placeholder="exclusive-embroidered-koti-set"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-900 mb-1">
                            ব্যাজ টেক্সট (Badge)
                          </label>
                          <input
                            type="text"
                            value={banner.badge || ''}
                            onChange={(e) => handleBannerChange(index, 'badge', e.target.value)}
                            placeholder="যেমন: ফেস্টিভ অফার"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={banner.active !== false}
                            onChange={(e) => handleBannerChange(index, 'active', e.target.checked)}
                            className="w-4 h-4 rounded text-zinc-900 border-zinc-300"
                          />
                          <span className="text-xs font-bold text-zinc-800">
                            হোমপেজে এই ব্যানার স্লাইডটি প্রদর্শন করুন (Active)
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROMOTIONAL ADVERTISE BANNERS (SALE, OFF, DEALS) */}
        {activeTab === 'promo' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-zinc-900">
                  হোমপেজ বিজ্ঞাপন ও অফার ব্যানার সমূহ
                </h3>
                <p className="text-xs text-zinc-500">
                  সেল, ডিসকাউন্ট, ক্যাশ অন ডেলিভারি ও কিচেন অ্যাপ্লায়েন্স অফার ব্যানার এডিট, ডিলিট বা যোগ করুন
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPromoBanner}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#08542C] hover:bg-[#064423] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white stroke-[2]" />
                <span>নতুন বিজ্ঞাপন ব্যানার যোগ করুন</span>
              </button>
            </div>

            {promoBanners.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center space-y-3">
                <p className="text-xs text-zinc-500 font-semibold">কোনো বিজ্ঞাপন ব্যানার পাওয়া যায়নি। নতুন ব্যানার যোগ করুন।</p>
                <button
                  type="button"
                  onClick={handleAddPromoBanner}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>ব্যানার যোগ করুন</span>
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {promoBanners.map((promo, index) => (
                  <div
                    key={promo.id || index}
                    className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs space-y-4 transition-all hover:border-zinc-300"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-sm font-bold text-zinc-900">
                          {promo.title || 'শিরোনামহীন বিজ্ঞাপন ব্যানার'}
                        </span>
                        {promo.active ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            সক্রিয়
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[10px] font-bold">
                            নিষ্ক্রিয়
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMovePromoBanner(index, -1)}
                          disabled={index === 0}
                          title="উপরে নিন"
                          className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 disabled:opacity-30 text-zinc-700 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-black stroke-[2]" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMovePromoBanner(index, 1)}
                          disabled={index === promoBanners.length - 1}
                          title="নিচে নিন"
                          className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 disabled:opacity-30 text-zinc-700 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-black stroke-[2]" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePromoBanner(index)}
                          title="মুছে ফেলুন"
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 ml-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600 stroke-[2]" />
                        </button>
                      </div>
                    </div>

                    {/* Promo Banner Fields Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      {/* Left: Cloudinary Image Uploader & Preview */}
                      <div className="lg:col-span-5 space-y-3">
                        <ImageUploader
                          value={promo.image || ''}
                          onChange={(newUrl) => handlePromoBannerChange(index, 'image', newUrl)}
                          multiple={false}
                          folder="bichitra_shop/banners"
                          label="বিজ্ঞাপন ব্যানার ছবি (Cloudinary বা লিংক)"
                        />

                        {/* Quick Sample Image Picker */}
                        <div className="pt-1">
                          <span className="text-[11px] font-bold text-zinc-500 block mb-1">
                            অথবা দ্রুত প্রস্তাবিত ছবি নির্বাচন করুন:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {SAMPLE_BANNER_IMAGES.map((sample, sIdx) => (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => handlePromoBannerChange(index, 'image', sample.url)}
                                className="text-[10px] font-semibold px-2 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors border border-zinc-200 cursor-pointer"
                              >
                                {sample.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Texts & Actions */}
                      <div className="lg:col-span-7 space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-zinc-900 mb-1">
                              বিজ্ঞাপন শিরোনাম (Title)
                            </label>
                            <input
                              type="text"
                              value={promo.title || ''}
                              onChange={(e) => handlePromoBannerChange(index, 'title', e.target.value)}
                              placeholder="যেমন: দেশি কিচেন অ্যাপ্লায়েন্স মেগা সেল"
                              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-900 mb-1">
                              ট্যাগ (Tag)
                            </label>
                            <input
                              type="text"
                              value={promo.tag || ''}
                              onChange={(e) => handlePromoBannerChange(index, 'tag', e.target.value)}
                              placeholder="যেমন: কিচেন ধামাকা"
                              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-900 mb-1">
                            সংক্ষিপ্ত বিবরণ (Subtitle)
                          </label>
                          <textarea
                            rows={2}
                            value={promo.subtitle || ''}
                            onChange={(e) => handlePromoBannerChange(index, 'subtitle', e.target.value)}
                            placeholder="অফারের বিস্তারিত বা বিবরণ..."
                            className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-zinc-900 mb-1">
                              ডিসকাউন্ট / অফার ব্যাজ
                            </label>
                            <input
                              type="text"
                              value={promo.badge || ''}
                              onChange={(e) => handlePromoBannerChange(index, 'badge', e.target.value)}
                              placeholder="যেমন: ৫০% পর্যন্ত ছাড়"
                              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-900 mb-1">
                              বাটন টেক্সট (CTA)
                            </label>
                            <input
                              type="text"
                              value={promo.ctaText || ''}
                              onChange={(e) => handlePromoBannerChange(index, 'ctaText', e.target.value)}
                              placeholder="যেমন: অফার দেখুন"
                              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-900 mb-1">
                              টার্গেট লিংক (Link URL)
                            </label>
                            <input
                              type="text"
                              value={promo.link || ''}
                              onChange={(e) => handlePromoBannerChange(index, 'link', e.target.value)}
                              placeholder="/products?category=home-appliances"
                              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                            />
                          </div>
                        </div>

                        <div className="pt-1">
                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={promo.active !== false}
                              onChange={(e) => handlePromoBannerChange(index, 'active', e.target.checked)}
                              className="w-4 h-4 rounded text-zinc-900 border-zinc-300"
                            />
                            <span className="text-xs font-bold text-zinc-800">
                              হোমপেজে এই বিজ্ঞাপন ব্যানারটি প্রদর্শন করুন (Active)
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: KITCHEN ZONE BANNER (SINGLE IMAGE UPLOAD) */}
        {activeTab === 'kitchen' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shrink-0">
                    <Utensils className="w-4 h-4 text-white stroke-[2]" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-900 tracking-tight">
                    দেশি কিচেন ও হোম অ্যাপ্লায়েন্স জোন ব্যানার
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                    মেগা অফার
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600">
                  খাঁটি মসলা বাটা, রাইস কুকার ও দ্রুত পানি গরম করার আধুনিক ও টেকসই কিচেন সরঞ্জাম
                </p>
                <p className="text-xs text-emerald-800 font-semibold mt-1">
                  ✓ ছবির ওপর কোনো লেখার প্রয়োজন নেই — শুধুমাত্র আপনার পছন্দমতো একটি ব্যানার ছবি আপলোড করুন।
                </p>
              </div>

              <Link
                href="/admin/banners"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-all shrink-0 self-start sm:self-auto"
              >
                <span>ব্যানার ম্যানেজার ওপেন করুন</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-600" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Image Uploader & Presets */}
              <div className="lg:col-span-5 space-y-4">
                <ImageUploader
                  label="কিচেন ব্যানার ছবি আপলোড করুন"
                  value={kitchenBanner}
                  onChange={(val) => setKitchenBanner(val)}
                  multiple={false}
                  folder="bichitra_shop/banners"
                />

                {/* Presets */}
                <div className="space-y-2 pt-3 border-t border-zinc-100">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                    রেডিমেড ব্যানার ছবি নির্বাচন করুন:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'আসল ক্যালিগ্রাফি কিচেন ব্যানার', url: '/banners/bengali_calligraphy_kitchen_banner.jpg' },
                      { label: 'ইলেকট্রিক ব্লেন্ডার ও কিচেন সরঞ্জাম', url: '/banners/kitchen_blender_appliance.jpg' },
                      { label: 'দেশি খাঁটি মশলা সমাহার', url: '/banners/deshi_aromatic_spices.jpg' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setKitchenBanner(preset.url)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          kitchenBanner === preset.url
                            ? 'bg-[#EA580C] text-white border-[#EA580C] font-bold'
                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Preview */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-[#EA580C]" />
                    <span>হোমপেজে যেভাবে প্রদর্শিত হবে (লাইভ প্রিভিউ)</span>
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-500">অনুপাত: 16:7 / 21:9</span>
                </div>

                <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-950 shadow-xs relative aspect-[16/7] sm:aspect-[21/9] group">
                  <Image
                    src={kitchenBanner || DEFAULT_KITCHEN_BANNER}
                    alt="কিচেন ব্যানার প্রিভিউ"
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover object-center group-hover:scale-[1.015] transition-transform duration-500"
                    unoptimized
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs flex items-center justify-between">
                  <span className="truncate">বর্তমান ছবির পথ: <strong className="font-mono">{kitchenBanner}</strong></span>
                  {kitchenBanner !== DEFAULT_KITCHEN_BANNER && (
                    <button
                      type="button"
                      onClick={() => setKitchenBanner(DEFAULT_KITCHEN_BANNER)}
                      className="text-xs font-bold text-amber-800 hover:underline shrink-0 ml-2 cursor-pointer"
                    >
                      ডিফল্টে রিসেট করুন
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHIPPING RATES */}
        {activeTab === 'shipping' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-zinc-900 font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                <Truck className="w-4 h-4 text-black stroke-[2]" />
              </div>
              <span>ডেলিভারি চার্জ কনফিগারেশন (টাকায়)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">
                  ঢাকা সিটির ভেতরে ডেলিভারি চার্জ (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.insideDhaka}
                  onChange={(e) => setFormData({ ...formData, insideDhaka: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                  required
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  বর্তমান চার্জ: ৳{formData.insideDhaka} (চেকআউট ফর্মে স্বয়ংক্রিয়ভাবে প্রযোজ্য হবে)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">
                  ঢাকা সিটির বাইরে ডেলিভারি চার্জ (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.outsideDhaka}
                  onChange={(e) => setFormData({ ...formData, outsideDhaka: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                  required
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  বর্তমান চার্জ: ৳{formData.outsideDhaka} (চেকআউট ফর্মে স্বয়ংক্রিয়ভাবে প্রযোজ্য হবে)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT & ANNOUNCEMENT */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            {/* Top Announcement Bar */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-zinc-900 font-bold text-sm">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black stroke-[2]" />
                </div>
                <span>টপ নোটিশ বার (Announcement Banner)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">
                  নোটিশ বার মেসেজ (ওয়েবসাইটের শীর্ষে প্রদর্শিত হয়)
                </label>
                <input
                  type="text"
                  value={formData.announcement}
                  onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
                  placeholder="যেমন: ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে!"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                  required
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  প্রিভিউ: {formData.announcement}
                </span>
              </div>
            </div>

            {/* Helpline and Contact Info */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-zinc-900 font-bold text-sm">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-black stroke-[2]" />
                </div>
                <span>কাস্টমার সাপোর্ট ও হেল্পলাইন তথ্য</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    হটলাইন ফোন নম্বর
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1700-000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    সাপোর্ট ইমেইল
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="support@bichitrashop.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    অফিস / শপ ঠিকানা
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="রহনপুর, চাঁপাইনবাবগঞ্জ, বাংলাদেশ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SEO & SOCIAL SHARING */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#08542C]" />
                  <span>সার্চ ইঞ্জিন অপটিমাইজেশন (SEO) ও সোশ্যাল মিডিয়া শেয়ারিং</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  গুগল সার্চ ও ফেসবুক/হোয়াটসঅ্যাপে সাইট বা পণ্যের লিংক শেয়ার করলে যে ছবি ও লেখা প্রদর্শিত হবে তা নির্ধারণ করুন
                </p>
              </div>
            </div>

            {/* Google Search Live Preview */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-700">
                <Search className="w-4 h-4 text-zinc-500" />
                <span>গুগল সার্চ প্রিভিউ (Google Search Result Simulation)</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 max-w-2xl space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                  <div className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] font-black">
                    B
                  </div>
                  <span className="font-semibold text-zinc-800">bichitrashop.vercel.app</span>
                  <span className="text-zinc-400">›</span>
                  <span className="text-zinc-500">home</span>
                </div>
                <h4 className="text-base font-bold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1 leading-snug">
                  {seo.metaTitle || 'Bichitra Shop – বিচিত্র শপ | বিশ্বস্ত পণ্য ও স্মার্ট কেনাকাটা'}
                </h4>
                <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                  {seo.metaDescription || 'বিচিত্র শপ – প্রিমিয়াম কোটি সেট, পাঞ্জাবি, বোরকা ও আবায়া, খাঁটি অর্গানিক ফুড এবং আধুনিক লাইফস্টাইল পণ্য। ক্যাশ অন ডেলিভারি সারা বাংলাদেশে।'}
                </p>
              </div>
            </div>

            {/* Social Media Share Card Simulation */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-700">
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>সোশ্যাল মিডিয়া শেয়ার কার্ড প্রিভিউ (WhatsApp / Facebook Link Preview)</span>
              </div>
              <div className="max-w-md rounded-2xl border border-zinc-200 overflow-hidden shadow-sm bg-white">
                <div className="relative aspect-[16/9] w-full bg-zinc-100 overflow-hidden">
                  <Image
                    src={seo.ogImage || '/bichitra-social-poster.jpg'}
                    alt="Social Share Poster"
                    fill
                    sizes="(max-width: 768px) 100vw, 448px"
                    className="object-cover"
                  />
                </div>
                <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                    bichitrashop.vercel.app
                  </span>
                  <h5 className="text-xs font-bold text-zinc-900 line-clamp-1">
                    {seo.metaTitle}
                  </h5>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                    {seo.metaDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs space-y-5">
              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-zinc-900">
                    সাইট মেটা টাইটেল (Meta Title)
                  </label>
                  <span className={`text-[10px] font-bold ${seo.metaTitle.length > 60 ? 'text-amber-600' : 'text-zinc-400'}`}>
                    {seo.metaTitle.length}/60 অক্ষর (প্রস্তাবিত ৫০-৬০)
                  </span>
                </div>
                <input
                  type="text"
                  value={seo.metaTitle}
                  onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                  placeholder="যেমন: Bichitra Shop – বিচিত্র শপ | বিশ্বস্ত পণ্য ও স্মার্ট কেনাকাটা"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                  required
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-zinc-900">
                    মেটা বিবরণী (Meta Description)
                  </label>
                  <span className={`text-[10px] font-bold ${seo.metaDescription.length > 160 ? 'text-amber-600' : 'text-zinc-400'}`}>
                    {seo.metaDescription.length}/160 অক্ষর (প্রস্তাবিত ১২০-১৬০)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seo.metaDescription}
                  onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                  placeholder="যেমন: বিচিত্র শপ – প্রিমিয়াম কোটি সেট, পাঞ্জাবি, বোরকা ও আবায়া, খাঁটি অর্গানিক ফুড এবং আধুনিক লাইফস্টাইল পণ্য..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Focus Keywords */}
              <div>
                <label className="block text-xs font-bold text-zinc-900 mb-1">
                  সার্চ কি-ওয়ার্ডস (Keywords - কমা দিয়ে লিখুন)
                </label>
                <input
                  type="text"
                  value={seo.keywords}
                  onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                  placeholder="বিচিত্র শপ, অনলাইন শপিং বাংলাদেশ, ক্যাশ অন ডেলিভারি, কোটি সেট"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  গুগলে ক্রেতারা যে যে শব্দ দিয়ে অনুসন্ধান করতে পারে তা কমা দিয়ে যুক্ত করুন।
                </p>
              </div>

              {/* Social Share Poster Image */}
              <div className="pt-2 border-t border-zinc-100 space-y-3">
                <label className="block text-xs font-bold text-zinc-900">
                  সোশ্যাল শেয়ার পোস্টার ছবি (OpenGraph Poster Image)
                </label>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative w-36 h-20 rounded-xl overflow-hidden border border-zinc-200 shrink-0 bg-zinc-100 shadow-xs">
                    <Image
                      src={seo.ogImage || '/bichitra-social-poster.jpg'}
                      alt="Social Poster Preview"
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="text"
                      value={seo.ogImage}
                      onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                      placeholder="ছবির URL যেমন: /bichitra-social-poster.jpg বা Cloudinary লিংক"
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                    />

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setSeo({ ...seo, ogImage: '/bichitra-social-poster.jpg' })}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>AI জেনারেটেড পোস্টার সেট করুন</span>
                      </button>
                    </div>

                    <div className="pt-1">
                      <ImageUploader
                        onUploadSuccess={(url) => setSeo({ ...seo, ogImage: url })}
                        folder="bichitra_seo"
                        label="নতুন কাস্টম পোস্টার ছবি আপলোড করুন"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Search Console & Analytics Verification */}
              <div className="pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    গুগল সার্চ কনসোল ভেরিফিকেশন কোড (Google Site Verification)
                  </label>
                  <input
                    type="text"
                    value={seo.googleVerification}
                    onChange={(e) => setSeo({ ...seo, googleVerification: e.target.value })}
                    placeholder="যেমন: EOaABPHPI_eAaNXucQ1HhkIJaDn3uocSezsHHmnAI-A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-mono focus:border-zinc-900 outline-none"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Google Search Console &gt; Settings &gt; Ownership Verification &gt; HTML tag-এর content কোডটি দিন।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    গুগল অ্যানালিটিক্স / জিটিএম আইডি (GA4 ID)
                  </label>
                  <input
                    type="text"
                    value={seo.googleAnalyticsId}
                    onChange={(e) => setSeo({ ...seo, googleAnalyticsId: e.target.value })}
                    placeholder="যেমন: G-XXXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-mono focus:border-zinc-900 outline-none"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Google Analytics ৪ মেজারমেন্ট আইডি থাকলে এখানে ইনপুট দিন।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: BRANDING & SITE ICONS */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-200 pb-4">
              <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#08542C]" />
                <span>সাইট আইকন (Favicon) ও স্টোর লোগো ব্যবস্থাপনা</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                ব্রাউজারের ট্যাবে প্রদর্শিত ফেভিকন এবং হেডার/ইনভয়েসে ব্যবহৃত অফিসিয়াল লোগো নিয়ন্ত্রণ করুন
              </p>
            </div>

            {/* Browser Tab Simulation Preview */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold text-zinc-700 block">
                ব্রাউজার ট্যাব প্রিভিউ (Browser Tab Preview)
              </span>
              <div className="bg-zinc-200 p-2 rounded-xl flex items-center max-w-sm">
                <div className="bg-white rounded-t-lg px-3 py-1.5 flex items-center gap-2 shadow-xs border border-zinc-200/80 w-full">
                  <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 bg-white">
                    <Image
                      src={branding.favicon || '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png'}
                      alt="Tab Favicon"
                      fill
                      sizes="16px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold text-zinc-800 truncate">
                    {seo.metaTitle || 'Bichitra Shop – বিচিত্র শপ'}
                  </span>
                </div>
              </div>
            </div>

            {/* Favicon Settings */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
                সাইট আইকন / ফেভিকন (Site Icon / Favicon)
              </h4>
              <p className="text-xs text-zinc-500">
                সাইটের ট্যাবে, বুকমার্কে এবং মোবাইলের হোমস্ক্রিন শর্টকাটে প্রদর্শিত হবে (PNG বা ICO ফরম্যাট, ৩২x৩২ বা ৬৪x৬৪ পিক্সেল)।
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-600 bg-white p-1 shrink-0 shadow-sm flex items-center justify-center">
                  <Image
                    src={branding.favicon || '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png'}
                    alt="Favicon Preview"
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="text"
                    value={branding.favicon}
                    onChange={(e) => setBranding({ ...branding, favicon: e.target.value })}
                    placeholder="/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBranding({ ...branding, favicon: '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png' })}
                      className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      ডিফল্ট গ্রিন ব্যাজ লোগো রিসেট
                    </button>
                  </div>
                  <div className="pt-1">
                    <ImageUploader
                      onUploadSuccess={(url) => setBranding({ ...branding, favicon: url })}
                      folder="bichitra_branding"
                      label="নতুন ফেভিকন আপলোড করুন"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Official Store Logo Settings */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
                প্রধান স্টোর লোগো (Header & Invoice Logo)
              </h4>
              <p className="text-xs text-zinc-500">
                হেডার বার, ফুটার, কাস্টমার ইনভয়েস চালান ও সোশ্যাল মেটাডাটাতে ব্যবহৃত অফিসিয়াল ব্র্যান্ড লোগো।
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-zinc-200 bg-white p-1 shrink-0 shadow-sm flex items-center justify-center">
                  <Image
                    src={branding.logo || '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png'}
                    alt="Main Store Logo Preview"
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="text"
                    value={branding.logo}
                    onChange={(e) => setBranding({ ...branding, logo: e.target.value })}
                    placeholder="/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBranding({ ...branding, logo: '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png' })}
                      className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      অফিসিয়াল ব্যাজ লোগো সেট করুন
                    </button>
                  </div>
                  <div className="pt-1">
                    <ImageUploader
                      onUploadSuccess={(url) => setBranding({ ...branding, logo: url })}
                      folder="bichitra_branding"
                      label="নতুন স্টোর লোগো আপলোড করুন"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-white" />}
            <span>সকল পরিবর্তন সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
}
