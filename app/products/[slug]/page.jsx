// app/products/[slug]/page.jsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductGallery from '../../components/ProductGallery';
import ProductCard from '../../components/ProductCard';
import ProductDetailClient from './ProductDetailClient';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';
import { ChevronRight, Home } from 'lucide-react';

export const dynamic = 'force-dynamic';

import { getSiteUrl, toAbsoluteUrl, toOgImageUrl, DEFAULT_SOCIAL_POSTER } from '@/lib/seo';

export async function generateMetadata({ params }) {
  await initDatabase();
  const { slug } = await params;
  const products = await getCollection('products');
  const product = await products.findOne({ slug: slug.trim(), status: 'published' });

  const siteUrl = getSiteUrl();

  if (!product) {
    return {
      title: 'পণ্যটি পাওয়া যায়নি | Bichitra Shop',
      description: 'দুঃখিত, আপনার অনুসন্ধানকৃত পণ্যটি পাওয়া যায়নি।'
    };
  }

  const title = product.seo?.title || `${product.name} | Bichitra Shop (বিচিত্র শপ)`;
  const description = product.seo?.description || product.shortDescription || `${product.name} - সেরা মূল্যে কিনুন বিচিত্র শপ থেকে। ক্যাশ অন ডেলিভারি সারা বাংলাদেশে।`;
  const canonicalUrl = `${siteUrl}/products/${product.slug}`;

  // Ensure optimized absolute URLs for social crawlers (Facebook, WhatsApp, Twitter, etc.)
  const rawImage = product.images?.[0] || DEFAULT_SOCIAL_POSTER;
  const primaryImageUrl = toOgImageUrl(rawImage);

  const ogImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images.slice(0, 4).map((img, idx) => ({
        url: toOgImageUrl(img),
        secureUrl: toOgImageUrl(img),
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: `${product.name} - ছবি ${idx + 1}`
      }))
    : [
        {
          url: primaryImageUrl,
          secureUrl: primaryImageUrl,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: product.name
        }
      ];

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: `/products/${product.slug}`
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Bichitra Shop – বিচিত্র শপ',
      locale: 'bn_BD',
      type: 'website',
      images: ogImages
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [primaryImageUrl]
    },
    other: {
      'product:price:amount': String(product.price || 0),
      'product:price:currency': 'BDT',
      'product:availability': (product.stockQuantity ?? 1) > 0 ? 'in stock' : 'out of stock'
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
  const siteUrl = getSiteUrl();
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

        {/* Interactive Modern Product Details Section */}
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
          canonicalUrl={`${siteUrl}/products/${product.slug}`}
        />

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
