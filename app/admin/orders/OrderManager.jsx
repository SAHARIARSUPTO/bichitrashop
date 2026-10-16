// app/admin/orders/OrderManager.jsx
'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { formatBDT } from '@/lib/pricing';
import {
  Search,
  Filter,
  Eye,
  Clock,
  Phone,
  MapPin,
  X,
  CheckCircle,
  Truck,
  AlertCircle,
  Loader2,
  Calendar,
  Edit,
  Trash2,
  FileText,
  PlusCircle,
  RefreshCw,
  Printer,
  DollarSign,
  ShoppingBag,
  PackageCheck,
  Check,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function OrderManager({ initialOrders = [], initialProducts = [] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Revenue Sync State
  const [syncing, setSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState('');

  // Modals State
  const [selectedOrder, setSelectedOrder] = useState(null); // Details modal
  const [editingOrder, setEditingOrder] = useState(null); // Edit modal
  const [invoiceOrder, setInvoiceOrder] = useState(null); // Invoice preview modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Manual order modal

  // Action Loading States
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  // Manual Order Form State
  const [manualForm, setManualForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerDistrict: 'ঢাকা (Dhaka)',
    customerNotes: '',
    selectedProductId: initialProducts[0]?._id || '',
    selectedVariantSize: '',
    quantity: 1,
    customUnitPrice: '',
    deliveryZone: 'inside_dhaka',
    deliveryCharge: 70,
    discount: 0,
    orderStatus: 'pending',
    paymentStatus: 'unpaid'
  });

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-purple-50 text-purple-700 border-purple-200',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200'
  };

  const statusNames = {
    pending: 'অপেক্ষমাণ (Pending)',
    confirmed: 'নিশ্চিত (Confirmed)',
    processing: 'প্রস্তুত হচ্ছে (Processing)',
    shipped: 'ডেলিভারিতে পাঠানো (Shipped)',
    delivered: 'সফলভাবে ডেলিভার্ড (Delivered)',
    cancelled: 'বাতিলকৃত (Cancelled)'
  };

  // Dynamically computed revenue metrics from live state
  const revenueMetrics = useMemo(() => {
    let totalRevenue = 0;
    let deliveredRevenue = 0;
    let pendingOrders = 0;
    let deliveredOrders = 0;

    orders.forEach(ord => {
      const tot = Number(ord.total) || 0;
      if (ord.orderStatus !== 'cancelled') {
        totalRevenue += tot;
      }
      if (ord.orderStatus === 'delivered') {
        deliveredRevenue += tot;
        deliveredOrders++;
      } else if (ord.orderStatus === 'pending') {
        pendingOrders++;
      }
    });

    return {
      totalOrders: orders.length,
      totalRevenue,
      deliveredRevenue,
      pendingOrders,
      deliveredOrders
    };
  }, [orders]);

  // Sync Revenue & Orders from Server API
  const handleSyncRevenue = async () => {
    setSyncing(true);
    setSyncSuccessMessage('');
    try {
      const [syncRes, ordersRes] = await Promise.all([
        fetch('/api/admin/orders/sync'),
        fetch('/api/admin/orders?limit=100')
      ]);

      const syncData = await syncRes.json();
      const ordersData = await ordersRes.json();

      if (ordersRes.ok && ordersData.success) {
        setOrders(ordersData.orders || []);
      }

      if (syncRes.ok && syncData.success) {
        setSyncSuccessMessage('রাজস্ব ও সকল অর্ডার রিয়েল-টাইমে সফলভাবে সিঙ্ক হয়েছে!');
        setTimeout(() => setSyncSuccessMessage(''), 4000);
      }
    } catch (err) {
      alert('রাজস্ব সিঙ্ক করতে সমস্যা হয়েছে।');
    } finally {
      setSyncing(false);
    }
  };

  // Update Status handler
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (updatingStatus) return;
    setUpdatingStatus(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note: statusNote })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev => prev.map(o => (o.orderReference === orderId || o._id === orderId ? {
          ...o,
          orderStatus: newStatus,
          statusHistory: data.statusHistory
        } : o)));

        if (selectedOrder) {
          setSelectedOrder(prev => ({
            ...prev,
            orderStatus: newStatus,
            statusHistory: data.statusHistory
          }));
        }
        setStatusNote('');
      } else {
        alert(data.error || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।');
      }
    } catch {
      alert('সার্ভার যোগাযোগে ত্রুটি ঘটেছে।');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete Order Handler
  const handleDeleteOrder = async (order) => {
    if (!confirm(`আপনি কি নিশ্চিত যে অর্ডার "${order.orderReference}" মুছে ফেলতে চান?`)) {
      return;
    }
    const orderId = order._id || order.orderReference;
    setDeletingOrderId(orderId);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev => prev.filter(o => o._id !== orderId && o.orderReference !== order.orderReference));
        if (selectedOrder?.orderReference === order.orderReference) {
          setSelectedOrder(null);
        }
      } else {
        alert(data.error || 'অর্ডার মুছতে ব্যর্থ হয়েছে।');
      }
    } catch {
      alert('সার্ভার যোগাযোগে সমস্যা হয়েছে।');
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Save Edit Order Handler
  const handleSaveEditOrder = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    setSavingEdit(true);

    try {
      const orderId = editingOrder._id || editingOrder.orderReference;
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: editingOrder.customer,
          items: editingOrder.items,
          deliveryCharge: Number(editingOrder.deliveryCharge),
          discount: Number(editingOrder.discount),
          orderStatus: editingOrder.orderStatus,
          paymentStatus: editingOrder.paymentStatus,
          editNote: editingOrder.editAuditNote || 'অ্যাডমিন প্যানেল থেকে অর্ডার তথ্য আপডেট করা হয়েছে।'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev => prev.map(o => (o._id === orderId || o.orderReference === editingOrder.orderReference ? data.order : o)));
        if (selectedOrder?.orderReference === editingOrder.orderReference) {
          setSelectedOrder(data.order);
        }
        setEditingOrder(null);
      } else {
        alert(data.error || 'অর্ডার আপডেট ব্যর্থ হয়েছে।');
      }
    } catch {
      alert('সার্ভার যোগাযোগে সমস্যা হয়েছে।');
    } finally {
      setSavingEdit(false);
    }
  };

  // Handle Manual Order Creation
  const handleCreateManualOrder = async (e) => {
    e.preventDefault();
    if (creatingOrder) return;

    if (!manualForm.customerName.trim() || !manualForm.customerPhone.trim()) {
      alert('অনুগ্রহ করে গ্রাহকের নাম ও মোবাইল নম্বর পূরণ করুন।');
      return;
    }

    const selectedProd = initialProducts.find(p => (p._id === manualForm.selectedProductId || p.slug === manualForm.selectedProductId)) || initialProducts[0];
    const unitPrice = manualForm.customUnitPrice ? Number(manualForm.customUnitPrice) : (selectedProd?.price || 1500);

    const newItem = {
      productId: selectedProd?._id || 'manual',
      productName: selectedProd?.name || 'কাস্টম পণ্য',
      slug: selectedProd?.slug || 'custom-product',
      image: selectedProd?.images?.[0] || '/products/koti_set_navy_gold.jpg',
      unitPrice,
      quantity: Number(manualForm.quantity) || 1,
      variant: manualForm.selectedVariantSize ? { size: manualForm.selectedVariantSize } : null
    };

    setCreatingOrder(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: manualForm.customerName.trim(),
            phone: manualForm.customerPhone.trim(),
            address: manualForm.customerAddress.trim() || 'ঠিকানা দেওয়া হয়নি',
            district: manualForm.customerDistrict.trim(),
            notes: manualForm.customerNotes.trim()
          },
          items: [newItem],
          deliveryCharge: Number(manualForm.deliveryCharge),
          discount: Number(manualForm.discount),
          deliveryZone: manualForm.deliveryZone,
          orderStatus: manualForm.orderStatus,
          paymentStatus: manualForm.paymentStatus
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(prev => [data.order, ...prev]);
        setIsCreateModalOpen(false);
        // Reset form
        setManualForm({
          customerName: '',
          customerPhone: '',
          customerAddress: '',
          customerDistrict: 'ঢাকা (Dhaka)',
          customerNotes: '',
          selectedProductId: initialProducts[0]?._id || '',
          selectedVariantSize: '',
          quantity: 1,
          customUnitPrice: '',
          deliveryZone: 'inside_dhaka',
          deliveryCharge: 70,
          discount: 0,
          orderStatus: 'pending',
          paymentStatus: 'unpaid'
        });
      } else {
        alert(data.error || 'ম্যানুয়াল অর্ডার তৈরি করতে ব্যর্থ হয়েছে।');
      }
    } catch {
      alert('সার্ভার যোগাযোগে সমস্যা হয়েছে।');
    } finally {
      setCreatingOrder(false);
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter(ord => {
    if (selectedStatus !== 'all' && ord.orderStatus !== selectedStatus) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      return (
        (ord.orderReference && ord.orderReference.toLowerCase().includes(term)) ||
        (ord.customer?.name && ord.customer.name.toLowerCase().includes(term)) ||
        (ord.customer?.phone && ord.customer.phone.includes(term)) ||
        (ord.customer?.district && ord.customer.district.toLowerCase().includes(term))
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2ECE3] pb-6">
        <div>
          <span className="text-xs font-bold text-[#08542C] uppercase tracking-wider">
            সেলস ও ডেলিভারি অপারেশন
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2417] mt-0.5">
            অর্ডার ব্যবস্থাপনা ও ইনভয়েস
          </h1>
          <p className="text-xs text-[#4B6354] mt-1">
            মোট {orders.length} টি গ্রাহক অর্ডার নথিবদ্ধ রয়েছে • রাজস্ব ও স্থিতি রিয়েল-টাইম সিঙ্কযোগ্য
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncRevenue}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="লাইভ ডাটাবেজ থেকে রাজস্ব সিঙ্ক করুন"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#08542C] ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'সিঙ্ক হচ্ছে...' : 'রাজস্ব সিঙ্ক করুন'}</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08542C] hover:bg-[#064423] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>ম্যানুয়াল অর্ডার তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* Sync Success Feedback Toast */}
      {syncSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncSuccessMessage}</span>
        </div>
      )}

      {/* KPI Cards: Synchronized Revenue & Order Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2ECE3] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-500">মোট সক্রিয় রাজস্ব</span>
            <div className="text-lg sm:text-2xl font-black text-[#0F2417] mt-0.5">
              {formatBDT(revenueMetrics.totalRevenue)}
            </div>
            <span className="text-[10px] text-zinc-400">বাতিলকৃত ব্যতীত</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E8F5EC] flex items-center justify-center text-[#08542C]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2ECE3] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-500">ডেলিভার্ড বিক্রয়</span>
            <div className="text-lg sm:text-2xl font-black text-[#16A34A] mt-0.5">
              {formatBDT(revenueMetrics.deliveredRevenue)}
            </div>
            <span className="text-[10px] text-[#16A34A] font-bold">
              {revenueMetrics.deliveredOrders} টি ডেলিভার্ড
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#16A34A]">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2ECE3] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-500">অপেক্ষমাণ (Pending)</span>
            <div className="text-lg sm:text-2xl font-black text-[#DC2626] mt-0.5">
              {revenueMetrics.pendingOrders} টি
            </div>
            <span className="text-[10px] text-[#DC2626] font-bold">প্রসেসিং প্রয়োজন</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#DC2626]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2ECE3] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-500">সর্বমোট অর্ডার</span>
            <div className="text-lg sm:text-2xl font-black text-[#0F2417] mt-0.5">
              {revenueMetrics.totalOrders} টি
            </div>
            <span className="text-[10px] text-zinc-400">লাইভ ডাটাবেজ</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2ECE3] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="রেফারেন্স, গ্রাহকের নাম বা মোবাইল খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none focus:bg-white focus:border-[#08542C]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] text-xs outline-none font-semibold text-[#0F2417]"
          >
            <option value="all">সকল অর্ডার স্ট্যাটাস</option>
            <option value="pending">অপেক্ষমাণ (Pending)</option>
            <option value="confirmed">নিশ্চিত (Confirmed)</option>
            <option value="processing">প্রস্তুত হচ্ছে (Processing)</option>
            <option value="shipped">ডেলিভারিতে পাঠানো (Shipped)</option>
            <option value="delivered">ডেলিভার্ড (Delivered)</option>
            <option value="cancelled">বাতিলকৃত (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E2ECE3] shadow-xs overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6FAF7] border-b border-[#E2ECE3] text-[#4B6354] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-5 py-3.5">অর্ডার আইডি</th>
                  <th className="px-5 py-3.5">গ্রাহকের নাম ও ফোন</th>
                  <th className="px-5 py-3.5">পণ্য ও পরিমাণ</th>
                  <th className="px-5 py-3.5">মোট মূল্য</th>
                  <th className="px-5 py-3.5">স্ট্যাটাস</th>
                  <th className="px-5 py-3.5">তারিখ</th>
                  <th className="px-5 py-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredOrders.map((ord) => {
                  const firstItem = ord.items?.[0] || {};
                  const isDeletingThis = deletingOrderId === (ord._id || ord.orderReference);

                  return (
                    <tr key={ord.orderReference} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-[#08542C]">
                        {ord.orderReference}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-bold text-[#0F2417]">{ord.customer?.name}</div>
                        <a
                          href={`tel:${ord.customer?.phone}`}
                          className="text-[11px] text-gray-500 font-mono flex items-center gap-1 hover:text-[#08542C]"
                        >
                          <Phone className="w-3 h-3 text-[#22C55E]" />
                          <span>{ord.customer?.phone}</span>
                        </a>
                      </td>

                      <td className="px-5 py-4">
                        <div className="line-clamp-1 max-w-[200px] text-[#0F2417] font-semibold">
                          {firstItem.productName}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {firstItem.quantity} টি {firstItem.variant?.size ? `(সাইজ: ${firstItem.variant.size})` : ''}
                          {ord.items?.length > 1 && ` (+${ord.items.length - 1} আরও)`}
                        </div>
                      </td>

                      <td className="px-5 py-4 font-black text-[#DC2626]">
                        {formatBDT(ord.total)}
                        <span className="block text-[10px] text-gray-400 font-normal">
                          {ord.paymentStatus === 'paid' ? 'পরিশোধিত' : 'ক্যাশ অন ডেলিভারি'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateStatus(ord.orderReference, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border outline-none cursor-pointer ${
                            statusColors[ord.orderStatus] || 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          <option value="pending">অপেক্ষমাণ (Pending)</option>
                          <option value="confirmed">নিশ্চিত (Confirmed)</option>
                          <option value="processing">প্রস্তুত হচ্ছে (Processing)</option>
                          <option value="shipped">শিপড (Shipped)</option>
                          <option value="delivered">ডেলিভার্ড (Delivered)</option>
                          <option value="cancelled">বাতিল (Cancelled)</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 text-gray-400 text-[11px]">
                        {new Date(ord.createdAt).toLocaleDateString('bn-BD', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Invoice PDF / Print Button */}
                          <button
                            onClick={() => setInvoiceOrder(ord)}
                            title="ইনভয়েস চালান ও PDF"
                            className="p-1.5 rounded-lg border border-gray-200 text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-zinc-800" />
                          </button>

                          {/* Edit Order Button */}
                          <button
                            onClick={() => setEditingOrder(JSON.parse(JSON.stringify(ord)))}
                            title="অর্ডার এডিট করুন"
                            className="p-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* View Details Button */}
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            title="বিস্তারিত দেখুন"
                            className="p-1.5 rounded-lg border border-gray-200 text-[#08542C] hover:bg-[#E8F5EC] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Order Button */}
                          <button
                            onClick={() => handleDeleteOrder(ord)}
                            disabled={isDeletingThis}
                            title="অর্ডার মুছে ফেলুন"
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isDeletingThis ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#4B6354]">
            কোনো অর্ডার খুঁজে পাওয়া যায়নি।
          </div>
        )}
      </div>

      {/* MODAL 1: VIEW ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E2ECE3] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#DC2626]">
                  {selectedOrder.orderReference}
                </span>
                <h2 className="text-xl font-black text-[#0F2417] mt-0.5">
                  অর্ডারের বিস্তারিত তথ্য
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Information */}
            <div className="p-4 rounded-2xl bg-[#F6FAF7] border border-[#E2ECE3] space-y-2 text-xs">
              <h3 className="font-bold text-sm text-[#0F2417] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#08542C]" />
                <span>গ্রাহক ও ডেলিভারি ঠিকানা</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-gray-500 block">নাম:</span>
                  <span className="font-bold text-[#0F2417]">{selectedOrder.customer.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">মোবাইল:</span>
                  <a href={`tel:${selectedOrder.customer.phone}`} className="font-bold text-[#08542C] underline">
                    {selectedOrder.customer.phone}
                  </a>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block">ঠিকানা:</span>
                  <span className="font-medium text-[#0F2417]">
                    {selectedOrder.customer.address}, {selectedOrder.customer.district}
                  </span>
                </div>
                {selectedOrder.customer.notes && (
                  <div className="col-span-2 pt-1 border-t border-gray-200">
                    <span className="text-gray-500 block">গ্রাহকের নোট:</span>
                    <span className="italic text-[#0F2417]">"{selectedOrder.customer.notes}"</span>
                  </div>
                )}
              </div>
            </div>

            {/* Item Breakdown */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#4B6354]">
                অর্ডারকৃত পণ্য
              </h3>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-200">
                      <Image
                        src={item.image || '/products/koti_set_navy_gold.jpg'}
                        alt={item.productName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-[#0F2417]">{item.productName}</div>
                      <div className="text-[11px] text-gray-500">
                        {formatBDT(item.unitPrice)} × {item.quantity} টি
                        {item.variant?.size && ` | সাইজ: ${item.variant.size}`}
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-[#0F2417]">
                    {formatBDT(item.subtotal || item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Snapshot */}
            <div className="p-4 rounded-2xl bg-[#FDFEFA] border border-gray-200 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-500">
                <span>সাবটোটাল</span>
                <span className="font-semibold text-gray-800">{formatBDT(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-semibold text-gray-800">{formatBDT(selectedOrder.deliveryCharge)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>ডিসকাউন্ট</span>
                  <span>- {formatBDT(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-[#0F2417] pt-2 border-t border-dashed border-gray-200">
                <span>সর্বমোট প্রদেয় টাকা:</span>
                <span className="text-[#DC2626] text-base">{formatBDT(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Status Transition Control */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-[#0F2417]">
                অর্ডার স্ট্যাটাস পরিবর্তন করুন:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(statusNames).map(([key, name]) => (
                  <button
                    key={key}
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus(selectedOrder.orderReference, key)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      selectedOrder.orderStatus === key
                        ? 'bg-[#08542C] text-white border-[#08542C] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Audit History */}
            {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-[#4B6354] uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>অর্ডার টাইমলাইন ও হিস্ট্রি</span>
                </h4>
                <div className="space-y-2 text-xs">
                  {selectedOrder.statusHistory.map((hist, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px]">
                      <div className="flex justify-between text-gray-500">
                        <span className="font-bold text-[#08542C] uppercase">{hist.status}</span>
                        <span>
                          {new Date(hist.timestamp).toLocaleDateString('bn-BD', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-0.5">{hist.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ORDER MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E2ECE3] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#08542C]">
                  {editingOrder.orderReference}
                </span>
                <h2 className="text-xl font-black text-[#0F2417] mt-0.5">
                  অর্ডার তথ্য এডিট করুন
                </h2>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditOrder} className="space-y-4 text-xs">
              {/* Customer Fields */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="font-bold text-zinc-900 block text-xs">গ্রাহকের তথ্য</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">গ্রাহকের নাম</label>
                    <input
                      type="text"
                      required
                      value={editingOrder.customer?.name || ''}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        customer: { ...editingOrder.customer, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">মোবাইল নম্বর</label>
                    <input
                      type="text"
                      required
                      value={editingOrder.customer?.phone || ''}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        customer: { ...editingOrder.customer, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">ডেলিভারি ঠিকানা</label>
                    <input
                      type="text"
                      required
                      value={editingOrder.customer?.address || ''}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        customer: { ...editingOrder.customer, address: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">জেলা (District)</label>
                    <input
                      type="text"
                      value={editingOrder.customer?.district || ''}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        customer: { ...editingOrder.customer, district: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">গ্রাহকের নোট</label>
                    <input
                      type="text"
                      value={editingOrder.customer?.notes || ''}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        customer: { ...editingOrder.customer, notes: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>
                </div>
              </div>

              {/* Order Items Editing */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="font-bold text-zinc-900 block text-xs">পণ্য ও মূল্য সংশোধন</span>
                {editingOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-zinc-200 space-y-2">
                    <div className="font-bold text-zinc-900">{item.productName}</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-zinc-500">একক মূল্য (৳)</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => {
                            const newItems = [...editingOrder.items];
                            newItems[idx].unitPrice = Number(e.target.value);
                            newItems[idx].subtotal = Number(e.target.value) * (newItems[idx].quantity || 1);
                            setEditingOrder({ ...editingOrder, items: newItems });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500">পরিমাণ</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...editingOrder.items];
                            newItems[idx].quantity = Math.max(1, Number(e.target.value));
                            newItems[idx].subtotal = (newItems[idx].unitPrice || 0) * Math.max(1, Number(e.target.value));
                            setEditingOrder({ ...editingOrder, items: newItems });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500">সাইজ/ভেরিয়েন্ট</label>
                        <input
                          type="text"
                          value={item.variant?.size || ''}
                          onChange={(e) => {
                            const newItems = [...editingOrder.items];
                            newItems[idx].variant = { ...newItems[idx].variant, size: e.target.value };
                            setEditingOrder({ ...editingOrder, items: newItems });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Charge, Discount & Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-700 mb-1">ডেলিভারি চার্জ</label>
                  <input
                    type="number"
                    value={editingOrder.deliveryCharge ?? 70}
                    onChange={(e) => setEditingOrder({ ...editingOrder, deliveryCharge: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-700 mb-1">ডিসকাউন্ট (৳)</label>
                  <input
                    type="number"
                    value={editingOrder.discount ?? 0}
                    onChange={(e) => setEditingOrder({ ...editingOrder, discount: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-700 mb-1">অর্ডার স্ট্যাটাস</label>
                  <select
                    value={editingOrder.orderStatus}
                    onChange={(e) => setEditingOrder({ ...editingOrder, orderStatus: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-semibold"
                  >
                    <option value="pending">অপেক্ষমাণ (Pending)</option>
                    <option value="confirmed">নিশ্চিত (Confirmed)</option>
                    <option value="processing">প্রস্তুত হচ্ছে (Processing)</option>
                    <option value="shipped">শিপড (Shipped)</option>
                    <option value="delivered">ডেলিভার্ড (Delivered)</option>
                    <option value="cancelled">বাতিল (Cancelled)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-700 mb-1">পেমেন্ট স্ট্যাটাস</label>
                  <select
                    value={editingOrder.paymentStatus}
                    onChange={(e) => setEditingOrder({ ...editingOrder, paymentStatus: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-semibold"
                  >
                    <option value="unpaid">অপরিশোধিত (Unpaid)</option>
                    <option value="paid">পরিশোধিত (Paid)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-700 font-bold hover:bg-zinc-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-[#08542C] hover:bg-[#064423] text-white font-bold shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {savingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>পরিবর্তন সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INVOICE PDF & PRINT PREVIEW MODAL */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Modal Controls (Hidden when printed) */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 no-print">
              <div>
                <span className="text-xs font-bold text-[#08542C]">অফিসিয়াল চালান ও ইনভয়েস</span>
                <h3 className="text-lg font-black text-zinc-900">
                  চালান প্রিভিউ • {invoiceOrder.orderReference}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08542C] hover:bg-[#064423] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট / PDF ডাউনলোড</span>
                </button>
                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE INVOICE SHEET (Styled cleanly for print and view) */}
            <div
              id="printable-invoice"
              className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-2xs space-y-5 print:space-y-3 text-zinc-900"
            >
              {/* Invoice Header: Logo & Store Info */}
              <div className="flex items-start justify-between border-b-2 border-[#08542C] pb-4 print:pb-2.5">
                <div className="flex items-center gap-3">
                  <div className="relative w-13 h-13 print:w-11 print:h-11 rounded-full overflow-hidden border border-[#08542C]/20 p-0.5 bg-white shrink-0">
                    <Image
                      src="/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png"
                      alt="Bichitra Shop"
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-black text-xl print:text-lg text-[#DC2626]">Bichitra</span>
                      <span className="font-black text-xl print:text-lg text-[#08542C]">Shop</span>
                    </div>
                    <p className="text-xs print:text-[11px] font-bold text-zinc-700">বিচিত্র শপ – বিশ্বস্ত পণ্য, স্মার্ট কেনাকাটা</p>
                    <p className="text-[11px] print:text-[10px] text-zinc-500">রহনপুর, চাঁপাইনবাবগঞ্জ • হেল্পলাইন: 01761-674164</p>
                    <p className="text-[10px] print:text-[9px] text-zinc-400">support@bichitrashop.com • bichitrashop.com</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-md bg-[#08542C] text-white font-black text-xs uppercase tracking-widest">
                    ইনভয়েস চালান
                  </span>
                  <div className="text-xs font-mono font-bold text-zinc-900 mt-1">
                    INV-{invoiceOrder.orderReference}
                  </div>
                  <div className="text-[11px] print:text-[10px] text-zinc-500">
                    তারিখ: {new Date(invoiceOrder.createdAt).toLocaleDateString('bn-BD', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Billed To / Customer Details */}
              <div className="grid grid-cols-2 gap-4 text-xs print:text-[11px] bg-zinc-50 p-3.5 print:p-2.5 rounded-xl border border-zinc-200">
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    গ্রাহকের বিবরণ (Billed To):
                  </span>
                  <div className="font-black text-sm print:text-xs text-zinc-900 mt-0.5">{invoiceOrder.customer?.name}</div>
                  <div className="font-mono text-zinc-700 mt-0.5">{invoiceOrder.customer?.phone}</div>
                  <div className="text-zinc-600 mt-0.5">
                    {invoiceOrder.customer?.address}, {invoiceOrder.customer?.district}
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    পেমেন্ট ও ডেলিভারি:
                  </span>
                  <div className="font-bold text-zinc-900">
                    পদ্ধতি: ক্যাশ অন ডেলিভারি (COD)
                  </div>
                  <div>
                    পেমেন্ট স্ট্যাটাস: <span className={`font-bold uppercase ${invoiceOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{invoiceOrder.paymentStatus === 'paid' ? 'পরিশোধিত' : 'অপরিশোধিত'}</span>
                  </div>
                  <div>
                    অর্ডার স্ট্যাটাস: <span className="font-bold">{statusNames[invoiceOrder.orderStatus]?.split(' ')[0] || invoiceOrder.orderStatus}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs print:text-[11px] border border-zinc-200 rounded-xl overflow-hidden">
                <thead className="bg-[#08542C] text-white font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-3 py-2 text-center w-8">#</th>
                    <th className="px-3 py-2">পণ্যের বিবরণ</th>
                    <th className="px-3 py-2 text-center">পরিমাণ</th>
                    <th className="px-3 py-2 text-right">একক মূল্য</th>
                    <th className="px-3 py-2 text-right">মোট (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-medium">
                  {invoiceOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 print:py-1.5 text-center text-zinc-400">{idx + 1}</td>
                      <td className="px-3 py-2 print:py-1.5">
                        <span className="font-bold text-zinc-900 block">{item.productName}</span>
                        {item.variant?.size && (
                          <span className="text-[10px] text-zinc-500">সাইজ: {item.variant.size}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 print:py-1.5 text-center">{item.quantity} টি</td>
                      <td className="px-3 py-2 print:py-1.5 text-right">{formatBDT(item.unitPrice)}</td>
                      <td className="px-3 py-2 print:py-1.5 text-right font-bold text-zinc-900">
                        {formatBDT(item.subtotal || item.unitPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculation Summary */}
              <div className="flex justify-end">
                <div className="w-60 space-y-1 text-xs print:text-[11px]">
                  <div className="flex justify-between text-zinc-600">
                    <span>উপমোট (Subtotal):</span>
                    <span className="font-semibold text-zinc-900">{formatBDT(invoiceOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>ডেলিভারি চার্জ:</span>
                    <span className="font-semibold text-zinc-900">{formatBDT(invoiceOrder.deliveryCharge)}</span>
                  </div>
                  {invoiceOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>ছাড় (Discount):</span>
                      <span>- {formatBDT(invoiceOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-1.5 border-t-2 border-[#08542C] font-black text-sm print:text-xs text-[#0F2417]">
                    <span>সর্বমোট প্রদেয়:</span>
                    <span className="text-[#DC2626] text-base print:text-sm">{formatBDT(invoiceOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Signatures & Seals */}
              <div className="pt-6 print:pt-4 grid grid-cols-2 gap-8 text-xs print:text-[10px] border-t border-dashed border-zinc-200">
                <div className="text-center pt-5 print:pt-3 border-t border-zinc-400 w-36">
                  <span className="text-zinc-600 block">গ্রাহকের স্বাক্ষর</span>
                </div>
                <div className="text-center pt-5 print:pt-3 border-t border-zinc-400 w-36 ml-auto">
                  <span className="text-zinc-900 font-bold block">বিচিত্র শপ কর্তৃপক্ষ</span>
                  <span className="text-[10px] text-[#08542C] font-semibold">অনুমোদিত সিল ও স্বাক্ষর</span>
                </div>
              </div>

              {/* Invoice Footer */}
              <div className="text-center pt-2 print:pt-1 border-t border-zinc-100 text-[10px] print:text-[9px] text-zinc-500">
                বিচিত্র শপের সাথে কেনাকাটা করার জন্য ধন্যবাদ! পার্সেল গ্রহণের সময় পণ্য পরীক্ষা করে মূল্য পরিশোধ করুন।
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE MANUAL ORDER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E2ECE3] shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-[#08542C] uppercase tracking-wider">
                  ম্যানুয়াল বুকিং
                </span>
                <h2 className="text-xl font-black text-[#0F2417] mt-0.5">
                  নতুন অর্ডার তৈরি করুন
                </h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-4 text-xs">
              {/* Customer Info */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="font-bold text-zinc-900 block text-xs">১. গ্রাহকের ঠিকানা ও মোবাইল</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      গ্রাহকের পূর্ণ নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মোঃ সাকিব আহমেদ"
                      value={manualForm.customerName}
                      onChange={(e) => setManualForm({ ...manualForm, customerName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      ১১ ডিজিট মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="017XXXXXXXX"
                      value={manualForm.customerPhone}
                      onChange={(e) => setManualForm({ ...manualForm, customerPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      পূর্ণ ডেলিভারি ঠিকানা <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="বাসা নম্বর, রোড, এলাকা, থানা"
                      value={manualForm.customerAddress}
                      onChange={(e) => setManualForm({ ...manualForm, customerAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">জেলা (District)</label>
                    <input
                      type="text"
                      value={manualForm.customerDistrict}
                      onChange={(e) => setManualForm({ ...manualForm, customerDistrict: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">বিশেষ কোনো নোট</label>
                    <input
                      type="text"
                      placeholder="যেমন: বিকেলে ডেলিভারি দিন"
                      value={manualForm.customerNotes}
                      onChange={(e) => setManualForm({ ...manualForm, customerNotes: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none focus:border-[#08542C]"
                    />
                  </div>
                </div>
              </div>

              {/* Product Selection */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="font-bold text-zinc-900 block text-xs">২. পণ্য নির্বাচন ও পরিমাণ</span>
                
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">পণ্য নির্বাচন করুন</label>
                  <select
                    value={manualForm.selectedProductId}
                    onChange={(e) => {
                      const found = initialProducts.find(p => p._id === e.target.value || p.slug === e.target.value);
                      setManualForm({
                        ...manualForm,
                        selectedProductId: e.target.value,
                        customUnitPrice: found ? found.price : ''
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-semibold outline-none focus:border-[#08542C]"
                  >
                    {initialProducts.map(p => (
                      <option key={p._id || p.slug} value={p._id || p.slug}>
                        {p.name} — {formatBDT(p.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">পরিমাণ (Qty)</label>
                    <input
                      type="number"
                      min="1"
                      value={manualForm.quantity}
                      onChange={(e) => setManualForm({ ...manualForm, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">একক মূল্য (৳)</label>
                    <input
                      type="number"
                      placeholder="অটো বা কাস্টম"
                      value={manualForm.customUnitPrice}
                      onChange={(e) => setManualForm({ ...manualForm, customUnitPrice: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">সাইজ / ভেরিয়েন্ট</label>
                    <input
                      type="text"
                      placeholder="যেমন: L / 52"
                      value={manualForm.selectedVariantSize}
                      onChange={(e) => setManualForm({ ...manualForm, selectedVariantSize: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery & Pricing Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">ডেলিভারি এলাকা</label>
                  <select
                    value={manualForm.deliveryZone}
                    onChange={(e) => {
                      const zone = e.target.value;
                      setManualForm({
                        ...manualForm,
                        deliveryZone: zone,
                        deliveryCharge: zone === 'inside_dhaka' ? 70 : 130
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-semibold outline-none"
                  >
                    <option value="inside_dhaka">ঢাকার ভেতরে (৳৭০)</option>
                    <option value="outside_dhaka">ঢাকার বাইরে (৳১৩০)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">ডেলিভারি চার্জ (৳)</label>
                  <input
                    type="number"
                    value={manualForm.deliveryCharge}
                    onChange={(e) => setManualForm({ ...manualForm, deliveryCharge: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">ডিসকাউন্ট (৳)</label>
                  <input
                    type="number"
                    value={manualForm.discount}
                    onChange={(e) => setManualForm({ ...manualForm, discount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs outline-none"
                  />
                </div>
              </div>

              {/* Total Calculation Preview */}
              {(() => {
                const found = initialProducts.find(p => p._id === manualForm.selectedProductId || p.slug === manualForm.selectedProductId) || initialProducts[0];
                const price = manualForm.customUnitPrice ? Number(manualForm.customUnitPrice) : (found?.price || 1500);
                const sub = price * manualForm.quantity;
                const tot = Math.max(0, sub - Number(manualForm.discount) + Number(manualForm.deliveryCharge));

                return (
                  <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center justify-between font-bold text-xs">
                    <span className="text-zinc-600">
                      সাবটোটাল: {formatBDT(sub)} • ডেলিভারি: ৳{manualForm.deliveryCharge}
                    </span>
                    <span className="text-[#DC2626] text-sm font-black">
                      সর্বমোট: {formatBDT(tot)}
                    </span>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-bold hover:bg-zinc-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={creatingOrder}
                  className="px-6 py-2.5 rounded-xl bg-[#08542C] hover:bg-[#064423] text-white font-bold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {creatingOrder && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>অর্ডার তৈরি করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
