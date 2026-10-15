// app/admin/page.jsx
import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';
import { formatBDT } from '@/lib/pricing';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Settings
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  await initDatabase();
  const products = await getCollection('products');
  const orders = await getCollection('orders');

  const [
    totalProducts,
    publishedProducts,
    draftProducts,
    lowStockCount,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    recentOrdersList
  ] = await Promise.all([
    products.countDocuments({ status: { $ne: 'archived' } }),
    products.countDocuments({ status: 'published' }),
    products.countDocuments({ status: 'draft' }),
    products.countDocuments({ status: 'published', stockQuantity: { $lte: 10 } }),
    orders.countDocuments({}),
    orders.countDocuments({ orderStatus: 'pending' }),
    orders.countDocuments({ orderStatus: 'confirmed' }),
    orders.find({}).sort({ createdAt: -1 }).limit(6).toArray()
  ]);

  // Compute total revenue from non-cancelled orders
  const validOrders = await orders.find({ orderStatus: { $ne: 'cancelled' } }).toArray();
  const totalRevenue = validOrders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);

  return {
    metrics: {
      totalProducts,
      publishedProducts,
      draftProducts,
      lowStockCount,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      totalRevenue
    },
    recentOrders: JSON.parse(JSON.stringify(recentOrdersList))
  };
}

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const { metrics, recentOrders } = await getDashboardData();

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2ECE3] pb-6">
        <div>
          <span className="text-xs font-bold text-[#08542C] uppercase tracking-wider">
            ম্যানেজমেন্ট কন্ট্রোল
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2417] mt-0.5">
            অ্যাডমিন ওভারভিউ ড্যাশবোর্ড
          </h1>
          <p className="text-xs text-[#4B6354] mt-1">
            স্বাগতম, {session.email}! লাইভ ডেটাবেজ থেকে সংগৃহীত রিয়েল-টাইম তথ্য।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08542C] hover:bg-[#064423] text-white font-bold text-xs shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন পণ্য যোগ করুন</span>
          </Link>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2ECE3] text-[#0F2417] font-bold text-xs hover:bg-gray-50 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-[#DC2626]" />
            <span>অর্ডার সমূহ</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2ECE3] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#4B6354]">সর্বমোট বিক্রয়মূল্য</span>
            <div className="text-xl sm:text-2xl font-black text-[#0F2417] mt-1">
              {formatBDT(metrics.totalRevenue)}
            </div>
            <span className="text-[11px] text-[#16A34A] font-bold">ক্যাশ অন ডেলিভারি</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] flex items-center justify-center text-[#08542C]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2ECE3] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#4B6354]">সর্বমোট অর্ডার</span>
            <div className="text-xl sm:text-2xl font-black text-[#0F2417] mt-1">
              {metrics.totalOrders} টি
            </div>
            <span className="text-[11px] text-[#DC2626] font-bold">
              {metrics.pendingOrders} টি অপেক্ষমাণ (Pending)
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Published Products */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2ECE3] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#4B6354]">লাইভ পণ্য (Published)</span>
            <div className="text-xl sm:text-2xl font-black text-[#0F2417] mt-1">
              {metrics.publishedProducts} টি
            </div>
            <span className="text-[11px] text-gray-500 font-medium">
              ড্রাফট: {metrics.draftProducts} টি
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] flex items-center justify-center text-[#08542C]">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2ECE3] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#4B6354]">স্টক সতর্কতা</span>
            <div className="text-xl sm:text-2xl font-black text-[#D97706] mt-1">
              {metrics.lowStockCount} টি পণ্য
            </div>
            <span className="text-[11px] text-[#D97706] font-medium">১০টি বা তার কম স্টক</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E2ECE3] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E2ECE3] flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0F2417]">
              সর্বশেষ গ্রাহক অর্ডারসমূহ
            </h2>
            <p className="text-xs text-[#4B6354]">
              কাস্টমারদের দেওয়া সাম্প্রতিক অর্ডারের তথ্য ও স্ট্যাটাস
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#08542C] hover:underline flex items-center gap-1"
          >
            <span>সকল অর্ডার</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6FAF7] border-b border-[#E2ECE3] text-[#4B6354] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-3.5">অর্ডার রেফারেন্স</th>
                  <th className="px-6 py-3.5">গ্রাহক ও মোবাইল</th>
                  <th className="px-6 py-3.5">পণ্য ও পরিমাণ</th>
                  <th className="px-6 py-3.5">মোট মূল্য</th>
                  <th className="px-6 py-3.5">স্ট্যাটাস</th>
                  <th className="px-6 py-3.5 text-right">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {recentOrders.map((ord) => {
                  const statusColors = {
                    pending: 'bg-amber-50 text-amber-700 border-amber-200',
                    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
                    processing: 'bg-purple-50 text-purple-700 border-purple-200',
                    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    delivered: 'bg-green-50 text-green-700 border-green-200',
                    cancelled: 'bg-red-50 text-red-700 border-red-200'
                  };

                  const statusNames = {
                    pending: 'অপেক্ষমাণ',
                    confirmed: 'নিশ্চিত',
                    processing: 'প্রস্তুত হচ্ছে',
                    shipped: 'শিপড',
                    delivered: 'ডেলিভার্ড',
                    cancelled: 'বাতিল'
                  };

                  const firstItem = ord.items?.[0] || {};

                  return (
                    <tr key={ord.orderReference} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#08542C]">
                        <Link href="/admin/orders" className="hover:underline">
                          {ord.orderReference}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0F2417]">{ord.customer?.name}</div>
                        <div className="text-[11px] text-gray-500 font-mono">{ord.customer?.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="line-clamp-1 max-w-[200px] text-[#0F2417] font-semibold">
                          {firstItem.productName}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {firstItem.quantity} টি {ord.items?.length > 1 ? `(+${ord.items.length - 1} আরও)` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#DC2626]">
                        {formatBDT(ord.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[ord.orderStatus] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                          {statusNames[ord.orderStatus] || ord.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-400 text-[11px]">
                        {new Date(ord.createdAt).toLocaleDateString('bn-BD', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#4B6354]">
            এখনও কোনো অর্ডার পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
}
