// app/components/ClientNavigationLoader.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ClientNavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Instantly clear loader when new route/page renders
  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  // Trigger cool loader instantly on internal navigation clicks
  useEffect(() => {
    const handleDocumentClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external links, hash anchors, tel, mailto, downloads, new tabs
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('#') ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      const currentUrl = `${window.location.pathname}${window.location.search}`;
      if (href !== currentUrl) {
        setLoading(true);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Safety fallback: auto-clear after 3.5 seconds
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(timer);
  }, [loading]);

  if (!loading) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.04] backdrop-blur-[2px] pointer-events-none transition-all duration-200"
    >
      {/* Top glowing laser progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#08542C] to-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.9)] animate-pulse" />

      {/* Cool floating glassmorphic dual-ring animated circle (website state clearly visible behind) */}
      <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/85 backdrop-blur-xl border border-white/70 shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
        {/* Ambient brand glow aura */}
        <div className="absolute inset-0 rounded-full bg-[#08542C]/15 blur-lg pointer-events-none" />

        {/* Outer clockwise spinning ring */}
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-[3px] border-transparent border-t-[#08542C] border-r-[#22C55E] animate-spin" />

        {/* Inner counter-clockwise spinning ring */}
        <div className="absolute w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[2.5px] border-transparent border-b-[#08542C] border-l-[#10B981] animate-[spin_1s_linear_infinite_reverse]" />

        {/* Center glowing pulse dot */}
        <div className="absolute w-2 h-2 rounded-full bg-[#08542C] shadow-[0_0_8px_#08542C] animate-pulse" />
      </div>
    </div>
  );
}
