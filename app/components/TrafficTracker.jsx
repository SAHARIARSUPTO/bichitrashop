// app/components/TrafficTracker.jsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TrafficTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef('');

  useEffect(() => {
    // Never track admin panel or API calls
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    const fullUrl = `${pathname}${searchParams ? `?${searchParams.toString()}` : ''}`;
    
    // Avoid double counting same path in rapid succession
    if (lastTrackedPath.current === fullUrl) {
      return;
    }
    lastTrackedPath.current = fullUrl;

    // Retrieve or establish anonymous session id
    let sessionId = '';
    try {
      sessionId = sessionStorage.getItem('bichitra_sid');
      if (!sessionId) {
        sessionId = `sid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('bichitra_sid', sessionId);
      }
    } catch {
      sessionId = 'anon';
    }

    // Determine device type
    let device = 'Desktop';
    if (typeof window !== 'undefined' && window.navigator) {
      const ua = window.navigator.userAgent.toLowerCase();
      if (/tablet|ipad|playbook|silk/i.test(ua)) {
        device = 'Tablet';
      } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
        device = 'Mobile';
      }
    }

    const payload = {
      path: fullUrl,
      title: typeof document !== 'undefined' ? document.title : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      utmSource: searchParams.get('utm_source') || searchParams.get('fbclid') ? 'facebook' : searchParams.get('gclid') ? 'google' : '',
      utmMedium: searchParams.get('utm_medium') || '',
      utmCampaign: searchParams.get('utm_campaign') || '',
      device,
      sessionId
    };

    // Non-blocking fire and forget
    try {
      if (typeof window !== 'undefined' && 'sendBeacon' in navigator) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/track', blob);
      } else {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(() => {});
      }
    } catch {
      // Ignore client network tracking errors
    }
  }, [pathname, searchParams]);

  return null;
}
