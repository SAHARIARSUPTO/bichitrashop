// app/admin/products/ProductManager.jsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatBDT } from '@/lib/pricing';
import ImageUploader from '@/app/components/ImageUploader';
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
  Upload,
  ShieldCheck,
  Tag,
  Sliders,
  Layers,
  Cpu,
  Utensils,
  Shirt,
  Leaf,
  Laptop
} from 'lucide-react';

const CATEGORY_PRESETS = [
  { slug: 'mens-fashion', name: 'মেনস ফ্যাশন', icon: Shirt, isFashion: true },
  { slug: 'womens-fashion', name: 'উইমেনস ফ্যাশন', icon: Tag, isFashion: true },
  { slug: 'gadgets', name: 'স্মার্ট গ্যাজেটস', icon: Cpu, isGadget: true },
  { slug: 'home-appliances', name: 'হোম ও কিচেন অ্যাপ্লায়েন্স', icon: Utensils, isAppliance: true },
  { slug: 'organic-food', name: 'অর্গানিক ফুড', icon: Leaf, isOrganic: true },
  { slug: 'home-living', name: 'হোম ও লিভিং', icon: Laptop, isHomeLiving: true }
];

export default function ProductManager({ initialProducts = [], categories = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Merge provided categories with default categories to guarantee all are available
  const availableCategories = (categories && categories.length > 0)
    ? categories
    : CATEGORY_PRESETS;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [copiedSlug, setCopiedSlug] = useState('');

  // Bulk Selection and Deletion State
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [deletingBulk, setDeletingBulk] = useState(false);
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: availableCategories[0]?.slug || 'gadgets',
    price: '',
    compareAtPrice: '',
    shortDescription: '',
    description: '',
    images: ['/products/koti_set_navy_gold.jpg'],
    sizesInput: '',
    colorsInput: 'ব্ল্যাক, সিলভার',
    warranty: '৬ মাস রিপ্লেসমেন্ট ওয়ারেন্টি',
    capacitiesInput: '',
    weightsInput: '',
    specs: '',
    stockQuantity: 50,
    status: 'published',
    featured: false,
    seoTitle: '',
    seoDescription: ''
  });

  const isFashion = formData.category === 'mens-fashion' || formData.category === 'womens-fashion';
  const isGadget = formData.category === 'gadgets';
  const isAppliance = formData.category === 'home-appliances';
  const isOrganic = formData.category === 'organic-food';
  const isHomeLiving = formData.category === 'home-living';

  const handleCategoryChange = (catSlug) => {
    let defaultSizes = '';
    let defaultColors = 'ব্ল্যাক';
    let defaultWarranty = '';
    let defaultCapacities = '';
    let defaultWeights = '';
    let defaultSpecs = '';

    if (catSlug === 'mens-fashion' || catSlug === 'womens-fashion') {
      defaultSizes = catSlug === 'womens-fashion' ? '52, 54, 56' : 'M, L, XL, XXL';
      defaultColors = 'ব্ল্যাক, মেরুন, নেভি ব্লু';
    } else if (catSlug === 'gadgets') {
      defaultColors = 'ম্যাট ব্ল্যাক, সিলভার, হোয়াইট';
      defaultWarranty = '৬ মাস রিপ্লেসমেন্ট ওয়ারেন্টি';
      defaultSpecs = 'ব্লুটুথ ৫.৩, ২০ ঘণ্টা ব্যাটারি ব্যাকআপ, অ্যাক্টিভ নয়েজ ক্যান্সেলেশন';
    } else if (catSlug === 'home-appliances') {
      defaultCapacities = '1.8 Litre, 1000W';
      defaultWarranty = '১ বছর ব্র্যান্ড ওয়ারেন্টি';
      defaultColors = 'সিলভার-ব্ল্যাক, রেড';
    } else if (catSlug === 'organic-food') {
      defaultWeights = '৫০০ গ্রাম, ১ কেজি';
      defaultSpecs = '১০০% ভেজালমুক্ত, সরাসরি প্রাকৃতিক মৌচাক থেকে সংগৃহীত';
    }

    setFormData(prev => ({
      ...prev,
      category: catSlug,
      sizesInput: defaultSizes,
      colorsInput: defaultColors,
      warranty: defaultWarranty,
      capacitiesInput: defaultCapacities,
      weightsInput: defaultWeights,
      specs: defaultSpecs
    }));
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category: availableCategories[0]?.slug || 'gadgets',
      price: '',
      compareAtPrice: '',
      shortDescription: '',
      description: '',
      images: ['/products/koti_set_navy_gold.jpg'],
      sizesInput: '',
      colorsInput: 'ব্ল্যাক, সিলভার',
      warranty: '৬ মাস রিপ্লেসমেন্ট ওয়ারেন্টি',
      capacitiesInput: '',
      weightsInput: '',
      specs: '',
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
      category: product.category || 'gadgets',
      price: product.price || '',
      compareAtPrice: product.compareAtPrice || '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [],
      sizesInput: product.variants?.sizes ? product.variants.sizes.join(', ') : '',
      colorsInput: product.variants?.colors ? product.variants.colors.join(', ') : '',
      warranty: product.variants?.warranty || '',
      capacitiesInput: product.variants?.capacities ? product.variants.capacities.join(', ') : '',
      weightsInput: product.variants?.weights ? product.variants.weights.join(', ') : '',
      specs: product.variants?.specs || '',
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
    } catch {
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

    const cleanImages = (formData.images || []).filter(Boolean);
    if (cleanImages.length === 0) {
      setFormError('কমপক্ষে ১টি পণ্যের ছবি আপলোড বা যুক্ত করুন।');
      return;
    }

    setSaving(true);

    const sizes = formData.sizesInput
      ? formData.sizesInput.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const colors = formData.colorsInput
      ? formData.colorsInput.split(',').map(c => c.trim()).filter(Boolean)
      : [];
    const capacities = formData.capacitiesInput
      ? formData.capacitiesInput.split(',').map(c => c.trim()).filter(Boolean)
      : [];
    const weights = formData.weightsInput
      ? formData.weightsInput.split(',').map(w => w.trim()).filter(Boolean)
      : [];

    const variants = {
      colors: colors.length > 0 ? colors : undefined,
      warranty: formData.warranty?.trim() || undefined,
      specs: formData.specs?.trim() || undefined
    };

    // Only save sizes for fashion categories
    if (isFashion && sizes.length > 0) {
      variants.sizes = sizes;
    }

    // Capacities for appliances
    if (isAppliance && capacities.length > 0) {
      variants.capacities = capacities;
    }

    // Weights for organic food
    if (isOrganic && weights.length > 0) {
      variants.weights = weights;
    }

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || undefined,
      category: formData.category,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      images: cleanImages,
      variants,
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
      console.error('Save product error:', err);
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

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p._id.toString()));
    }
  };

  const handleToggleSelectOne = (id) => {
    const idStr = id.toString();
    setSelectedIds(prev =>
      prev.includes(idStr) ? prev.filter(item => item !== idStr) : [...prev, idStr]
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`আপনি কি নিশ্চিত যে নির্বাচিত ${selectedIds.length} টি পণ্য মুছে ফেলতে চান?`)) return;
    setDeletingBulk(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(prev => prev.filter(p => !selectedIds.includes(p._id.toString())));
        setSelectedIds([]);
      } else {
        alert(data.error || 'পণ্য মুছতে ব্যর্থ হয়েছে।');
      }
    } catch {
      alert('সার্ভার যোগাযোগে সমস্যা হয়েছে।');
    } finally {
      setDeletingBulk(false);
    }
  };

  const handleDeleteAll = async () => {
    if (deleteAllConfirmText.trim() !== 'DELETE') {
      alert("নিশ্চিত করতে অনুগ্রহ করে বক্সে ঠিকভাবে 'DELETE' লিখুন।");
      return;
    }
    setDeletingBulk(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts([]);
        setSelectedIds([]);
        setIsDeleteAllModalOpen(false);
        setDeleteAllConfirmText('');
      } else {
        alert(data.error || 'সকল পণ্য মুছতে ব্যর্থ হয়েছে।');
      }
    } catch {
      alert('সার্ভার যোগাযোগে সমস্যা হয়েছে।');
    } finally {
      setDeletingBulk(false);
    }
  };

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
            মোট {products.length} টি পণ্য সংরক্ষিত আছে (ফ্যাশন, গ্যাজেটস, হোম অ্যাপ্লায়েন্স, অর্গানিক ফুড)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {products.length > 0 && (
            <button
              onClick={() => {
                setDeleteAllConfirmText('');
                setIsDeleteAllModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>সকল পণ্য মুছুন</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#08542C] hover:bg-[#064423] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পণ্য যোগ করুন</span>
          </button>
        </div>
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
            {availableCategories.map(c => (
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

      {/* Bulk Action Banner when Products are Selected */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#08542C] text-white text-xs font-bold flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold text-[#08542C]">
              টি পণ্য নির্বাচিত করা হয়েছে
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteSelected}
              disabled={deletingBulk}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{deletingBulk ? 'মুছে ফেলা হচ্ছে...' : 'নির্বাচিত পণ্য মুছুন'}</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              সিলেকশন বাতিল
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E2ECE3] shadow-xs overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6FAF7] border-b border-[#E2ECE3] text-[#4B6354] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3.5 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === filteredProducts.length}
                      onChange={handleToggleSelectAll}
                      title="সবগুলো নির্বাচন করুন"
                      className="w-4 h-4 rounded accent-[#08542C] cursor-pointer"
                    />
                  </th>
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
                  <tr
                    key={prod._id}
                    className={`hover:bg-gray-50/70 transition-colors ${
                      selectedIds.includes(prod._id.toString()) ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    {/* Checkbox Column */}
                    <td className="px-4 py-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(prod._id.toString())}
                        onChange={() => handleToggleSelectOne(prod._id)}
                        className="w-4 h-4 rounded accent-[#08542C] cursor-pointer"
                      />
                    </td>

                    {/* Image & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E2ECE3]">
                          <Image
                            src={prod.images?.[0] || '/products/koti_set_navy_gold.jpg'}
                            alt={prod.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized
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
                      <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-medium text-[11px]">
                        {prod.category}
                      </span>
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
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
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
          <div className="bg-white rounded-3xl border border-[#E2ECE3] shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-[#0F2417]">
                  {editingProduct ? 'পণ্য সম্পাদনা (Edit Product)' : 'নতুন পণ্য যোগ করুন (Create Product)'}
                </h2>
                <p className="text-xs text-[#4B6354]">
                  ছবি Cloudinary-তে আপলোড করুন এবং ক্যাটাগরি নির্বাচন অনুযায়ী সংশ্লিষ্ট ফিল্ডগুলো পূরণ করুন।
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
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

            <form onSubmit={handleSaveProduct} className="space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-[#0F2417] mb-1">
                  পণ্যের নাম <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: প্রিমিয়াম ওয়্যারলেস ব্লুটুথ ৫.৩ ইয়ারবাডস"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] focus:bg-white text-xs outline-none focus:border-[#08542C]"
                />
              </div>

              {/* Category Selector with Category-Specific Notice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F2417] mb-1">
                    ক্যাটাগরি নির্বাচন করুন <span className="text-[#DC2626]">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none focus:border-[#08542C] font-semibold text-zinc-900"
                  >
                    {availableCategories.map(c => (
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
                    placeholder="wireless-earbuds-tws"
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

              {/* CLOUDINARY IMAGE UPLOADER COMPONENT */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2ECE3] shadow-xs">
                <ImageUploader
                  value={formData.images}
                  onChange={(newImages) => setFormData({ ...formData, images: newImages })}
                  multiple={true}
                  folder="bichitra_shop/products"
                  label="পণ্যের ছবি (সরাসরি Cloudinary আপলোড বা ইমেজ লিংক)"
                />
              </div>

              {/* DYNAMIC CATEGORY-SPECIFIC VARIANT FIELDS */}
              <div className="p-4 rounded-2xl bg-[#F6FAF7] border border-[#E2ECE3] space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                  <Sliders className="w-4 h-4 text-black stroke-[2]" />
                  <span className="text-xs font-bold text-zinc-900">
                    {isFashion ? 'পোশাকের সাইজ ও কালার ভ্যারিয়েন্ট' :
                     isGadget ? 'গ্যাজেট ওয়ারেন্টি, মডেল ও স্পেসিফিকেশন' :
                     isAppliance ? 'হোম অ্যাপ্লায়েন্স ক্যাপাসিটি, পাওয়ার ও ওয়ারেন্টি' :
                     isOrganic ? 'খাদ্যপণ্যের নিট ওজন ও খাঁটি হওয়ার নিশ্চয়তা' :
                     'পণ্যের বৈশিষ্ট্য ও ভ্যারিয়েন্ট'}
                  </span>
                </div>

                {/* 1. Fashion Category: Show Sizes & Colors */}
                {isFashion && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0F2417] mb-1">
                        পোশাকের সাইজসমূহ (কমা দিয়ে আলাদা করুন)
                      </label>
                      <input
                        type="text"
                        placeholder="M, L, XL, XXL"
                        value={formData.sizesInput}
                        onChange={(e) => setFormData({ ...formData, sizesInput: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-white text-xs outline-none focus:border-[#08542C]"
                      />
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] text-zinc-500 font-semibold">কুইক প্রিসেট:</span>
                        {['M, L, XL, XXL', '40, 42, 44', '52, 54, 56', 'Free Size'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setFormData({ ...formData, sizesInput: preset })}
                            className="px-2 py-0.5 rounded-md bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-[10px] font-bold"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F2417] mb-1">
                        কালারসমূহ (কমা দিয়ে আলাদা করুন)
                      </label>
                      <input
                        type="text"
                        placeholder="ব্ল্যাক, নেভি ব্লু, মেরুন"
                        value={formData.colorsInput}
                        onChange={(e) => setFormData({ ...formData, colorsInput: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-white text-xs outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Gadgets Category: Show Warranty, Colors/Models, Specs */}
                {isGadget && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#0F2417] mb-1">
                          ওয়ারেন্টি নিশ্চয়তা (Warranty)
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: ৬ মাস রিপ্লেসমেন্ট ওয়ারেন্টি"
                          value={formData.warranty}
                          onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-white text-xs outline-none focus:border-[#08542C]"
                        />
                        <div className="flex flex-wrap gap-1 mt-1">
                          {['৬ মাস রিপ্লেসমেন্ট', '১ বছর অফিসিয়াল', '৭ দিনের রিটার্ন গ্যারান্টি'].map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => setFormData({ ...formData, warranty: w })}
                              className="px-1.5 py-0.5 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-[10px]"
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0F2417] mb-1">
                          কালার / মডেল (কমা দিয়ে আলাদা করুন)
                        </label>
                        <input
                          type="text"
                          placeholder="ম্যাট ব্ল্যাক, সিলভার, হোয়াইট"
                          value={formData.colorsInput}
                          onChange={(e) => setFormData({ ...formData, colorsInput: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-white text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F2417] mb-1">
                        মূল স্পেসিফিকেশন / ফিচার (Key Specs)
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: ব্লুটুথ ৫.৩, ২০ ঘণ্টা প্লেব্যাক, ডিজিটাল ডিসপ্লে"
                        value={formData.specs}
                        onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-white text-xs outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Home Appliances Category: Capacity/Power, Warranty, Colors */}
                {isAppliance && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#0F2417] mb-1">
                          ক্যাপাসিটি / পাওয়ার / ভলিউম (কমা দিয়ে আলাদা করুন)
                        </label>
                        <input
                          type="text"
                          placeholder="1.8 Litre, 1000 Watt, 2.5L"
                          value={formData.capacitiesInput}
                          onChange={(e) => setFormData({ ...formData, capacitiesInput: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-white text-xs outline-none focus:border-[#08542C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0F2417] mb-1">
                          ওয়ারেন্টি নিশ্চয়তা (Warranty)
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: ১ বছর মোটর ওয়ারেন্টি"
                          value={formData.warranty}
                          onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-white text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F2417] mb-1">
                        কালারসমূহ (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        placeholder="সিলভার-ব্ল্যাক, স্টেইনলেস স্টিল"
                        value={formData.colorsInput}
                        onChange={(e) => setFormData({ ...formData, colorsInput: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-white text-xs outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Organic Food: Pack Size / Net Weight */}
                {isOrganic && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0F2417] mb-1">
                        প্যাক সাইজ / নিট ওজন (কমা দিয়ে আলাদা করুন)
                      </label>
                      <input
                        type="text"
                        placeholder="২৫০ গ্রাম, ৫০০ গ্রাম, ১ কেজি, ১ লিটার"
                        value={formData.weightsInput}
                        onChange={(e) => setFormData({ ...formData, weightsInput: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-white text-xs outline-none focus:border-[#08542C]"
                      />
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] text-zinc-500 font-semibold">কুইক অপশন:</span>
                        {['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি', '১ লিটার', 'কম্বো প্যাক'].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setFormData({ ...formData, weightsInput: w })}
                            className="px-2 py-0.5 rounded-md bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-[10px] font-bold"
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F2417] mb-1">
                        খাঁটি হওয়ার নিশ্চয়তা ও বৈশিষ্ট্য
                      </label>
                      <input
                        type="text"
                        placeholder="১০০% খাঁটি, প্রাকৃতিক সুন্দরবনের মৌচাকের মধু"
                        value={formData.specs}
                        onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-white text-xs outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 5. Home & Living */}
                {isHomeLiving && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#0F2417] mb-1">
                          ডাইমেনশন / সাইজ
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: 60 x 40 cm"
                          value={formData.specs}
                          onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-white text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0F2417] mb-1">
                          কালার / ফিনিশ
                        </label>
                        <input
                          type="text"
                          placeholder="উডেন ব্রাউন, ম্যাট ব্ল্যাক"
                          value={formData.colorsInput}
                          onChange={(e) => setFormData({ ...formData, colorsInput: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E2ECE3] bg-white text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                  className="w-full px-4 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none focus:bg-white focus:border-[#08542C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F2417] mb-1">
                  বিস্তারিত বিবরণ (Full Description) <span className="text-[#DC2626]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="পণ্যের কোয়ালিটি, উপাদান, বৈশিষ্ট্য এবং ওয়ারেন্টি সংক্রান্ত বিস্তারিত তথ্য..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none focus:bg-white focus:border-[#08542C]"
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
                    https://bichitrashop.vercel.app/products/{formData.slug || 'product-slug'}
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
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
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

      {/* Delete All Products Confirmation Modal */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-red-200 shadow-2xl w-full max-w-md p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900">
                  সকল পণ্য মুছে ফেলতে চান?
                </h3>
                <p className="text-xs text-red-600 font-bold">
                  এই কাজটি সতর্কতার সাথে সম্পন্ন করুন
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-1">
              <p className="font-semibold">
                আপনার স্টোরে বর্তমানে মোট <span className="font-bold underline">{products.length} টি পণ্য</span> রয়েছে।
              </p>
              <p className="text-[11px] text-red-700">
                সকল পণ্য আর্কাইভ বা ডিলিট হয়ে যাবে। নিশ্চিত করতে নিচের ঘরে বড় হাতের অক্ষরে <span className="font-black bg-white px-1.5 py-0.5 rounded border border-red-300">DELETE</span> লিখুন:
              </p>
            </div>

            <div>
              <input
                type="text"
                placeholder="এখানে DELETE লিখুন..."
                value={deleteAllConfirmText}
                onChange={(e) => setDeleteAllConfirmText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-red-600 text-sm font-mono tracking-widest text-center uppercase outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteAllModalOpen(false);
                  setDeleteAllConfirmText('');
                }}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                disabled={deleteAllConfirmText.trim() !== 'DELETE' || deletingBulk}
                onClick={handleDeleteAll}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {deletingBulk && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>হ্যাঁ, সকল পণ্য মুছুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
