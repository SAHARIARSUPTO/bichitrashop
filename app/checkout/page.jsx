// app/checkout/page.jsx
import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutForm from '../components/CheckoutForm';
import BackButton from '../components/BackButton';
import { getCollection, ObjectId } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'অর্ডার চেকআউট | Bichitra Shop',
  description: 'সহজ ও নিরাপদ ক্যাশ অন ডেলিভারি চেকআউট। কোনো অগ্রিম পেমেন্ট নেই।',
  robots: {
    index: false,
    follow: false
  }
};

async function getCheckoutData(searchParamsPromise) {
  try {
    await initDatabase();
    const searchParams = await searchParamsPromise;
    const productId = searchParams?.productId || searchParams?.slug;

    const productsColl = await getCollection('products');
    const categoriesColl = await getCollection('categories');

    let targetProduct = null;
    if (productId) {
      try {
        targetProduct = await productsColl.findOne({
          $or: [{ _id: new ObjectId(productId) }, { _id: productId }, { slug: productId }],
          status: 'published'
        });
      } catch {
        targetProduct = await productsColl.findOne({
          $or: [{ _id: productId }, { slug: productId }],
          status: 'published'
        });
      }
    }

    if (!targetProduct) {
      targetProduct = await productsColl.findOne({ status: 'published', featured: true });
    }
    if (!targetProduct) {
      targetProduct = await productsColl.findOne({ status: 'published' });
    }

    const categories = await categoriesColl.find({ status: 'active' }).toArray();

    return {
      product: targetProduct ? JSON.parse(JSON.stringify(targetProduct)) : null,
      categories: JSON.parse(JSON.stringify(categories))
    };
  } catch (error) {
    console.error('Error fetching checkout data:', error);
    return { product: null, categories: [] };
  }
}

export default async function CheckoutPage({ searchParams }) {
  const { product, categories } = await getCheckoutData(searchParams);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
      <Header categories={categories} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between">
          <BackButton
            fallbackHref={product ? `/products/${product.slug}` : '/products'}
            label="পূর্ববর্তী পেজে ফিরে যান"
          />
          <span className="text-xs text-[#4B6354] font-semibold">
            নিরাপদ ক্যাশ অন ডেলিভারি
          </span>
        </div>

        {product ? (
          <CheckoutForm product={product} />
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#E2ECE3] shadow-xs space-y-4">
            <ShoppingBag className="w-12 h-12 text-[#08542C] mx-auto" />
            <h2 className="text-xl font-bold text-[#0F2417]">কোনো পণ্য নির্বাচিত করা হয়নি</h2>
            <p className="text-xs text-[#4B6354]">
              অর্ডার করার জন্য অনুগ্রহ করে ক্যাটালগ থেকে একটি পণ্য নির্বাচন করুন।
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#08542C] text-white text-xs font-bold"
            >
              সকল পণ্য দেখুন
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
