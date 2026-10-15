// app/products/[slug]/page.jsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductGallery from '../../components/ProductGallery';
import ProductCard from '../../components/ProductCard';
import CheckoutForm from '../../components/CheckoutForm';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';
import { formatBDT } from '@/lib/pricing';
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
  Share2,
  PhoneCall,
  Flame,
  PackageCheck,
  RotateCcw,
  FileText,
  ChevronRight,
  Home
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bichitrashop.com';

export async function generateMetadata({ params }) {
  await initDatabase();
  const { slug } = await params;
  const products = await getCollection('products');
  const product = await products.findOne({ slug: slug.trim(), status: 'published' });

  if (!product) {
    return {
      title: 'পণ্যটি পাওয়া যায়নি | Bichitra Shop',
      description: 'দুঃখিত, আপনার অনুসন্ধানকৃত পণ্যটি পাওয়া যায়নি।'
    };
  }

  const title = product.seo?.title || `${product.name} | Bichitra Shop (বিচিত্র শপ)`;
  const description = product.seo?.description || product.shortDescription;
  const imageUrl = product.images?.[0] || `${siteUrl}/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png`;
  const canonicalUrl = product.seo?.canonicalUrl || `${siteUrl}/products/${product.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Bichitra Shop – বিচিত্র শপ',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    }
  };
}

async function getProductData(slug) {
  try {
    await initDatabase();
    const productsColl = await getCollection('products');
    const categoriesColl = await getCollection('categories');

    const product = await productsColl.findOne({
      slug: slug.trim(),
      status: 'published'
    });

    if (!product) return null;

    const relatedProducts = await productsColl
      .find({
        category: product.category,
        status: 'published',
        slug: { $ne: product.slug }
      })
      .limit(4)
      .toArray();

    const categories = await categoriesColl.find({ status: 'active' }).toArray();

    return {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      categories: JSON.parse(JSON.stringify(categories))
    };
  } catch (error) {
    console.error('Error fetching product data for slug:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const data = await getProductData(slug);

  if (!data || !data.product) {
    notFound();
  }

  const { product, relatedProducts, categories } = data;

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountAmount = hasDiscount ? product.compareAtPrice - product.price : 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  // JSON-LD Structured Data for Product, Offer & Breadcrumbs
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.shortDescription,
    sku: product.slug,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: 'BDT',
      price: product.price,
      availability: product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'হোম',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'পণ্য',
        item: `${siteUrl}/products`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${siteUrl}/products/${product.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Header categories={categories} />

      <main className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 space-y-8 sm:space-y-12">
        {/* Breadcrumb Navigation with Black Icons */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-500 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-black flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-black stroke-[2]" />
            <span>হোম</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <Link href="/products" className="hover:text-black">
            পণ্য
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              <Link href={`/products?category=${product.category}`} className="hover:text-black">
                {product.category === 'mens-fashion' ? 'মেনস ফ্যাশন' :
                 product.category === 'womens-fashion' ? 'উইমেনস ফ্যাশন' :
                 product.category === 'gadgets' ? 'স্মার্ট গ্যাজেটস' :
                 product.category === 'home-appliances' ? 'হোম ও কিচেন অ্যাপ্লায়েন্স' :
                 product.category === 'home-living' ? 'হোম ও লিভিং' :
                 product.category === 'organic-food' ? 'অর্গানিক ফুড' : product.category}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-900 font-bold line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Main Display Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Gallery (Left Column) */}
          <div className="lg:col-span-6">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Product Details & Purchase Controls (Right Column) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Title & Badges */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold border border-zinc-200 inline-flex items-center gap-1.5">
                  <PackageCheck className="w-3.5 h-3.5 text-black stroke-[2]" />
                  <span>ক্যাশ অন ডেলিভারি</span>
                </span>
                
                {product.variants?.warranty && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200 inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 stroke-[2]" />
                    <span>{product.variants.warranty}</span>
                  </span>
                )}

                {product.featured && (
                  <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold border border-zinc-200 inline-flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-black stroke-[2]" />
                    <span>হট ডিল অফার</span>
                  </span>
                )}
                
                <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black stroke-[2]" />
                  <span>স্টকে আছে ({product.stockQuantity || 50}টি)</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-[#DC2626]">
                {formatBDT(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-zinc-400 line-through">
                    {formatBDT(product.compareAtPrice)}
                  </span>
                  <span className="badge-sale font-bold text-xs">
                    {discountPercent}% ছাড় (৳{discountAmount} সাশ্রয়)
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Professional Value Prop Grid (All Black Vector Icons) */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white border border-zinc-200 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-black stroke-[2]" />
                </div>
                <div>
                  <span className="font-bold text-zinc-900 block leading-tight">হোম ডেলিভারি</span>
                  <span className="text-[11px] text-zinc-500">ঢাকা ৳৭০ | বাইরে ৳১৩০</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-zinc-200 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  <PackageCheck className="w-4 h-4 text-black stroke-[2]" />
                </div>
                <div>
                  <span className="font-bold text-zinc-900 block leading-tight">ক্যাশ অন ডেলিভারি</span>
                  <span className="text-[11px] text-zinc-500">পণ্য দেখে টাকা পরিশোধ</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-zinc-200 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[2]" />
                </div>
                <div>
                  <span className="font-bold text-zinc-900 block leading-tight">১০০% আসল পণ্য</span>
                  <span className="text-[11px] text-zinc-500">প্রস্তুতকারক থেকে সরাসরি</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-zinc-200 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4 text-black stroke-[2]" />
                </div>
                <div>
                  <span className="font-bold text-zinc-900 block leading-tight">সহজ এক্সচেঞ্জ</span>
                  <span className="text-[11px] text-zinc-500">দ্রুত ও নির্ভরযোগ্য সাপোর্ট</span>
                </div>
              </div>
            </div>

            {/* Direct Hotline / Phone Order Card */}
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-200 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4 text-black stroke-[2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-900 block leading-tight">
                    ফোনে বা হোয়াটসঅ্যাপে সরাসরি অর্ডার করুন
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    আমাদের কাস্টমার সাপোর্ট সরাসরি আপনার অর্ডার গ্রহণ করবেন
                  </span>
                </div>
              </div>
              <a
                href="tel:+8801700000000"
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-lg bg-zinc-900 hover:bg-black text-white font-bold text-xs shrink-0 transition-colors shadow-2xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white" />
                <span>01700-000000</span>
              </a>
            </div>

            {/* Direct Order Now Action Button */}
            <div className="pt-1">
              <a
                href="#checkout"
                className="w-full py-3.5 sm:py-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <ShoppingBag className="w-5 h-5 text-white" />
                <span>এখনই অর্ডার করুন (ক্যাশ অন ডেলিভারি)</span>
              </a>
              <p className="text-center text-[11px] sm:text-xs text-zinc-500 mt-2">
                কোনো অগ্রিম পেমেন্ট নেই • পার্সেল হাতে পেয়ে চেক করে টাকা দিন
              </p>
            </div>

            {/* Full Product Specifications Card */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5 text-zinc-900 font-bold text-sm">
                <FileText className="w-4 h-4 text-black stroke-[2]" />
                <h3>পণ্যের বিবরণ ও বৈশিষ্ট্য:</h3>
              </div>
              <div className="text-xs sm:text-sm text-zinc-600 whitespace-pre-line leading-relaxed">
                {product.description}
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Form-Based Checkout Section */}
        <section className="pt-6">
          <CheckoutForm product={product} />
        </section>

        {/* Related Products Section (2 Cards on Mobile!) */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="pt-10 border-t border-zinc-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold text-[#08542C] uppercase tracking-wider">
                  একই ক্যাটাগরির
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 mt-0.5">
                  সম্পর্কিত পণ্যসমূহ
                </h2>
              </div>
              <Link
                href={`/products?category=${product.category}`}
                className="text-xs font-bold text-[#08542C] hover:underline"
              >
                ক্যাটাগরির সব পণ্য
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.slug} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
