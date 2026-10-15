// app/admin/login/page.jsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'ভুল ইমেইল বা পাসওয়ার্ড।');
        setLoading(false);
        return;
      }

      // Successfully logged in! Cookie set by server
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। আবার চেষ্টা করুন।');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FAF7] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2ECE3] shadow-xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-white border-2 border-[#08542C]/20 p-1 shadow-xs">
            <Image
              src="/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png"
              alt="Bichitra Shop"
              fill
              sizes="80px"
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#0F2417]">
              অ্যাডমিন পোর্টাল
            </h1>
            <p className="text-xs text-[#4B6354] mt-0.5">
              Bichitra Shop – বিচিত্র শপ ম্যানেজমেন্ট ড্যাশবোর্ড
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#0F2417] mb-1">
              অ্যাডমিন ইমেইল
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@bichitrashop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] focus:bg-white focus:border-[#08542C] text-sm outline-none transition-all"
              />
              <Mail className="w-4 h-4 text-[#4B6354] absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2417] mb-1">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2ECE3] bg-[#F6FAF7] focus:bg-white focus:border-[#08542C] text-sm outline-none transition-all"
              />
              <Lock className="w-4 h-4 text-[#4B6354] absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#08542C] hover:bg-[#064423] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <span>লগইন করুন</span>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#08542C]" />
            <span>নিরাপদ এনক্রিপ্টেড সেশন ও HTTP-only সিকিউরিটি</span>
          </p>
        </div>
      </div>
    </div>
  );
}
