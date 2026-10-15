// app/order-success/[reference]/page.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';
import { verifyConfirmationToken } from '@/lib/order-ref';
import { formatBDT } from '@/lib/pricing';
import { cookies } from 'next/headers';
import { CheckCircle, Truck, PhoneCall, ShoppingBag, AlertTriangle, ShieldCheck, Clock, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'অর্ডার সফলভাবে সম্পন্ন হয়েছে | Bichitra Shop',
  robots: {
    index: false,
    follow: false
  }
};

async function getOrderConfirmation(reference, searchParamsPromise) {
  try {
    await initDatabase();
    const searchParams = await searchParamsPromise;
    const urlToken = searchParams?.token;

    // Check cookie credential
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.get('bichitra_last_order')?.value || '';
    let cookieToken = null;
    if (cookieHeader) {
      const [cookieRef, cToken] = cookieHeader.split(':');
      if (cookieRef === reference.trim().toUpperCase()) {
        cookieToken = cToken;
      }
    }

    const token = urlToken || cookieToken;

    const orders = await getCollection('orders');
    const order = await orders.findOne({ orderReference: reference.trim().toUpperCase() });

    if (!order) {
      return { status: 'not_found' };
    }

    // High entropy token verification
    if (!token || !verifyConfirmationToken(token, order.confirmationTokenHash)) {
      return { status: 'forbidden' };
    }

    return {
      status: 'success',
      order: JSON.parse(JSON.stringify(order))
    };
  } catch (err) {
    console.error('Error loading order confirmation:', err);
    return { status: 'error' };
  }
}

