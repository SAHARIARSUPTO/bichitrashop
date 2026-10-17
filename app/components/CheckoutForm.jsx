// app/components/CheckoutForm.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Truck, ShieldCheck, ShoppingBag, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { formatBDT } from '@/lib/pricing';
import { trackInitiateCheckout, trackPurchase } from '@/lib/pixel';

export default function CheckoutForm({ product, initialVariant = null, onSuccess = null }) {
  const router = useRouter();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerDistrict, setCustomerDistrict] = useState('ঢাকা (Dhaka)');
  const [deliveryZone, setDeliveryZone] = useState('inside_dhaka');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(initialVariant || {
    size: product?.variants?.sizes?.[0] || '',
    color: product?.variants?.colors?.[0] || '',
    capacity: product?.variants?.capacities?.[0] || '',
    weight: product?.variants?.weights?.[0] || '',
    warranty: product?.variants?.warranty || ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // When deliveryZone changes, update suggested district or vice-versa
  const handleZoneChange = (zone) => {
    setDeliveryZone(zone);
    if (zone === 'inside_dhaka' && !customerDistrict.includes('ঢাকা')) {
      setCustomerDistrict('ঢাকা (Dhaka)');
    } else if (zone === 'outside_dhaka' && customerDistrict.includes('ঢাকা')) {
      setCustomerDistrict('চট্টগ্রাম (Chattogram)');
    }
  };

  // Price calculations
  const unitPrice = product ? product.price : 0;
  const deliveryCharge = deliveryZone === 'inside_dhaka' ? 70 : 130;
  const subtotal = unitPrice * quantity;
  const total = subtotal + deliveryCharge;

  // Track InitiateCheckout when buyer views or enters checkout form
  useEffect(() => {
    if (product) {
      trackInitiateCheckout([product], total);
    }
  }, [product?.slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMessage('');
    setFieldErrors({});

    // Client-side quick checks
    const errors = {};
    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.customerName = 'আপনার পূর্ণ নাম লিখুন (কমপক্ষে ২ অক্ষর)';
    }

    const cleanedPhone = customerPhone.replace(/[^\d+]/g, '');
    const bdRegex = /^(?:\+?880|880)?(01[3-9]\d{8})$/;
    if (!bdRegex.test(cleanedPhone)) {
      errors.customerPhone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)';
    }

    if (!customerAddress.trim() || customerAddress.trim().length < 5) {
      errors.customerAddress = 'সম্পূর্ণ ঠিকানা লিখুন (বাসা/রোড/এলাকা)';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const idempotencyKey = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerAddress: customerAddress.trim(),
          customerDistrict: customerDistrict.trim(),
          productId: product._id ? product._id.toString() : product.slug,
          quantity,
          variant: selectedVariant,
          deliveryZone,
          notes: notes.trim()
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'অর্ডার সম্পন্ন হতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        setLoading(false);
        return;
      }

      // Order created successfully!
      trackPurchase({
        items: [{ productId: product._id ? product._id.toString() : product.slug, slug: product.slug }],
        total
      });

      if (onSuccess) {
        onSuccess(data);
      } else {
        router.push(`/order-success/${data.orderReference}?token=${encodeURIComponent(data.confirmationToken || '')}`);
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMessage('নেটওয়ার্ক সমস্যার কারণে অর্ডার প্লেস করা যায়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।');
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div id="checkout" className="bg-white rounded-3xl border border-[#E2ECE3] shadow-xl overflow-hidden scroll-mt-24">
      {/* Checkout Header */}
      <div className="bg-[#08542C] text-white p-5 sm:p-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-white" />
            <span>ক্যাশ অন ডেলিভারি অর্ডার</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-0.5">
            অর্ডার ফর্ম পূরণ করুন
          </h2>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <Truck className="w-6 h-6 text-[#22C55E]" />
        </div>
      </div>

      <div className="p-5 sm:p-8">
        {/* Selected Product Summary Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F6FAF7] border border-[#E2ECE3] mb-6">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E2ECE3]">
            <Image
              src={product.images?.[0] || '/products/koti_set_navy_gold.jpg'}
              alt={product.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-[#0F2417] truncate">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-extrabold text-[#DC2626]">
                {formatBDT(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatBDT(product.compareAtPrice)}
                </span>
              )}
            </div>
            {/* Quantity Selector inside product preview */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-semibold text-[#4B6354]">পরিমাণ:</span>
              <div className="flex items-center border border-[#08542C]/30 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-xs font-bold text-[#08542C] hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-[#0F2417] min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(20, quantity + 1))}
                  className="px-2.5 py-1 text-xs font-bold text-[#08542C] hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Variants: Fashion Sizes */}
        {product.variants?.sizes && product.variants.sizes.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#0F2417] mb-1.5">
              সাইজ নির্বাচন করুন:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    selectedVariant.size === size
                      ? 'bg-[#08542C] text-white border-[#08542C] shadow-xs'
                      : 'bg-white text-[#4B6354] border-[#E2ECE3] hover:border-[#08542C]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Variants: Appliance Capacities / Power */}
        {product.variants?.capacities && product.variants.capacities.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#0F2417] mb-1.5">
              ক্যাপাসিটি / পাওয়ার নির্বাচন করুন:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.capacities.map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => setSelectedVariant({ ...selectedVariant, capacity: cap })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    selectedVariant.capacity === cap
                      ? 'bg-[#08542C] text-white border-[#08542C] shadow-xs'
                      : 'bg-white text-[#4B6354] border-[#E2ECE3] hover:border-[#08542C]'
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Variants: Organic Food Weights / Pack Sizes */}
        {product.variants?.weights && product.variants.weights.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#0F2417] mb-1.5">
              ওজন / প্যাক সাইজ নির্বাচন করুন:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.weights.map((wt) => (
                <button
                  key={wt}
                  type="button"
                  onClick={() => setSelectedVariant({ ...selectedVariant, weight: wt })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    selectedVariant.weight === wt
                      ? 'bg-[#08542C] text-white border-[#08542C] shadow-xs'
                      : 'bg-white text-[#4B6354] border-[#E2ECE3] hover:border-[#08542C]'
                  }`}
                >
                  {wt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Variants: Colors */}
        {product.variants?.colors && product.variants.colors.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#0F2417] mb-1.5">
              কালার নির্বাচন করুন:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedVariant({ ...selectedVariant, color })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    selectedVariant.color === color
                      ? 'bg-[#08542C] text-white border-[#08542C] shadow-xs'
                      : 'bg-white text-[#4B6354] border-[#E2ECE3] hover:border-[#08542C]'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Warranty Assurance Pill */}
        {product.variants?.warranty && (
          <div className="mb-5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 stroke-[2] shrink-0" />
            <span>অফিসিয়াল নিশ্চয়তা: {product.variants.warranty}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-[#0F2417] mb-1">
              আপনার নাম <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="আপনার পূর্ণ নাম লিখুন"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                fieldErrors.customerName ? 'border-red-500 bg-red-50/30' : 'border-[#E2ECE3] bg-[#F6FAF7]'
              } focus:border-[#08542C] focus:bg-white text-sm outline-none transition-all`}
            />
            {fieldErrors.customerName && (
              <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.customerName}</p>
            )}
          </div>

          {/* Customer Mobile Phone */}
          <div>
            <label className="block text-xs font-bold text-[#0F2417] mb-1">
              মোবাইল নম্বর <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="01XXXXXXXXX"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                fieldErrors.customerPhone ? 'border-red-500 bg-red-50/30' : 'border-[#E2ECE3] bg-[#F6FAF7]'
              } focus:border-[#08542C] focus:bg-white text-sm outline-none transition-all`}
            />
            {fieldErrors.customerPhone && (
              <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.customerPhone}</p>
            )}
            <p className="text-[11px] text-[#4B6354] mt-1">
              ডেলিভারি কনফার্মেশন ও কুরিয়ার যোগাযোগের জন্য সঠিক নম্বর দিন।
            </p>
          </div>

          {/* Delivery Zone Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0F2417] mb-1.5">
              ডেলিভারি এরিয়া নির্বাচন করুন <span className="text-[#DC2626]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleZoneChange('inside_dhaka')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  deliveryZone === 'inside_dhaka'
                    ? 'border-[#08542C] bg-[#E8F5EC] ring-1 ring-[#08542C]'
                    : 'border-[#E2ECE3] hover:border-gray-400 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-[#0F2417]">ঢাকা সিটির ভেতরে</span>
                  {deliveryZone === 'inside_dhaka' && <CheckCircle className="w-4 h-4 text-[#08542C]" />}
                </div>
                <span className="text-sm font-extrabold text-[#08542C] mt-1">৳৭০</span>
              </button>

              <button
                type="button"
                onClick={() => handleZoneChange('outside_dhaka')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  deliveryZone === 'outside_dhaka'
                    ? 'border-[#08542C] bg-[#E8F5EC] ring-1 ring-[#08542C]'
                    : 'border-[#E2ECE3] hover:border-gray-400 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-[#0F2417]">ঢাকা সিটির বাইরে</span>
                  {deliveryZone === 'outside_dhaka' && <CheckCircle className="w-4 h-4 text-[#08542C]" />}
                </div>
                <span className="text-sm font-extrabold text-[#08542C] mt-1">৳১৩০</span>
              </button>
            </div>
          </div>

          {/* Full Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-[#0F2417] mb-1">
              সম্পূর্ণ ঠিকানা <span className="text-[#DC2626]">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="বাসা নম্বর, রোড নম্বর, এলাকা বা থানার নাম লিখুন"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                fieldErrors.customerAddress ? 'border-red-500 bg-red-50/30' : 'border-[#E2ECE3] bg-[#F6FAF7]'
              } focus:border-[#08542C] focus:bg-white text-sm outline-none transition-all`}
            />
            {fieldErrors.customerAddress && (
              <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.customerAddress}</p>
            )}
          </div>

          {/* Delivery Note (Optional) */}
          <div>
            <label className="block text-xs font-bold text-[#4B6354] mb-1">
              বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)
            </label>
            <input
              type="text"
              placeholder="যেমন: বিকেলে ডেলিভারি দিন..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] focus:border-[#08542C] text-xs outline-none"
            />
          </div>

          {/* Automatic Price Calculation Breakdown Table */}
          <div className="pt-4 pb-2 border-t border-b border-gray-100 my-4 space-y-2">
            <div className="flex justify-between text-xs text-[#4B6354]">
              <span>ইউনিট মূল্য</span>
              <span className="font-semibold text-[#0F2417]">{formatBDT(unitPrice)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#4B6354]">
              <span>পরিমাণ</span>
              <span className="font-semibold text-[#0F2417]">{quantity} টি</span>
            </div>
            <div className="flex justify-between text-xs text-[#4B6354]">
              <span>সাবটোটাল</span>
              <span className="font-semibold text-[#0F2417]">{formatBDT(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#4B6354]">
              <span>ডেলিভারি চার্জ ({deliveryZone === 'inside_dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})</span>
              <span className="font-semibold text-[#0F2417]">{formatBDT(deliveryCharge)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-gray-200">
              <span className="text-sm sm:text-base font-extrabold text-[#0F2417]">
                সর্বমোট প্রদেয় টাকা:
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#DC2626]">
                {formatBDT(total)}
              </span>
            </div>
          </div>

          {/* Cash on Delivery Notice */}
          <div className="p-3.5 rounded-xl bg-[#E8F5EC] border border-[#08542C]/20 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#08542C] shrink-0" />
            <p className="text-xs text-[#08542C] font-semibold">
              ক্যাশ অন ডেলিভারি: অর্ডার করতে অগ্রিম কোনো টাকা দিতে হবে না। পার্সেল হাতে পেয়ে ডেলিভারিম্যানকে মূল্য পরিশোধ করুন।
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-md py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>অর্ডার প্রস্তুত হচ্ছে...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>অর্ডার কনফার্ম করুন • {formatBDT(total)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
