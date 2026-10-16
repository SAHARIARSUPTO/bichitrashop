// app/admin/AdminNav.jsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  Image as LucideImage,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3
} from 'lucide-react';

export default function AdminNav({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // If on login page, don't show admin sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  const navItems = [
    { name: 'ড্যাশবোর্ড', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'পণ্য ব্যবস্থাপনা', href: '/admin/products', icon: Package },
    { name: 'অর্ডার সমূহ', href: '/admin/orders', icon: ShoppingBag },
    { name: 'কাস্টমার ট্রাফিক ও এসইও', href: '/admin/traffic', icon: BarChart3 },
    { name: 'ব্যানার স্লাইডার', href: '/admin/banners', icon: LucideImage },
    { name: 'স্টোর সেটিংস', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F6FAF7] flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#08542C] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white p-0.5">
            <Image
              src="/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png"
              alt="Bichitra Shop"
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>
          <span className="font-bold text-sm tracking-wide">বিচিত্র শপ অ্যাডমিন</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-white/10 text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`w-64 bg-[#08542C] text-white flex flex-col shrink-0 transition-all z-20 ${
          mobileMenuOpen ? 'block fixed inset-0 md:static' : 'hidden md:flex'
        }`}
      >
        {/* Brand Logo in Sidebar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 shrink-0 shadow-sm">
              <Image
                src="/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png"
                alt="Bichitra Shop Logo"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-base text-[#DC2626]">Bichitra</span>
                <span className="font-black text-base text-white">Shop</span>
              </div>
              <span className="text-[11px] text-[#22C55E] block font-medium">অ্যাডমিন কন্ট্রোল</span>
            </div>
          </Link>
          {mobileMenuOpen && (
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-white/70">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-white text-[#08542C] shadow-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#08542C]' : 'text-white/70'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#08542C]" />}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/10">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#22C55E]" />
              <span>লাইভ স্টোর দেখুন</span>
            </Link>
          </div>
        </nav>

        {/* Admin Footer & Logout */}
        <div className="p-4 border-t border-white/10 bg-[#064423]">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-[#DC2626] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'লগআউট হচ্ছে...' : 'লগআউট করুন'}</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Page Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
