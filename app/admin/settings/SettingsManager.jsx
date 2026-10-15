// app/admin/settings/SettingsManager.jsx
'use client';

import React, { useState } from 'react';
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
  ArrowDown
} from 'lucide-react';
import { DEFAULT_HERO_BANNERS, SAMPLE_BANNER_IMAGES } from '@/lib/banners';


export default function SettingsManager({ initialSettings = {} }) {
  const [activeTab, setActiveTab] = useState('banners'); // 'banners' | 'shipping' | 'contact'
  
  const [formData, setFormData] = useState({
    insideDhaka: initialSettings.shippingRates?.inside_dhaka ?? 70,
    outsideDhaka: initialSettings.shippingRates?.outside_dhaka ?? 130,
    phone: initialSettings.contact?.phone || '+880 1700-000000',
    email: initialSettings.contact?.email || 'support@bichitrashop.com',
    address: initialSettings.contact?.address || 'Mirpur, Dhaka, Bangladesh',
    announcement: initialSettings.announcement || 'ক্যাশ অন ডেলিভারি সুবিধা সারা বাংলাদেশে! ৩টি বা ততোধিক পণ্যে ফ্রি ডেলিভারি।'
  });

  const [banners, setBanners] = useState(
    Array.isArray(initialSettings.heroBanners) && initialSettings.heroBanners.length > 0
      ? initialSettings.heroBanners
      : DEFAULT_HERO_BANNERS
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
      slug: 'exclusive-embroidered-koti-set',
      image: SAMPLE_BANNER_IMAGES[0].url,
      active: true
    };
    setBanners((prev) => [newSlide, ...prev]);
  };

  // Delete banner slide
  const handleDeleteBanner = (index) => {
    if (banners.length <= 1) {
      alert('কমপক্ষে একটি ব্যানার স্লাইড থাকতে হবে।');
      return;
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
          announcement: formData.announcement.trim(),
          heroBanners: banners
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
          <span>ব্যানার স্লাইডার ব্যবস্থাপনা ({banners.length})</span>
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
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: HERO BANNERS MANAGEMENT */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
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
                    {/* Left: Image URL & Preview (5 cols) */}
                    <div className="lg:col-span-5 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-zinc-900 mb-1">
                          ব্যানার ছবির লিংক (Image URL)
                        </label>
                        <input
                          type="url"
                          value={banner.image || ''}
                          onChange={(e) => handleBannerChange(index, 'image', e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none bg-zinc-50"
                        />
                      </div>

                      {/* Image Preview Box */}
                      <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                        {banner.image ? (
                          <Image
                            src={banner.image}
                            alt={banner.title || 'Banner Preview'}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-xs gap-1">
                            <ImageIcon className="w-6 h-6 stroke-[1.5]" />
                            <span>ছবির প্রিভিউ</span>
                          </div>
                        )}
                      </div>

                      {/* Quick Sample Image Picker */}
                      <div>
                        <span className="text-[11px] font-bold text-zinc-500 block mb-1">
                          প্রস্তাবিত ছবি নির্বাচন করুন:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {SAMPLE_BANNER_IMAGES.map((sample, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleBannerChange(index, 'image', sample.url)}
                              className="text-[10px] font-semibold px-2 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors border border-zinc-200"
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
                    placeholder="মিরপুর, ঢাকা-১২১৬, বাংলাদেশ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:border-zinc-900 outline-none"
                    required
                  />
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
