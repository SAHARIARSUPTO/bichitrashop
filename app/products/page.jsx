// app/products/page.jsx
import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';
import { Filter, SlidersHorizontal, Search, RefreshCw, ShoppingBag, Flame } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'সকল পণ্য কালেকশন | Bichitra Shop (বিচিত্র শপ)',
  description: 'বিচিত্র শপের সমস্ত প্রিমিয়াম কালেকশন দেখুন – এক্সক্লুসিভ কোটি সেট, ঐতিহ্যবাহী পাঞ্জাবি, দুবাই আবায়া ও খাঁটি অর্গানিক ফুড। ক্যাশ অন ডেলিভারি।',
  alternates: {
    canonical: 'https://bichitrashop.com/products'
  }
};

async function getProductsData(searchParamsPromise) {
  try {
    await initDatabase();
    const searchParams = await searchParamsPromise;
    const category = searchParams?.category || 'all';
    const search = searchParams?.search || '';
    const sort = searchParams?.sort || 'newest';
    const featured = searchParams?.featured === 'true';
    const page = Math.max(1, parseInt(searchParams?.page || '1', 10));
    const limit = 12;

    const productsColl = await getCollection('products');
    const categoriesColl = await getCollection('categories');

    const query = { status: 'published' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured) {
      query.featured = true;
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { shortDescription: { $regex: term, $options: 'i' } }
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === 'popular') sortObj = { featured: -1, createdAt: -1 };

    const totalCount = await productsColl.countDocuments(query);
    const skip = (page - 1) * limit;

    const [products, categories] = await Promise.all([
      productsColl.find(query).sort(sortObj).skip(skip).limit(limit).toArray(),
      categoriesColl.find({ status: 'active' }).toArray()
    ]);

    return {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      activeCategory: category,
      activeSearch: search,
      activeSort: sort,
      activeFeatured: featured
    };
  } catch (err) {
    console.error('Error fetching catalog products:', err);
    return {
      products: [],
      categories: [],
      totalCount: 0,
      page: 1,
      totalPages: 1,
      activeCategory: 'all',
      activeSearch: '',
      activeSort: 'newest',
      activeFeatured: false
    };
  }
}

export default async function ProductsCatalogPage({ searchParams }) {
  const {
    products,
    categories,
    totalCount,
    page,
    totalPages,
    activeCategory,
    activeSearch,
    activeSort,
    activeFeatured
  } = await getProductsData(searchParams);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAF7]">
      <Header categories={categories} />

      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* Page Title & Breadcrumb */}
        <div>
          <nav className="text-xs text-[#4B6354] mb-2 flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-[#08542C]">হোম</Link>
            <span>/</span>
            <span className="text-[#0F2417] font-bold">পণ্য ক্যাটালগ</span>
            {activeCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="text-[#08542C] font-bold">
                  {categories.find(c => c.slug === activeCategory)?.name || activeCategory}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F2417]">
                {activeFeatured ? 'বিশেষ অফার কালেকশন' :
                 activeCategory !== 'all' ? (categories.find(c => c.slug === activeCategory)?.name || 'ক্যাটাগরি পণ্য') :
                 activeSearch ? `"${activeSearch}" সম্পর্কিত ফলাফল` : 'সকল পণ্য কালেকশন'}
              </h1>
              <p className="text-xs sm:text-sm text-[#4B6354] mt-1">
                সর্বমোট {totalCount} টি পণ্য পাওয়া গেছে • ক্যাশ অন ডেলিভারি
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Sorting Bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2ECE3] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <Link
              href={`/products?sort=${activeSort}${activeSearch ? `&search=${encodeURIComponent(activeSearch)}` : ''}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                activeCategory === 'all' && !activeFeatured
                  ? 'bg-[#08542C] text-white shadow-xs'
                  : 'bg-[#F6FAF7] text-[#4B6354] hover:bg-gray-200'
              }`}
            >
              সব পণ্য
            </Link>

            <Link
              href={`/products?featured=true&sort=${activeSort}`}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                activeFeatured
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 stroke-[2]" />
              <span>হট ডিল</span>
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}&sort=${activeSort}${activeSearch ? `&search=${encodeURIComponent(activeSearch)}` : ''}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-[#08542C] text-white shadow-xs'
                    : 'bg-[#F6FAF7] text-[#4B6354] hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Sort Dropdown & Search Reset */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
            <span className="text-xs font-semibold text-[#4B6354]">সর্ট করুন:</span>
            <div className="flex gap-1.5">
              <Link
                href={`/products?category=${activeCategory}&sort=newest${activeSearch ? `&search=${encodeURIComponent(activeSearch)}` : ''}${activeFeatured ? '&featured=true' : ''}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  activeSort === 'newest'
                    ? 'border-[#08542C] bg-[#E8F5EC] text-[#08542C]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                নতুন
              </Link>
              <Link
                href={`/products?category=${activeCategory}&sort=price-asc${activeSearch ? `&search=${encodeURIComponent(activeSearch)}` : ''}${activeFeatured ? '&featured=true' : ''}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  activeSort === 'price-asc'
                    ? 'border-[#08542C] bg-[#E8F5EC] text-[#08542C]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                দাম: কম থেকে বেশি
              </Link>
              <Link
                href={`/products?category=${activeCategory}&sort=price-desc${activeSearch ? `&search=${encodeURIComponent(activeSearch)}` : ''}${activeFeatured ? '&featured=true' : ''}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  activeSort === 'price-desc'
                    ? 'border-[#08542C] bg-[#E8F5EC] text-[#08542C]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                দাম: বেশি থেকে কম
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="p-16 text-center rounded-3xl bg-white border border-[#E2ECE3] shadow-xs max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#0F2417]">
              কোনো পণ্য খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-xs text-[#4B6354]">
              আপনার সার্চ বা ফিল্টারের সাথে মিলে এমন কোনো পণ্য এই মুহূর্তে নেই। ফিল্টার রিসেট করে আবার চেষ্টা করুন।
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#08542C] text-white text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>সকল পণ্য দেখুন</span>
            </Link>
          </div>
        )}

        {/* Pagination Links */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/products?category=${activeCategory}&sort=${activeSort}&page=${p}${activeSearch ? `&search=${encodeURIComponent(activeSearch)}` : ''}`}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  page === p
                    ? 'bg-[#08542C] text-white shadow-xs'
                    : 'bg-white border border-[#E2ECE3] text-[#0F2417] hover:bg-gray-100'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
