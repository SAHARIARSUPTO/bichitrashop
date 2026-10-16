// app/components/ClientNavigationLoader.jsx
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ClientNavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or search params change, finish progress
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept all internal anchor clicks for instant visual mobile app feedback
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Find closest anchor
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external links, hash anchors on the same page, tel:, mailto:
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('#') ||
        anchor.target === '_blank'
      ) {
        return;
      }

      // If clicked link is different from current URL, trigger instant loader
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      if (href !== currentUrl) {
        setLoading(true);
        setProgress(35);
        setTimeout(() => setProgress(75), 150);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-opacity duration-300"
      style={{ opacity: loading ? 1 : 0 }}
    >
      {/* Top glowing high-speed loader strip */}
      <div
        className="h-1 bg-gradient-to-r from-[#08542C] via-[#22C55E] to-[#DC2626] transition-all duration-300 ease-out shadow-[0_0_12px_rgba(34,197,94,0.6)]"
        style={{ width: `${progress}%` }}
      />
      {/* Sleek mobile app corner spinner */}
      <div className="absolute right-3 top-2.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1.5 shadow-lg animate-in fade-in">
        <svg
          className="animate-spin h-3 w-3 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        <span>লোড হচ্ছে...</span>
      </div>
    </div>
  );
}
