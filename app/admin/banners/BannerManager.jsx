// app/admin/banners/BannerManager.jsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Layers,
  Eye,
  X,
  UploadCloud,
  Link as LinkIcon,
  Tag,
  DollarSign,
  Utensils
} from 'lucide-react';
import { DEFAULT_HERO_BANNERS, DEFAULT_PROMO_BANNERS, DEFAULT_KITCHEN_BANNER, SAMPLE_BANNER_IMAGES } from '@/lib/banners';
import { formatBDT } from '@/lib/pricing';

export default function BannerManager({ initialSettings = {}, products = [] }) {
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'promo' | 'kitchen'

  const [heroBanners, setHeroBanners] = useState(
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
  const [uploadingKitchenImage, setUploadingKitchenImage] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Modal State for Creating/Editing Banner
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null = create new, number = edit existing
  const [modalType, setModalType] = useState('hero'); // 'hero' | 'promo'

  // Image Upload State within Modal
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'url' | 'presets'

  // Form Data inside Modal
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    badge: 'হট ডিল',
    tag: 'স্পেশাল অফার',
    price: '',
    comparePrice: '',
    discount: '',
    slug: '/products',
    image: SAMPLE_BANNER_IMAGES[0]?.url || '/banners/bengali_calligraphy_festive_banner.jpg',
    ctaText: 'অফার দেখুন',
    active: true
  });

  // Open Modal to Create New Banner
  const handleOpenCreateModal = (type = activeTab) => {
    setModalType(type);
    setEditingIndex(null);
    setBannerForm({
      title: type === 'hero' ? 'উৎসবের নতুন কালেকশন' : 'ধামাকা বিজ্ঞাপন অফার',
      subtitle: 'বিচিত্র শপ থেকে আপনার পছন্দের প্রিমিয়াম পণ্যটি কিনুন আকর্ষণীয় অফারে।',
      badge: 'হট ডিল',
      tag: 'নতুন কালেকশন',
      price: '',
      comparePrice: '',
      discount: '',
      slug: '/products',
      image: SAMPLE_BANNER_IMAGES[0]?.url || '/banners/bengali_calligraphy_festive_banner.jpg',
      ctaText: 'অফার দেখুন',
      active: true
    });
    setIsModalOpen(true);
  };

  // Open Modal to Edit Existing Banner
  const handleOpenEditModal = (index, type = activeTab) => {
    setModalType(type);
    setEditingIndex(index);
    const target = type === 'hero' ? heroBanners[index] : promoBanners[index];
    setBannerForm({
      title: target.title || '',
      subtitle: target.subtitle || '',
      badge: target.badge || 'হট ডিল',
      tag: target.tag || 'স্পেশাল অফার',
      price: target.price ?? '',
      comparePrice: target.comparePrice ?? '',
      discount: target.discount || '',
      slug: target.slug || target.link || '/products',
      image: target.image || SAMPLE_BANNER_IMAGES[0]?.url,
      ctaText: target.ctaText || 'অফার দেখুন',
      active: target.active !== false
    });
    setIsModalOpen(true);
  };

  // Direct File Upload to Cloudinary
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে একটি ছবি (Image) নির্বাচন করুন।');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'bichitra_shop/banners');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setBannerForm(prev => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || 'ছবি আপলোড ব্যর্থ হয়েছে।');
      }
    } catch {
      alert('ছবি আপলোড করতে সমস্যা হয়েছে।');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Modal Form Changes
  const handleSaveModalForm = (e) => {
    e.preventDefault();
    if (!bannerForm.image) {
      alert('অনুগ্রহ করে ব্যানারের জন্য একটি ছবি নির্বাচন বা আপলোড করুন।');
      return;
    }

    // Auto compute discount text if prices are provided
    let computedDiscount = bannerForm.discount;
    if (bannerForm.price && bannerForm.comparePrice && Number(bannerForm.comparePrice) > Number(bannerForm.price)) {
      const diff = Number(bannerForm.comparePrice) - Number(bannerForm.price);
      computedDiscount = `৳${diff} ছাড়`;
    }

    const payload = {
      ...bannerForm,
      price: bannerForm.price ? Number(bannerForm.price) : undefined,
      comparePrice: bannerForm.comparePrice ? Number(bannerForm.comparePrice) : undefined,
      discount: computedDiscount,
      link: bannerForm.slug
    };

    if (modalType === 'hero') {
      if (editingIndex !== null) {
        setHeroBanners(prev => prev.map((b, i) => i === editingIndex ? { ...b, ...payload } : b));
      } else {
        setHeroBanners(prev => [{ ...payload, id: Date.now() }, ...prev]);
      }
    } else {
      if (editingIndex !== null) {
        setPromoBanners(prev => prev.map((b, i) => i === editingIndex ? { ...b, ...payload } : b));
      } else {
        setPromoBanners(prev => [{ ...payload, id: 'promo-' + Date.now() }, ...prev]);
      }
    }

    setIsModalOpen(false);
  };

  // Toggle Active Status
  const handleToggleActive = (index, type) => {
    if (type === 'hero') {
      setHeroBanners(prev => prev.map((b, i) => i === index ? { ...b, active: !b.active } : b));
    } else {
      setPromoBanners(prev => prev.map((b, i) => i === index ? { ...b, active: !b.active } : b));
    }
  };

  // Move Order Up or Down
  const handleMove = (index, direction, type) => {
    const listSetter = type === 'hero' ? setHeroBanners : setPromoBanners;
    listSetter(prev => {
      const copy = [...prev];
      const target = index + direction;
      if (target < 0 || target >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  // Delete Banner
  const handleDelete = (index, type) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ব্যানারটি মুছে ফেলতে চান?')) return;
    if (type === 'hero') {
      setHeroBanners(prev => prev.filter((_, i) => i !== index));
    } else {
      setPromoBanners(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Direct File Upload for Kitchen Zone Banner
  const handleKitchenFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে একটি ছবি (Image) নির্বাচন করুন।');
      return;
    }

    setUploadingKitchenImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'bichitra_shop/banners');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setKitchenBanner(data.url);
      } else {
        alert(data.error || 'ছবি আপলোড ব্যর্থ হয়েছে।');
      }
    } catch {
      alert('ছবি আপলোড করতে সমস্যা হয়েছে।');
    } finally {
      setUploadingKitchenImage(false);
    }
  };

  // Save all to database
  const handleSaveAllToDatabase = async () => {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroBanners,
          promoBanners,
          kitchenBanner
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('সকল ব্যানার ও কিচেন জোন ছবি সফলভাবে সংরক্ষিত ও লাইভ স্টোরে আপডেট হয়েছে!');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setErrorMessage(data.error || 'ব্যানার সংরক্ষণ করতে সমস্যা হয়েছে।');
      }
    } catch {
      setErrorMessage('সার্ভার যোগাযোগে সমস্যা হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  const currentList = activeTab === 'hero' ? heroBanners : promoBanners;

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2ECE3] pb-6">
        <div>
          <span className="text-xs font-bold text-[#08542C] uppercase tracking-wider">
            স্টোর ভিজ্যুয়াল ব্রান্ডিং
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2417] mt-0.5">
            ব্যানার স্লাইডার ও অফার ম্যানেজমেন্ট
          </h1>
          <p className="text-xs text-[#4B6354] mt-1">
            সহজেই হোমপেজের মূল স্লাইডার এবং প্রমোশনাল বিজ্ঞাপন ব্যানার আপলোড ও পরিবর্তন করুন
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab !== 'kitchen' && (
            <button
              onClick={() => handleOpenCreateModal(activeTab)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08542C] hover:bg-[#064423] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>নতুন ব্যানার তৈরি করুন</span>
            </button>
          )}

          <button
            onClick={handleSaveAllToDatabase}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-white" />}
            <span>পরিবর্তন সেভ করুন</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex border-b border-zinc-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'hero'
              ? 'border-[#08542C] text-[#08542C]'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-[#08542C]" />
          <span>মূল স্লাইডার ব্যানার ({heroBanners.length} টি)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('promo')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'promo'
              ? 'border-[#08542C] text-[#08542C]'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#08542C]" />
          <span>বিজ্ঞাপন ও অফার ব্যানার ({promoBanners.length} টি)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kitchen')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'kitchen'
              ? 'border-[#EA580C] text-[#EA580C]'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Utensils className="w-4 h-4 text-[#EA580C]" />
          <span>দেশি কিচেন অ্যাপ্লায়েন্স ব্যানার</span>
        </button>
      </div>

      {/* Hero and Promotional Banners Grid Showcase */}
      {(activeTab === 'hero' || activeTab === 'promo') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentList.map((banner, index) => {
          const isActive = banner.active !== false;

          return (
            <div
              key={banner.id || index}
              className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs hover:shadow-md flex flex-col justify-between ${
                isActive ? 'border-zinc-200' : 'border-zinc-200 opacity-60'
              }`}
            >
              {/* Top Banner Thumbnail Preview with Aspect Ratio */}
              <div>
                <div className="relative aspect-16/9 w-full bg-zinc-100 overflow-hidden border-b border-zinc-100 group">
                  <Image
                    src={banner.image || SAMPLE_BANNER_IMAGES[0]?.url}
                    alt={banner.title || 'Banner'}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover"
                    unoptimized
                  />

                  {/* Gradient Overlay & Tag */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                        #{index + 1} স্লাইড
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-emerald-500 text-white'
                            : 'bg-zinc-600 text-white'
                        }`}
                      >
                        {isActive ? '● সক্রিয় (Active)' : '○ নিষ্ক্রিয়'}
                      </span>
                    </div>

                    <div className="text-white">
                      {banner.badge && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-[#DC2626] text-white text-[9px] font-black uppercase mb-1">
                          {banner.badge}
                        </span>
                      )}
                      <h3 className="font-bold text-sm text-white line-clamp-1 leading-snug">
                        {banner.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-4 space-y-2 text-xs">
                  {banner.subtitle && (
                    <p className="text-zinc-600 text-[11px] line-clamp-2">
                      {banner.subtitle}
                    </p>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 text-[11px]">
                    <div className="flex items-center gap-1.5 text-zinc-500 font-mono truncate max-w-[180px]">
                      <ExternalLink className="w-3 h-3 text-[#08542C] shrink-0" />
                      <span className="truncate">{banner.slug || banner.link || '/products'}</span>
                    </div>

                    {banner.price && (
                      <span className="font-black text-[#DC2626]">
                        {formatBDT(banner.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, -1, activeTab)}
                    disabled={index === 0}
                    title="আগে নিন"
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-30 text-zinc-700 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(index, 1, activeTab)}
                    disabled={index === currentList.length - 1}
                    title="পরে নিন"
                    className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-30 text-zinc-700 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(index, activeTab)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-zinc-200 text-zinc-700 border-zinc-300 hover:bg-zinc-300'
                    }`}
                  >
                    {isActive ? 'সক্রিয়' : 'চালু করুন'}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(index, activeTab)}
                    title="এডিট করুন"
                    className="p-1.5 rounded-lg border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(index, activeTab)}
                    title="মুছে ফেলুন"
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 bg-white hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* DEDICATED TAB: DESHI KITCHEN & HOME APPLIANCES ZONE BANNER (SINGLE IMAGE UPLOAD) */}
      {activeTab === 'kitchen' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Title & Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shrink-0">
                    <Utensils className="w-4 h-4 text-white stroke-[2]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">
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
                  ✓ ছবির ওপর কোনো লেখার প্রয়োজন নেই — শুধুমাত্র আপনার পছন্দমতো ব্যানার ছবি আপলোড করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveAllToDatabase}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-white" />}
                <span>কিচেন ব্যানার সংরক্ষণ করুন</span>
              </button>
            </div>

            {/* Image Uploader & Live Preview Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Image Controls (Upload, URL, Presets) */}
              <div className="lg:col-span-5 space-y-5">
                {/* Direct File Upload */}
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-[#EA580C]" />
                    <span>নতুন ছবি আপলোড করুন</span>
                  </h4>

                  <label className="border-2 border-dashed border-zinc-300 hover:border-[#EA580C] bg-white rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleKitchenFileUpload}
                      className="hidden"
                      disabled={uploadingKitchenImage}
                    />
                    {uploadingKitchenImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin" />
                        <span className="text-xs font-bold text-zinc-700">ছবি আপলোড হচ্ছে...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                          <UploadCloud className="w-5 h-5 text-[#EA580C]" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zinc-900 group-hover:text-[#EA580C]">
                            ছবি সিলেক্ট করতে ক্লিক করুন
                          </span>
                          <p className="text-[11px] text-zinc-500 mt-0.5">PNG, JPG, WebP (প্রস্তাবিত অনুপাত: 16:7 বা 21:9)</p>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Direct Image URL Input */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-200">
                    <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-zinc-500" />
                      <span>অথবা সরাসরি ছবির লিংক দিন (URL)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={kitchenBanner}
                        onChange={(e) => setKitchenBanner(e.target.value)}
                        placeholder="https://... বা /banners/image.jpg"
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="space-y-2 pt-2 border-t border-zinc-200">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
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
              </div>

              {/* Right Column: Live Section Preview */}
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
        </div>
      )}

      {/* DIALOG MODAL: CREATE OR EDIT BANNER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="text-xs font-bold text-[#08542C] uppercase tracking-wider">
                  {modalType === 'hero' ? 'মূল ব্যানার স্লাইড' : 'বিজ্ঞাপন ব্যানার'}
                </span>
                <h2 className="text-xl font-black text-zinc-900 mt-0.5">
                  {editingIndex !== null ? 'ব্যানার তথ্য সম্পাদনা করুন' : 'নতুন আকর্ষণীয় ব্যানার তৈরি করুন'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalForm} className="space-y-4 text-xs">
              {/* 1. Image Selection Section */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#08542C]" />
                    <span>১. ব্যানার ছবি নির্বাচন বা আপলোড</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">প্রস্তাবিত সাইজ: 16:9 অনুপাত (1920x800 বা 1200x500)</span>
                </div>

                {/* Real-time Banner Aspect-Ratio Image Preview */}
                <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-zinc-200 border border-zinc-300 shadow-2xs">
                  {bannerForm.image ? (
                    <Image
                      src={bannerForm.image}
                      alt="Banner Preview"
                      fill
                      sizes="600px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span>ছবি নির্বাচন করা হয়নি</span>
                    </div>
                  )}

                  {/* Live Mock Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white pointer-events-none">
                    {bannerForm.badge && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-[#DC2626] text-white text-[9px] font-black w-max mb-1">
                        {bannerForm.badge}
                      </span>
                    )}
                    <h3 className="font-black text-base text-white line-clamp-1">
                      {bannerForm.title || 'ব্যানার শিরোনাম'}
                    </h3>
                    <p className="text-[11px] text-white/80 line-clamp-1">
                      {bannerForm.subtitle || 'ব্যানার বিবরণ'}
                    </p>
                  </div>
                </div>

                {/* Image Selection Method Tabs */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      imageTab === 'upload'
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    ফাইল আপলোড করুন
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageTab('presets')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      imageTab === 'presets'
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    প্রস্তাবিত ব্যানার গ্যালারি ({SAMPLE_BANNER_IMAGES.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      imageTab === 'url'
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    সরাসরি লিংক (URL)
                  </button>
                </div>

                {/* Sub-tab 1: File Upload */}
                {imageTab === 'upload' && (
                  <div className="p-3 bg-white rounded-xl border border-dashed border-zinc-300 text-center space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="banner-file-input"
                    />
                    <label
                      htmlFor="banner-file-input"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs cursor-pointer transition-colors"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#08542C]" />
                          <span>Cloudinary-তে আপলোড হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 text-[#08542C]" />
                          <span>কম্পিউটার/মোবাইল থেকে নতুন ছবি সিলেক্ট করুন</span>
                        </>
                      )}
                    </label>
                    <p className="text-[10px] text-zinc-400">
                      PNG, JPG, WEBP ফরম্যাট সমর্থিত • সরাসরি হাই-স্পিড CDN-এ আপলোড হবে
                    </p>
                  </div>
                )}

                {/* Sub-tab 2: Presets Gallery */}
                {imageTab === 'presets' && (
                  <div className="p-3 bg-white rounded-xl border border-zinc-200 space-y-2">
                    <span className="text-[11px] font-bold text-zinc-600 block">
                      ক্লিক করে পছন্দের দেশি ক্যালিগ্রাফি বা লাইফস্টাইল ব্যানার বেছে নিন:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                      {SAMPLE_BANNER_IMAGES.map((sample, sIdx) => (
                        <div
                          key={sIdx}
                          onClick={() => setBannerForm(prev => ({ ...prev, image: sample.url }))}
                          className={`group relative aspect-16/9 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                            bannerForm.image === sample.url
                              ? 'border-[#08542C] ring-2 ring-[#08542C]/40 scale-95'
                              : 'border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          <Image
                            src={sample.url}
                            alt={sample.label}
                            fill
                            sizes="140px"
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-1 text-[9px] text-white font-bold leading-tight line-clamp-1">
                            {sample.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-tab 3: Direct URL */}
                {imageTab === 'url' && (
                  <div className="p-3 bg-white rounded-xl border border-zinc-200 flex gap-2">
                    <input
                      type="url"
                      placeholder="https://... বা /banners/image.jpg"
                      value={bannerForm.image}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, image: e.target.value }))}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>
                )}
              </div>

              {/* 2. Text & Content Fields */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="font-bold text-zinc-900 text-xs block">২. ব্যানারের লেখা ও শিরোনাম</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      মূল শিরোনাম (Title) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: উৎসবের রঙে সাজুন – এক্সক্লুসিভ কোটি সেট"
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      সাব-টাইটেল / বিবরণ (Subtitle)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="যেমন: আরামদায়ক সিল্ক-কটন ফেব্রিক এবং নিখুঁত হ্যান্ডক্রাফটেড সুতার কাজ..."
                      value={bannerForm.subtitle}
                      onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      ব্যাজ টেক্সট (Badge)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: হট ডিল / নতুন"
                      value={bannerForm.badge}
                      onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      ক্যাটাগরি ট্যাগ (Tag)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: মেনস ফ্যাশন"
                      value={bannerForm.tag}
                      onChange={(e) => setBannerForm({ ...bannerForm, tag: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      টার্গেট লিংক (ক্লিক করলে যেখানে যাবে)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) setBannerForm({ ...bannerForm, slug: e.target.value });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-semibold"
                      >
                        <option value="">পণ্য নির্বাচন করুন (ঐচ্ছিক)...</option>
                        {products.map(p => (
                          <option key={p.slug} value={`/products/${p.slug}`}>
                            {p.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="যেমন: /products বা /products/koti-set"
                        value={bannerForm.slug}
                        onChange={(e) => setBannerForm({ ...bannerForm, slug: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      অফার মূল্য (৳)
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 1850"
                      value={bannerForm.price}
                      onChange={(e) => setBannerForm({ ...bannerForm, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      পূর্বের মূল্য (৳)
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: 2450"
                      value={bannerForm.comparePrice}
                      onChange={(e) => setBannerForm({ ...bannerForm, comparePrice: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-zinc-800">
                    <input
                      type="checkbox"
                      checked={bannerForm.active}
                      onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                      className="w-4 h-4 rounded accent-[#08542C]"
                    />
                    <span>এই ব্যানারটি বর্তমানে হোমপেজে সক্রিয় রাখুন (Active)</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-bold hover:bg-zinc-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#08542C] hover:bg-[#064423] text-white font-bold shadow-md cursor-pointer transition-all active:scale-95"
                >
                  {editingIndex !== null ? 'পরিবর্তন সংরক্ষণ করুন' : 'ব্যানার যুক্ত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
