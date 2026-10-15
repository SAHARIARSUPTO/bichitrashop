// app/admin/products/ProductManager.jsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatBDT } from '@/lib/pricing';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  X,
  Loader2,
  Copy,
  Sparkles,
  AlertTriangle,
  Globe,
  Upload
} from 'lucide-react';

export default function ProductManager({ initialProducts = [], categories = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [copiedSlug, setCopiedSlug] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: categories[0]?.slug || 'mens-fashion',
    price: '',
    compareAtPrice: '',
    shortDescription: '',
    description: '',
    images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'],
    sizesInput: 'M, L, XL, XXL',
    colorsInput: 'ব্ল্যাক, মেরুন, নেভি ব্লু',
    stockQuantity: 50,
    status: 'published',
    featured: false,
    seoTitle: '',
    seoDescription: ''
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category: categories[0]?.slug || 'mens-fashion',
      price: '',
      compareAtPrice: '',
      shortDescription: '',
      description: '',
      images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'],
      sizesInput: 'M, L, XL, XXL',
      colorsInput: 'ব্ল্যাক, মেরুন, নেভি ব্লু',
      stockQuantity: 50,
      status: 'published',
      featured: false,
      seoTitle: '',
      seoDescription: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || 'mens-fashion',
      price: product.price || '',
      compareAtPrice: product.compareAtPrice || '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      images: product.images && product.images.length > 0 ? product.images : [''],
      sizesInput: product.variants?.sizes ? product.variants.sizes.join(', ') : '',
      colorsInput: product.variants?.colors ? product.variants.colors.join(', ') : '',
      stockQuantity: product.stockQuantity ?? 50,
      status: product.status || 'published',
      featured: Boolean(product.featured),
      seoTitle: product.seo?.title || '',
      seoDescription: product.seo?.description || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/products/${product._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setProducts(products.map(p => p._id === product._id ? { ...p, status: newStatus } : p));
      }
    } catch (err) {
      alert('স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।');
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${product.name}" মুছে ফেলতে/আর্কাইভ করতে চান? পূর্বের অর্ডারের তথ্য অক্ষত থাকবে।`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== product._id));
      }
    } catch {
      alert('পণ্য মুছতে সমস্যা হয়েছে।');
    }
  };

  const handleCopyLink = (slug) => {
    const url = `${window.location.origin}/products/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(''), 2000);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    const sizes = formData.sizesInput
      ? formData.sizesInput.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const colors = formData.colorsInput
      ? formData.colorsInput.split(',').map(c => c.trim()).filter(Boolean)
      : [];

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || undefined,
      category: formData.category,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      images: formData.images.filter(Boolean),
      variants: { sizes, colors },
      stockQuantity: Number(formData.stockQuantity),
      status: formData.status,
      featured: formData.featured,
      seo: {
        title: formData.seoTitle || formData.name,
        description: formData.seoDescription || formData.shortDescription
      }
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/admin/products/${editingProduct._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || 'পণ্য সংরক্ষণ করতে ত্রুটি হয়েছে।');
        setSaving(false);
        return;
      }

      if (editingProduct) {
        setProducts(products.map(p => p._id === editingProduct._id ? data.product : p));
      } else {
        setProducts([data.product, ...products]);
      }

      setIsModalOpen(false);
    } catch (err) {
      setFormError('সার্ভার যোগাযোগে ত্রুটি ঘটেছে।');
    } finally {
      setSaving(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      return (
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.slug && p.slug.toLowerCase().includes(term))
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2ECE3] pb-6">
        <div>
          <span className="text-xs font-bold text-[#08542C] uppercase tracking-wider">
            ক্যাটালগ কন্ট্রোল
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2417] mt-0.5">
            পণ্য ব্যবস্থাপনা (Products)
          </h1>
          <p className="text-xs text-[#4B6354] mt-1">
            মোট {products.length} টি পণ্য সংরক্ষিত আছে
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#08542C] hover:bg-[#064423] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যোগ করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2ECE3] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="পণ্য বা স্লাগ সার্চ করুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none focus:bg-white focus:border-[#08542C]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none font-semibold text-[#0F2417]"
          >
            <option value="all">সকল ক্যাটাগরি</option>
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none font-semibold text-[#0F2417]"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="published">লাইভ (Published)</option>
            <option value="draft">ড্রাফট (Draft)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E2ECE3] shadow-xs overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6FAF7] border-b border-[#E2ECE3] text-[#4B6354] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-3.5">পণ্য</th>
                  <th className="px-6 py-3.5">ক্যাটাগরি</th>
                  <th className="px-6 py-3.5">মূল্য (BDT)</th>
                  <th className="px-6 py-3.5">স্টক</th>
                  <th className="px-6 py-3.5">স্ট্যাটাস</th>
                  <th className="px-6 py-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Image & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E2ECE3]">
                          <Image
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                            alt={prod.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-[240px]">
                          <div className="font-bold text-[#0F2417] truncate">{prod.name}</div>
                          <div className="text-[11px] text-gray-400 font-mono truncate">
                            /{prod.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-[#4B6354]">
                      {prod.category}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#DC2626]">
                        {formatBDT(prod.price)}
                      </span>
                      {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                        <span className="block text-[11px] text-gray-400 line-through">
                          {formatBDT(prod.compareAtPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <span className={`font-bold ${prod.stockQuantity <= 10 ? 'text-[#D97706]' : 'text-[#08542C]'}`}>
                        {prod.stockQuantity ?? 50} টি
                      </span>
                    </td>

                    {/* Status Toggle Badge */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(prod)}
                        title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                          prod.status === 'published'
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {prod.status === 'published' ? '● লাইভ (Published)' : '○ ড্রাফট (Draft)'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopyLink(prod.slug)}
                          title="লিংক কপি করুন"
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          {copiedSlug === prod.slug ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <Link
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          title="পাবলিক পেজ দেখুন"
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => openEditModal(prod)}
                          title="এডিট করুন"
                          className="p-1.5 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(prod)}
                          title="মুছে ফেলুন"
                          className="p-1.5 rounded-lg border border-gray-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#4B6354]">
            কোনো পণ্য পাওয়া যায়নি।
          </div>
        )}
      </div>

      {/* Product Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E2ECE3] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-[#0F2417]">
                  {editingProduct ? 'পণ্য সম্পাদনা (Edit Product)' : 'নতুন পণ্য যোগ করুন (Create Product)'}
                </h2>
                <p className="text-xs text-[#4B6354]">
                  ফর্মটি পূরণ করে সংরক্ষণ করুন। স্লাগ স্বয়ংক্রিয়ভাবে তৈরি হবে।
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-[#0F2417] mb-1">
                  পণ্যের নাম <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: এক্সক্লুসিভ অ্যামব্রয়ডারি প্রিমিয়াম কোটি সেট"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] focus:bg-white text-xs outline-none focus:border-[#08542C]"
                />
              </div>

              {/* Category & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F2417] mb-1">
                    ক্যাটাগরি <span className="text-[#DC2626]">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none focus:border-[#08542C]"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F2417] mb-1">
                    কাস্টম স্লাগ (ঐচ্ছিক - খালি রাখলে স্বয়ংক্রিয় তৈরি হবে)
                  </label>
                  <input
                    type="text"
                    placeholder="exclusive-embroidered-koti-set"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] font-mono text-xs outline-none focus:border-[#08542C]"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F2417] mb-1">
                    বিক্রয় মূল্য (৳) <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="1850"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] font-bold text-xs outline-none focus:border-[#08542C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B6354] mb-1">
                    পূর্বের মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    placeholder="2450"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none focus:border-[#08542C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F2417] mb-1">
                    স্টক পরিমাণ
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none focus:border-[#08542C]"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-[#0F2417] mb-1">
                  পণ্যের ছবির URL <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full px-4 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none focus:border-[#08542C]"
                />
              </div>

              {/* Variants */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4B6354] mb-1">
                    সাইজসমূহ (কমা দিয়ে আলাদা করুন)
                  </label>
                  <input
                    type="text"
                    placeholder="M, L, XL, XXL"
                    value={formData.sizesInput}
                    onChange={(e) => setFormData({ ...formData, sizesInput: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B6354] mb-1">
                    কালারসমূহ (কমা দিয়ে আলাদা করুন)
                  </label>
                  <input
                    type="text"
                    placeholder="ব্ল্যাক, মেরুন, নেভি ব্লু"
                    value={formData.colorsInput}
                    onChange={(e) => setFormData({ ...formData, colorsInput: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none"
                  />
                </div>
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block text-xs font-bold text-[#0F2417] mb-1">
                  সংক্ষিপ্ত বিবরণ (Short Description) <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="১-২ লাইনের মূল আকর্ষণ..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F2417] mb-1">
                  বিস্তারিত বিবরণ (Full Description)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="ফেব্রিক কোয়ালিটি, সাইজ চার্ট এবং ডেলিভারি সংক্রান্ত বিস্তারিত তথ্য..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none"
                />
              </div>

              {/* SEO Google SERP Preview Box */}
              <div className="p-4 rounded-2xl bg-[#F6FAF7] border border-[#E2ECE3] space-y-2">
                <span className="text-xs font-bold text-[#08542C] flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Google SERP Preview (SEO)</span>
                </span>
                <div className="bg-white p-3 rounded-xl border border-gray-200 text-left">
                  <p className="text-[11px] text-gray-500 font-mono">
                    https://bichitrashop.com/products/{formData.slug || 'product-slug'}
                  </p>
                  <h4 className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer">
                    {formData.seoTitle || formData.name || 'Product Title'} | Bichitra Shop
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {formData.seoDescription || formData.shortDescription || 'Product description will appear in Google search results...'}
                  </p>
                </div>
              </div>

              {/* Status and Featured Checks */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#0F2417] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#08542C]"
                    />
                    <span>হট ডিল / স্পেশাল অফার পণ্য</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-[#0F2417] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.status === 'published'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })}
                      className="w-4 h-4 rounded text-[#08542C]"
                    />
                    <span>সরাসরি ওয়েবসাইটে প্রকাশ করুন (Publish)</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#08542C] hover:bg-[#064423] text-white text-xs font-bold shadow-md flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'আপডেট করুন' : 'পণ্য তৈরি করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
