// app/components/GoogleTagManager.jsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { OFFICIAL_GTM_ID } from '@/lib/gtm';

export default function GoogleTagManager({ gtmId = '' }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const cleanGtmId = (gtmId || process.env.NEXT_PUBLIC_GTM_ID || OFFICIAL_GTM_ID || 'GTM-T7BT3F2L').trim();

  // Push virtual page_view event on route transitions for Next.js App Router
  useEffect(() => {
    if (!cleanGtmId) return;

    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'page_view',
        page_location: window.location.href,
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
        page_title: typeof document !== 'undefined' ? document.title : ''
      });
    }
  }, [pathname, searchParams, cleanGtmId]);

  if (!cleanGtmId) return null;

  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${cleanGtmId}');
          `
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${cleanGtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
