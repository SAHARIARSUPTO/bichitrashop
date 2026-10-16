// app/components/ProductCard.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye, Zap } from 'lucide-react';
import { formatBDT } from '@/lib/pricing';

export default function ProductCard({ product, onQuickOrder = null }) {
  if (!product) return null;

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountAmount = hasDiscount ? product.compareAtPrice - product.price : 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const primaryImage = product.images?.[0] || '/products/koti_set_navy_gold.jpg';

  return (
    <div className="group relative bg-white rounded-xl sm:rounded-2xl border border-zinc-200 hover:border-zinc-900 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Product Image Area */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-zinc-50 block">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-[#DC2626] text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-white" />
              <span>{discountPercent}% ছাড়</span>
            </span>
          </div>
        )}

        {/* Stock / Fast Delivery Badge */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="bg-white/95 backdrop-blur-xs text-zinc-900 text-xs font-bold px-1.5 py-0.5 rounded-md shadow-2xs border border-zinc-200">
            ক্যাশ অন ডেলিভারি
          </span>
        </div>
      </Link>

      {/* Content Area (Responsive padding for 2 cards per row on mobile) */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category Tag */}
          {product.category && (
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-0.5 sm:mb-1 block truncate">
              {product.category === 'mens-fashion' ? 'মেনস ফ্যাশন' :
               product.category === 'womens-fashion' ? 'উইমেনস ফ্যাশন' :
               product.category === 'home-living' ? 'হোম ও লিভিং' :
               product.category === 'organic-food' ? 'অর্গানিক ফুড' : product.category}
            </span>
          )}

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-xs sm:text-sm text-zinc-900 group-hover:text-black transition-colors line-clamp-2 leading-snug min-h-[2rem] sm:min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>
        </div>

        <div>
          {/* Pricing Area */}
          <div className="mt-2 pt-1.5 border-t border-zinc-100 flex items-baseline gap-1.5">
            <span className="text-sm sm:text-lg font-black text-[#DC2626]">
              {formatBDT(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-zinc-400 line-through">
                {formatBDT(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons: 2 buttons side-by-side that fit cleanly on mobile */}
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <Link
              href={`/products/${product.slug}`}
              className="flex items-center justify-center gap-1 py-1.5 px-1 sm:px-2 rounded-lg border border-zinc-300 hover:border-black text-zinc-900 hover:text-black hover:bg-zinc-50 text-xs font-bold transition-all text-center"
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black stroke-[2]" />
              <span>বিস্তারিত</span>
            </Link>

            {onQuickOrder ? (
              <button
                onClick={() => onQuickOrder(product)}
                className="flex items-center justify-center gap-1 py-1.5 px-1 sm:px-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 text-center cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                <span>অর্ডার</span>
              </button>
            ) : (
              <Link
                href={`/products/${product.slug}#checkout`}
                className="flex items-center justify-center gap-1 py-1.5 px-1 sm:px-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 text-center"
              >
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                <span>অর্ডার</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
