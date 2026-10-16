// app/admin/orders/OrderManager.jsx
'use client';

import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';

export default function OrderManager({ initialOrders = [] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Details Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState('');

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
        setOrders(orders.map(o => o.orderReference === orderId || o._id === orderId ? {
          ...o,
          orderStatus: newStatus,
          statusHistory: data.statusHistory
        } : o));

        if (selectedOrder) {
          setSelectedOrder({
            ...selectedOrder,
            orderStatus: newStatus,
            statusHistory: data.statusHistory
          });
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2ECE3] pb-6">
        <div>
          <span className="text-xs font-bold text-[#08542C] uppercase tracking-wider">
            সেলস ও ডেলিভারি
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2417] mt-0.5">
            অর্ডার ব্যবস্থাপনা (Orders)
          </h1>
          <p className="text-xs text-[#4B6354] mt-1">
            মোট {orders.length} টি গ্রাহক অর্ডার নথিবদ্ধ রয়েছে
          </p>
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
                  <th className="px-6 py-3.5">অর্ডার আইডি</th>
                  <th className="px-6 py-3.5">গ্রাহকের নাম ও ফোন</th>
                  <th className="px-6 py-3.5">পণ্য ও পরিমাণ</th>
                  <th className="px-6 py-3.5">মোট মূল্য</th>
                  <th className="px-6 py-3.5">স্ট্যাটাস</th>
                  <th className="px-6 py-3.5">তারিখ</th>
                  <th className="px-6 py-3.5 text-right">বিবরণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredOrders.map((ord) => {
                  const firstItem = ord.items?.[0] || {};
                  return (
                    <tr key={ord.orderReference} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#08542C]">
                        {ord.orderReference}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0F2417]">{ord.customer?.name}</div>
                        <a
                          href={`tel:${ord.customer?.phone}`}
                          className="text-[11px] text-gray-500 font-mono flex items-center gap-1 hover:text-[#08542C]"
                        >
                          <Phone className="w-3 h-3 text-[#22C55E]" />
                          <span>{ord.customer?.phone}</span>
                        </a>
                      </td>

                      <td className="px-6 py-4">
                        <div className="line-clamp-1 max-w-[200px] text-[#0F2417] font-semibold">
                          {firstItem.productName}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {firstItem.quantity} টি {firstItem.variant?.size ? `(সাইজ: ${firstItem.variant.size})` : ''}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-black text-[#DC2626]">
                        {formatBDT(ord.total)}
                        <span className="block text-[10px] text-gray-400 font-normal">
                          ক্যাশ অন ডেলিভারি
                        </span>
                      </td>

                      <td className="px-6 py-4">
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

                      <td className="px-6 py-4 text-gray-400 text-[11px]">
                        {new Date(ord.createdAt).toLocaleDateString('bn-BD', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-[#08542C] font-bold text-xs hover:bg-[#E8F5EC] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>বিস্তারিত</span>
                        </button>
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

      {/* Order Details Modal with Audit History */}
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
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
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

            {/* Item Breakdown (Immutable Snapshot) */}
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
                    {formatBDT(item.subtotal)}
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
                    className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
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
    </div>
  );
}
