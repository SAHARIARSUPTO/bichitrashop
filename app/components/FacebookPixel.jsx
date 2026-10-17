// app/components/FacebookPixel.jsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { OFFICIAL_FACEBOOK_PIXEL_ID } from '@/lib/pixel';

export default function FacebookPixel({ pixelId = '' }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  const cleanPixelId = (pixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || OFFICIAL_FACEBOOK_PIXEL_ID || '2204374163789446').trim();

  // Track page view ONLY on client route transitions (skip initial mount to avoid duplicate PageView)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!cleanPixelId) return;

    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [pathname, searchParams, cleanPixelId]);

  if (!cleanPixelId) return null;

  return (
    <>
      <Script
        id="meta-facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && !window.__fbq_initialized) {
              window.__fbq_initialized = true;
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${cleanPixelId}');
              fbq('track', 'PageView');
            }
          `
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${cleanPixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
