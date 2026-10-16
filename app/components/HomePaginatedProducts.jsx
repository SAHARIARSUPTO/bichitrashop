// app/components/HomePaginatedProducts.jsx
'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Flame,
  Zap,
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import ProductCard from './ProductCard';

export default function HomePaginatedProducts({
  initialProducts = [],
  categories = [],
  flashSaleEndsAt = null
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'featured', 'flash', or category slug
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(8); // Default 8 products per page
  const sectionRef = useRef(null);

  const PAGE_SIZE = 8;

  // Filter products based on selected tab/category
  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') {
      return initialProducts;
    }
    if (activeTab === 'featured') {
      return initialProducts.filter((p) => p.featured === true);
    }
    if (activeTab === 'flash') {
      return initialProducts.filter((p) => p.flashSale === true);
    }
    return initialProducts.filter((p) => p.category === activeTab);
  }, [activeTab, initialProducts]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;

  // Products to display for current page
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    setDisplayLimit(PAGE_SIZE);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayLimit((prev) => Math.min(prev + PAGE_SIZE, totalItems));
      setIsLoadingMore(false);
    }, 350);
  };

  return (
    <section ref={sectionRef} className="space-y-4">
      {/* Header and Filter Pills */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-[#08542C]" />
            <h2 className="text-lg sm:text-2xl font-black text-[#0F2417] tracking-tight">
              আমাদের পণ্যসমূহ
            </h2>
            <span className="bg-[#E8F5EC] text-[#08542C] text-[11px] font-bold px-2 py-0.5 rounded-full">
              {totalItems}টি পণ্য
            </span>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#08542C] hover:text-[#064423]"
          >
            <span>সব ক্যাটালগ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Swipeable / Scrollable Filter Pills (App Style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            { key: 'all', label: 'সকল পণ্য', icon: ShoppingBag },
            { key: 'featured', label: 'জনপ্রিয়', icon: Flame, badge: 'হট' },
            { key: 'flash', label: 'ফ্ল্যাশ সেল', icon: Zap },
            ...categories.map((c) => ({ key: c.slug, label: c.name }))
          ].map((item) => {
            const isActive = activeTab === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleTabChange(item.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-[#08542C] text-white shadow-xs'
                    : 'bg-white text-zinc-700 hover:text-black border border-zinc-200 hover:border-zinc-400'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1 rounded-full font-black ${
                      isActive ? 'bg-[#DC2626] text-white' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid: Exactly 2 Columns on Mobile, 4 Columns on Desktop */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-zinc-200 text-zinc-500 space-y-2">
          <ShoppingBag className="w-8 h-8 mx-auto text-zinc-400" />
          <p className="font-bold text-sm text-zinc-800">এই ক্যাটাগরিতে পণ্য পাওয়া যায়নি</p>
          <button
            onClick={() => handleTabChange('all')}
            className="text-xs text-[#08542C] font-bold underline cursor-pointer"
          >
            সকল পণ্য দেখুন
          </button>
        </div>
      )}

      {/* Paging / Pagination Technique (When too much products) */}
      {totalPages > 1 && (
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200/80">
          {/* Status Text */}
          <p className="text-xs text-zinc-500 font-medium order-2 sm:order-1">
            দেখানো হচ্ছে:{' '}
            <span className="font-bold text-zinc-900">
              {(currentPage - 1) * PAGE_SIZE + 1} -{' '}
              {Math.min(currentPage * PAGE_SIZE, totalItems)}
            </span>{' '}
            (মোট {totalItems}টি পণ্য)
          </p>

          {/* Numerical Page Buttons */}
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous Page"
              className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 disabled:opacity-40 disabled:pointer-events-none hover:bg-zinc-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = currentPage === p;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#08542C] text-white shadow-xs'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
              className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 disabled:opacity-40 disabled:pointer-events-none hover:bg-zinc-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
