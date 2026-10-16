// app/admin/traffic/TrafficManager.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Eye,
  TrendingUp,
  Users,
  Globe,
  Share2,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  Trash2
} from 'lucide-react';

export default function TrafficManager({ initialData }) {
  const [data, setData] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'live' | 'seo'

  const fetchAnalytics = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/analytics');
      const result = await res.json();
      if (result.success && result.stats) {
        setData(result.stats);
      }
    } catch (err) {
      console.error('Failed to refresh traffic analytics:', err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('আপনি কি নিশ্চিত যে সকল পূর্ববর্তী ট্রাফিক লগ ক্লিয়ার করে নতুন লাইভ ভিজিটরদের ট্র্যাকিং শূন্য থেকে শুরু করতে চান?')) {
      return;
    }
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/analytics', { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setData({
          totalViews: 0,
          todayViews: 0,
          uniqueSessions: 0,
          sources: [],
          devices: [],
          topPages: [],
          recentActivity: [],
          seoInsights: [
            {
              type: 'info',
              title: 'লাইভ ট্র্যাকিং সক্রিয়',
              desc: 'কাস্টমাররা সাইটে ঢুকলেই স্বয়ংক্রিয়ভাবে তাদের সোর্স (Facebook, Google বা Direct) এবং ভিউ রেকর্ড হতে থাকবে।'
            }
          ]
        });
      }
    } catch (err) {
      console.error('Failed to clear traffic logs:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchAnalytics();
    }
  }, [initialData]);

  const stats = data || {
    totalViews: 0,
    todayViews: 0,
    uniqueSessions: 0,
    sources: [],
    devices: [],
    topPages: [],
    recentActivity: [],
    seoInsights: []
  };

  const getSourceBadge = (source) => {
    const s = (source || '').toLowerCase();
    if (s.includes('facebook') || s.includes('fb')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E7F3FF] text-[#1877F2] border border-[#1877F2]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" />
          Facebook
        </span>
      );
    }
    if (s.includes('google')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF5FB] text-[#0F9D58] border border-[#0F9D58]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D58]" />
          Google Search
        </span>
      );
    }
    if (s.includes('whatsapp')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F8F0] text-[#25D366] border border-[#25D366]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
          WhatsApp
        </span>
      );
    }
    if (s.includes('instagram')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FDF2F8] text-[#E1306C] border border-[#E1306C]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C]" />
          Instagram
        </span>
      );
    }
    if (s.includes('direct')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4F4F5] text-zinc-700 border border-zinc-200">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          Direct / Organic
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600">
        {source}
      </span>
    );
  };

  const getDeviceIcon = (device) => {
    const d = (device || '').toLowerCase();
    if (d.includes('mobile')) return <Smartphone className="w-3.5 h-3.5 text-zinc-500" />;
    if (d.includes('tablet')) return <Tablet className="w-3.5 h-3.5 text-zinc-500" />;
    return <Monitor className="w-3.5 h-3.5 text-zinc-500" />;
  };

  const formatBengaliTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) + ' (' + date.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }) + ')';
    } catch {
      return isoString;
    }
  };

  const fbPercentage = stats.sources.find(s => s.name === 'Facebook')?.percentage || 0;
  const googlePercentage = stats.sources.find(s => s.name === 'Google Search')?.percentage || 0;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#08542C]">
              কাস্টমার ভিউ ও ট্রাফিক ট্র্যাকিং
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              লাইভ ট্র্যাকিং সক্রিয়
            </span>
          </div>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">
            গ্রাহকরা কোথা থেকে আসছেন (Facebook, Google বা Direct), কোন পণ্য বেশি দেখছেন এবং এসইও উন্নয়নের বিশ্লেষণ।
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleClearLogs}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all cursor-pointer border border-red-200/60"
            title="লগ রিসেট করুন"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>লগ মুছুন</span>
          </button>

          <button
            onClick={fetchAnalytics}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'রিফ্রেশ হচ্ছে...' : 'রিফ্রেশ'}</span>
          </button>

          <Link
            href="/admin/settings"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#08542C] text-white hover:bg-[#064423] text-xs font-bold transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>এসইও সেটিংস</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-200/80 hover:border-[#08542C]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">মোট পেজ ভিউ</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#08542C] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-zinc-900">
              {stats.totalViews.toLocaleString('bn-BD')}
            </span>
            <span className="text-xs text-zinc-400 block mt-1">সর্বমোট ভিজিটর ট্র্যাকিং</span>
          </div>
        </div>

        {/* Today's Views */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-200/80 hover:border-[#08542C]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">আজকের ভিউ</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-blue-600">
              {stats.todayViews.toLocaleString('bn-BD')}
            </span>
            <span className="text-xs text-zinc-400 block mt-1">আজকের মোট ভিজিট সংখ্যা</span>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-200/80 hover:border-[#08542C]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">ইউনিক ভিজিটর</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-purple-700">
              {stats.uniqueSessions.toLocaleString('bn-BD')}
            </span>
            <span className="text-xs text-zinc-400 block mt-1">আলাদা কাস্টমার সেশন</span>
          </div>
        </div>

        {/* Google & Facebook Share */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-200/80 hover:border-[#08542C]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">গুগল বনাম ফেসবুক</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-[#1877F2]">FB {fbPercentage}%</span>
              <span className="text-zinc-300 font-bold">|</span>
              <span className="text-lg font-black text-[#0F9D58]">Google {googlePercentage}%</span>
            </div>
            <span className="text-xs text-zinc-400 block mt-1">প্রধান সার্চ ও সোশ্যাল উৎস</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'overview'
              ? 'text-[#08542C] border-b-2 border-[#08542C]'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          ট্রাফিক উৎস ও ডিভাইস
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'live'
              ? 'text-[#08542C] border-b-2 border-[#08542C]'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          রিয়েল-টাইম ভিজিটর হিস্ট্রি ({stats.recentActivity.length})
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
            activeTab === 'seo'
              ? 'text-[#08542C] border-b-2 border-[#08542C]'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          এসইও ট্র্যাকিং পরামর্শ ({stats.seoInsights.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Traffic Sources Breakdown (2 cols) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-black text-zinc-900">
                    ট্রাফিক সোর্স ব্রেকডাউন (কোথা থেকে কাস্টমার আসছে?)
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Facebook, Google Search, WhatsApp এবং অন্যান্য উৎস
                  </p>
                </div>
                <Share2 className="w-4 h-4 text-zinc-400" />
              </div>

              <div className="space-y-4">
                {stats.sources.map((source) => {
                  let barColor = 'bg-[#08542C]';
                  if (source.name === 'Facebook') barColor = 'bg-[#1877F2]';
                  if (source.name === 'Google Search') barColor = 'bg-[#0F9D58]';
                  if (source.name === 'WhatsApp') barColor = 'bg-[#25D366]';
                  if (source.name === 'Instagram') barColor = 'bg-[#E1306C]';

                  return (
                    <div key={source.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {getSourceBadge(source.name)}
                          <span className="font-semibold text-zinc-700">
                            {source.count.toLocaleString('bn-BD')} টি ভিউ
                          </span>
                        </div>
                        <span className="font-black text-zinc-900">{source.percentage}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.max(4, source.percentage)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Source Quick Note */}
              <div className="mt-6 pt-5 border-t border-zinc-100 flex items-start gap-2.5 bg-[#F6FAF7] p-3.5 rounded-xl">
                <Lightbulb className="w-4 h-4 text-[#08542C] shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-600 leading-relaxed">
                  <strong className="text-[#08542C]">এসইও ট্রিপ:</strong> গুগল সার্চ থেকে বেশি কাস্টমার আনতে প্রোডাক্ট ক্যাটাগরি ও নামের সাথে সাধারণ ব্যবহারকারীদের বাংলা কিওয়ার্ড ব্যবহার করুন।
                </p>
              </div>
            </div>

            {/* Devices & Quick Stats (1 col) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80 space-y-6">
              <div>
                <h2 className="text-base font-black text-zinc-900">ভিজিটর ডিভাইস</h2>
                <p className="text-xs text-zinc-500 mt-0.5">কাস্টমাররা মোবাইল নাকি কম্পিউটারে দেখছেন</p>
              </div>

              <div className="space-y-4">
                {stats.devices.map((dev) => (
                  <div key={dev.name} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center">
                        {getDeviceIcon(dev.name)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-zinc-800 block">
                          {dev.name === 'Mobile' ? 'স্মার্টফোন (Mobile)' : dev.name === 'Desktop' ? 'কম্পিউটার (Desktop)' : 'ট্যাবলেট (Tablet)'}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {dev.count.toLocaleString('bn-BD')} টি সেশন
                        </span>
                      </div>
                    </div>
                    <span className="font-black text-sm text-[#08542C]">{dev.percentage}%</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <div className="bg-amber-50 border border-amber-200/60 p-3.5 rounded-xl text-amber-900 text-xs">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                    মোবাইল অপ্টিমাইজেশন
                  </div>
                  বাংলাদেশে শতকরা ৮৫% এর বেশি অনলাইন শপিং মোবাইল ফোন থেকে সম্পন্ন হয়। মোবাইল পেজ স্পিড বৃদ্ধি সেল বাড়ানোর প্রধান চাবিকাঠি।
                </div>
              </div>
            </div>
          </div>

          {/* Top 10 Most Visited Products / Pages */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-black text-zinc-900">
                  সর্বাধিক ভিজিট হওয়া পেজ ও পণ্যসমূহ
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  কোন পণ্যগুলো গ্রাহকরা সবচেয়ে বেশি ভিউ করছেন এবং প্রধান ট্রাফিক উৎস
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-400">টপ {stats.topPages.length} পেজ</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="pb-3 px-2">পেজের শিরোনাম ও লিঙ্ক</th>
                    <th className="pb-3 px-2 text-center">ভিউ সংখ্যা</th>
                    <th className="pb-3 px-2 text-center">মোট ট্রাফিকের %</th>
                    <th className="pb-3 px-2 text-right">প্রধান উৎস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {stats.topPages.map((page, index) => (
                    <tr key={page.path} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-zinc-100 font-bold text-[10px] text-zinc-600 flex items-center justify-center shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <div>
                            <Link
                              href={page.path}
                              target="_blank"
                              className="font-bold text-zinc-900 hover:text-[#08542C] flex items-center gap-1 group"
                            >
                              <span>{page.title}</span>
                              <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-[#08542C]" />
                            </Link>
                            <span className="text-[11px] text-zinc-400 font-mono block">
                              {page.path}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-black text-zinc-800">
                        {page.views.toLocaleString('bn-BD')}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="font-bold text-zinc-600">{page.percentage}%</span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        {getSourceBadge(page.topSource)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REAL-TIME ACTIVITY STREAM */}
      {activeTab === 'live' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-zinc-900">রিয়েল-টাইম কাস্টমার ভিজিটর লগ</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                সাইটের প্রতিটি নতুন পেজ ভিউ এবং গ্রাহকদের আসার রেফারার ট্র্যাকিং
              </p>
            </div>
            <span className="text-xs font-bold text-[#08542C] bg-[#DCFCE7] px-3 py-1 rounded-full">
              সর্বশেষ ৫০ টি ইভেন্ট
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 px-2">সময়</th>
                  <th className="pb-3 px-2">উৎস (Source)</th>
                  <th className="pb-3 px-2">ভিজিটকৃত পেজ</th>
                  <th className="pb-3 px-2">ডিভাইস</th>
                  <th className="pb-3 px-2">রেফারার ও ক্যাম্পেইন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {stats.recentActivity.map((act) => (
                  <tr key={act.id || act.createdAt} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3 px-2 text-zinc-500 whitespace-nowrap text-[11px]">
                      {formatBengaliTime(act.createdAt)}
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      {getSourceBadge(act.source)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-bold text-zinc-900">{act.title}</div>
                      <span className="text-[10px] text-zinc-400 font-mono block truncate max-w-xs">
                        {act.path}
                      </span>
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        {getDeviceIcon(act.device)}
                        <span className="text-[11px] font-medium">{act.device}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[11px] text-zinc-500">
                      {act.utm?.campaign ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-mono text-[10px]">
                          Campaign: {act.utm.campaign}
                        </span>
                      ) : act.referrer ? (
                        <span className="truncate block max-w-xs text-zinc-400 font-mono text-[10px]">
                          {act.referrer}
                        </span>
                      ) : (
                        <span className="text-zinc-400 italic">সরাসরি ব্রাউজ</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SEO INSIGHTS & ACTIONABLE RECOMMENDATIONS */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#08542C] to-[#0D733E] text-white p-6 md:p-8 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h2 className="text-lg md:text-xl font-black">
                বিচিত্র শপ গুগল ও ফেসবুক এসইও মাস্টার গাইড
              </h2>
            </div>
            <p className="text-white/80 text-xs md:text-sm max-w-2xl leading-relaxed">
              সার্চ ইঞ্জিন ও সামাজিক মাধ্যমে আপনার স্টোরের প্রচার এবং প্রথম পেজে র‍্যাঙ্কিংয়ের জন্য কাস্টমার ট্রাফিকের ওপর ভিত্তি করে স্বয়ংক্রিয় পরামর্শ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.seoInsights.map((insight, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl shadow-sm border border-zinc-200/80 space-y-2 hover:border-[#08542C]/40 transition-all"
              >
                <div className="flex items-center gap-2">
                  {insight.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  {insight.type === 'info' && <Share2 className="w-4 h-4 text-blue-500" />}
                  {insight.type === 'tip' && <Lightbulb className="w-4 h-4 text-purple-600" />}
                  <h3 className="text-sm font-black text-zinc-900">{insight.title}</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">{insight.desc}</p>
              </div>
            ))}
          </div>

          {/* Quick Action Links */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80 space-y-4">
            <h3 className="text-sm font-black text-zinc-900">প্রয়োজনীয় এসইও টুলস ও লিঙ্ক</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/sitemap.xml"
                target="_blank"
                className="p-3.5 rounded-xl border border-zinc-200 hover:border-[#08542C] hover:bg-[#F6FAF7] transition-all flex items-center justify-between text-xs font-bold text-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#08542C]" />
                  <span>সাইটম্যাপ ফাইল (sitemap.xml)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </Link>

              <Link
                href="/robots.txt"
                target="_blank"
                className="p-3.5 rounded-xl border border-zinc-200 hover:border-[#08542C] hover:bg-[#F6FAF7] transition-all flex items-center justify-between text-xs font-bold text-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span>রোবট ফাইল (robots.txt)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </Link>

              <Link
                href="/admin/settings"
                className="p-3.5 rounded-xl border border-zinc-200 hover:border-[#08542C] hover:bg-[#F6FAF7] transition-all flex items-center justify-between text-xs font-bold text-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>গুগল সার্চ কনসোল ভেরিফিকেশন কোড</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