export default async function OrderSuccessPage({ params, searchParams }) {
  const { reference } = await params;
  const result = await getOrderConfirmation(reference, searchParams);

  if (result.status === 'forbidden') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
        <Header />
        <main className="max-w-md mx-auto my-auto p-8 text-center space-y-4 bg-white rounded-3xl border border-[#E2ECE3] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto text-amber-600">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-[#0F2417]">অননুমোদিত অ্যাক্সেস</h1>
          <p className="text-xs text-[#4B6354] leading-relaxed">
            গ্রাহকের তথ্যের গোপনীয়তা রক্ষার স্বার্থে এই অর্ডারের বিবরণ প্রদর্শনের জন্য বৈধ ভেরিফিকেশন টোকেন প্রয়োজন।
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#08542C] text-white text-xs font-bold"
          >
            হোমপেজে ফিরে যান
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (result.status === 'not_found' || !result.order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
        <Header />
        <main className="max-w-md mx-auto my-auto p-8 text-center space-y-4 bg-white rounded-3xl border border-[#E2ECE3] shadow-sm">
          <h1 className="text-xl font-bold text-[#0F2417]">অর্ডারটি পাওয়া যায়নি</h1>
          <p className="text-xs text-[#4B6354]">
            রেফারেন্স নম্বরটি সঠিক নয় অথবা অর্ডারটি বাতিল করা হয়েছে।
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#08542C] text-white text-xs font-bold"
          >
            পণ্য তালিকা দেখুন
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const order = result.order;
  const item = order.items?.[0] || {};

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex-1 w-full space-y-8">
        {/* Success Checkmark Banner */}
        <div className="text-center space-y-3 bg-white p-8 rounded-3xl border border-[#E2ECE3] shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#E8F5EC] border-4 border-[#22C55E]/30 flex items-center justify-center mx-auto text-[#08542C] animate-in zoom-in duration-300">
            <CheckCircle className="w-10 h-10 text-[#08542C]" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#E8F5EC] text-[#08542C] text-xs font-bold">
            অর্ডার নিশ্চিতকরণ সম্পন্ন
          </span>

          <h1 className="text-2xl sm:text-4xl font-black text-[#0F2417]">
            ধন্যবাদ! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে
          </h1>

          <p className="text-xs sm:text-sm text-[#4B6354] max-w-lg mx-auto leading-relaxed">
            খুব শীঘ্রই আমাদের প্রতিনিধি আপনার দেওয়া নম্বরে কল করে অর্ডার কনফার্ম করবেন এবং দ্রুততম সময়ে আপনার ঠিকানায় পার্সেল পৌঁছে দেওয়া হবে।
          </p>

          <div className="pt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F6FAF7] border border-[#E2ECE3] text-xs font-mono font-bold text-[#08542C]">
            <span>অর্ডার ট্র্যাকিং আইডি:</span>
            <span className="text-[#DC2626] font-black">{order.orderReference}</span>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl border border-[#E2ECE3] shadow-sm overflow-hidden divide-y divide-gray-100">
          {/* Purchased Item Summary */}
          <div className="p-6 sm:p-8 space-y-4">
            <h2 className="text-sm font-bold text-[#0F2417] uppercase tracking-wider">
              অর্ডারের বিবরণ
            </h2>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F6FAF7] border border-[#E2ECE3]">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E2ECE3]">
                <Image
                  src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'}
                  alt={item.productName || 'পণ্য'}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-[#0F2417] line-clamp-1">
                  {item.productName}
                </h3>
                {(item.variant?.size || item.variant?.color) && (
                  <p className="text-xs text-[#4B6354] mt-0.5">
                    {item.variant.size && <span>সাইজ: {item.variant.size} </span>}
                    {item.variant.color && <span>• কালার: {item.variant.color}</span>}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-[#4B6354]">
                    {formatBDT(item.unitPrice)} × {item.quantity} টি
                  </span>
                  <span className="font-bold text-[#0F2417]">
                    {formatBDT(item.subtotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address & Customer Snapshot */}
          <div className="p-6 sm:p-8 space-y-3">
            <h2 className="text-sm font-bold text-[#0F2417] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#08542C]" />
              <span>ডেলিভারি ঠিকানা</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#4B6354] block">গ্রাহকের নাম:</span>
                <span className="font-bold text-[#0F2417] text-sm">{order.customer.name}</span>
              </div>
              <div>
                <span className="text-[#4B6354] block">মোবাইল নম্বর:</span>
                <span className="font-bold text-[#0F2417] text-sm">{order.customer.phone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#4B6354] block">ঠিকানা:</span>
                <span className="font-semibold text-[#0F2417]">{order.customer.address}, {order.customer.district}</span>
              </div>
            </div>
          </div>

          {/* Accurate Itemized Price Breakdown */}
          <div className="p-6 sm:p-8 space-y-2.5 bg-[#FDFEFA]">
            <div className="flex justify-between text-xs text-[#4B6354]">
              <span>সাবটোটাল</span>
              <span className="font-semibold text-[#0F2417]">{formatBDT(order.subtotal)}</span>
            </div>

            <div className="flex justify-between text-xs text-[#4B6354]">
              <span>ডেলিভারি চার্জ ({order.deliveryZone === 'inside_dhaka' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})</span>
              <span className="font-semibold text-[#0F2417]">{formatBDT(order.deliveryCharge)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-xs text-[#16A34A] font-bold">
                <span>ডিসকাউন্ট</span>
                <span>-{formatBDT(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-3 border-t border-dashed border-gray-200">
              <span className="text-base font-extrabold text-[#0F2417]">
                সর্বমোট প্রদেয় টাকা (ক্যাশ অন ডেলিভারি):
              </span>
              <span className="text-2xl font-black text-[#DC2626]">
                {formatBDT(order.total)}
              </span>
            </div>
          </div>

          {/* Delivery Timeline and Support Notice */}
          <div className="p-6 sm:p-8 bg-[#E8F5EC]/50 space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#08542C] shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-[#0F2417] block">সম্ভাব্য ডেলিভারি সময়:</span>
                <span className="text-[#4B6354]">
                  {order.deliveryZone === 'inside_dhaka'
                    ? 'ঢাকা সিটির ভেতরে: ২৪ থেকে ৪৮ ঘণ্টার মধ্যে।'
                    : 'ঢাকা সিটির বাইরে: ৩ থেকে ৫ কর্মদিবসের মধ্যে।'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0" />
              <p className="text-xs text-[#08542C] font-semibold">
                পণ্য হাতে পেয়ে চেক করে ডেলিভারিম্যানকে মূল্য পরিশোধ করবেন। কোনো সমস্যা হলে আমাদের হেল্পলাইনে জানান।
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#08542C] hover:bg-[#064423] text-white font-bold text-sm shadow-md transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>আরো কেনাকাটা করুন</span>
          </Link>

          <a
            href="tel:+8801700000000"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 border border-[#E2ECE3] text-[#0F2417] font-bold text-sm shadow-xs"
          >
            <PhoneCall className="w-4 h-4 text-[#22C55E]" />
            <span>হেল্পলাইন: 01700-000000</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
