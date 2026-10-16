// app/components/BackButton.jsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * Reusable Mobile & Desktop Back Button that navigates to the previous step in history,
 * with resilient fallback to fallbackHref if history is unavailable or external.
 */
export default function BackButton({
  fallbackHref = '/',
  label = 'পূর্ববর্তী পেজে ফিরে যান',
  showIcon = true,
  className = '',
  iconClassName = 'w-4 h-4 text-black stroke-[2.5]'
}) {
  const router = useRouter();

  const handleBack = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.history.length > 1) {
      const isInternal = !document.referrer || document.referrer.includes(window.location.host);
      if (isInternal) {
        router.back();
        return;
      }
    }
    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label}
      className={
        className ||
        'inline-flex items-center gap-1.5 text-xs font-bold text-[#08542C] hover:underline active:scale-95 transition-all cursor-pointer'
      }
    >
      {showIcon && <ArrowLeft className={iconClassName} />}
      {label && <span>{label}</span>}
    </button>
  );
}
