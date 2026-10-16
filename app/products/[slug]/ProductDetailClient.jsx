// app/products/[slug]/ProductDetailClient.jsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Truck,
  ShieldCheck,
  PackageCheck,
  RotateCcw,
  CheckCircle2,
  PhoneCall,
  Flame,
  FileText,
  Share2,
  ShoppingBag,
  MessageCircle,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';
import ProductGallery from '../../components/ProductGallery';
import CheckoutForm from '../../components/CheckoutForm';
import { formatBDT } from '@/lib/pricing';

export default function ProductDetailClient({ product, relatedProducts = [], canonicalUrl = '' }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.variants?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.variants?.colors?.[0] || '');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountAmount = hasDiscount ? product.compareAtPrice - product.price : 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: product.name,
            text: product.shortDescription,
            url: window.location.href
          });
        } catch (e) {
          // ignore abort
        }
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  const scrollToCheckout = (e) => {
    e?.preventDefault();
    const target = document.getElementById('checkout');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const productUrl = canonicalUrl || (product?.slug ? `https://bichitrashop.vercel.app/products/${product.slug}` : '');

  const whatsappMessage = encodeURIComponent(
    `হ্যালো বিচিত্র শপ! আমি এই পণ্যটি অর্ডার করতে চাই:\n\nপণ্য: ${product.name}\nমূল্য: ৳${product.price}\nসাইজ/ভেরিয়েন্ট: ${selectedSize || 'Standard'}\nলিংক: ${productUrl}`
  );

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Product Main Display Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Gallery (Left Column) */}
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        {/* Product Details & Purchase Controls (Right Column) */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          {/* Badges & Title */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-900 text-[11px] sm:text-xs font-bold border border-zinc-200 inline-flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5 text-black stroke-[2]" />
                <span>ক্যাশ অন ডেলিভারি</span>
              </span>

              {product.featured && (
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[11px] sm:text-xs font-bold border border-red-200 inline-flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                  <span>হট ডিল অফার</span>
                </span>
              )}

              <span className="text-[11px] sm:text-xs font-bold text-emerald-800 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 stroke-[2]" />
                <span>স্টকে আছে</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Pricing Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex flex-wrap items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#DC2626]">
                {formatBDT(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm sm:text-base text-zinc-400 line-through">
                  {formatBDT(product.compareAtPrice)}
                </span>
              )}
            </div>

            {hasDiscount && (
              <span className="bg-[#DC2626] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-2xs">
                {discountPercent}% ছাড় (৳{discountAmount} সাশ্রয়)
              </span>
            )}
          </div>

          {/* Size / Variant Selector (If sizes exist) */}
          {product.variants?.sizes && product.variants.sizes.length > 0 && (
            <div className="p-3.5 bg-white rounded-2xl border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-900">সাইজ পছন্দ করুন:</span>
                <span className="text-zinc-500 font-semibold">{selectedSize || 'বাছাই করুন'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-11 py-1.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      selectedSize === size
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs scale-105'
                        : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="p-3.5 bg-white rounded-2xl border border-zinc-200 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900">পরিমাণ (Quantity):</span>
            <div className="flex items-center gap-3 bg-zinc-100 rounded-xl p-1 border border-zinc-200">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 hover:bg-zinc-50 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-xs min-w-5 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 hover:bg-zinc-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Action CTA Buttons - Polished, elegant, and neatly proportioned */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                onClick={scrollToCheckout}
                className="flex-1 sm:max-w-md py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] text-white font-extrabold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span>সরাসরি অর্ডার করুন</span>
                <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full font-bold ml-1">
                  ক্যাশ অন ডেলিভারি
                </span>
              </button>

              <a
                href={`https://wa.me/8801761674164?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.location.href) {
                    const dynamicMsg = encodeURIComponent(
                      `হ্যালো বিচিত্র শপ! আমি এই পণ্যটি অর্ডার করতে চাই:\n\nপণ্য: ${product.name}\nমূল্য: ৳${product.price}\nসাইজ/ভেরিয়েন্ট: ${selectedSize || 'Standard'}\nলিংক: ${window.location.href}`
                    );
                    window.open(`https://wa.me/8801761674164?text=${dynamicMsg}`, '_blank', 'noopener,noreferrer');
                    e.preventDefault();
                  }
                }}
                className="py-3 px-4 rounded-2xl bg-[#E8F5EC] border border-[#08542C]/20 text-[#08542C] hover:bg-[#08542C] hover:text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-[#22C55E]" />
                <span>হোয়াটসঅ্যাপ</span>
              </a>

              <a
                href="tel:+8801761674164"
                className="py-3 px-4 rounded-2xl bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-95"
              >
                <PhoneCall className="w-4 h-4 text-zinc-700" />
                <span>হটলাইন: 01761-674164</span>
              </a>
            </div>
          </div>

          {/* Value Props Grid (All Black Vector Lucide Icons) */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center gap-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 text-black stroke-[2]" />
              </div>
              <div>
                <span className="font-bold text-zinc-900 block leading-tight">হোম ডেলিভারি</span>
                <span className="text-[10px] text-zinc-500">ঢাকা ৳৭০ | বাইরে ৳১৩০</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center gap-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                <PackageCheck className="w-4 h-4 text-black stroke-[2]" />
              </div>
              <div>
                <span className="font-bold text-zinc-900 block leading-tight">ক্যাশ অন ডেলিভারি</span>
                <span className="text-[10px] text-zinc-500">পার্সেল দেখে টাকা দিন</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center gap-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
              </div>
              <div>
                <span className="font-bold text-zinc-900 block leading-tight">১০০% আসল পণ্য</span>
                <span className="text-[10px] text-zinc-500">কোয়ালিটি গ্যারান্টি</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center gap-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4 text-black stroke-[2]" />
              </div>
              <div>
                <span className="font-bold text-zinc-900 block leading-tight">সহজ এক্সচেঞ্জ</span>
                <span className="text-[10px] text-zinc-500">৭ দিনের রিপ্লেসমেন্ট</span>
              </div>
            </div>
          </div>

          {/* Full Product Specifications Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                <FileText className="w-4 h-4 text-black stroke-[2]" />
                <h3>পণ্যের বিবরণ ও স্পেসিফিকেশন</h3>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="text-xs font-semibold text-zinc-500 hover:text-black flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'কপি হয়েছে!' : 'শেয়ার'}</span>
              </button>
            </div>
            <div className="text-xs sm:text-sm text-zinc-600 whitespace-pre-line leading-relaxed">
              {product.description || product.shortDescription}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Express Form-Based Checkout Section */}
      <section id="checkout" className="pt-4 sm:pt-6">
        <CheckoutForm
          product={product}
          initialVariant={{
            size: selectedSize,
            color: selectedColor
          }}
        />
      </section>

      {/* MOBILE STICKY FLOATING BOTTOM ACTION BAR */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-2.5 px-4 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] text-zinc-500 block">মোট মূল্য</span>
          <span className="text-lg font-black text-[#DC2626] leading-tight block truncate">
            {formatBDT(product.price * quantity)}
          </span>
        </div>

        <button
          onClick={scrollToCheckout}
          className="flex-1 max-w-[220px] py-2.5 px-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>অর্ডার করুন</span>
        </button>
      </div>
    </div>
  );
}
