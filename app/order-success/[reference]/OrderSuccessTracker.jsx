// app/order-success/[reference]/OrderSuccessTracker.jsx
'use client';

import { useEffect } from 'react';
import { trackPurchase } from '@/lib/pixel';

export default function OrderSuccessTracker({ order }) {
  useEffect(() => {
    if (!order || !order.orderReference) return;

    try {
      const storageKey = `bichitra_tracked_purchase_${order.orderReference}`;
      if (typeof window !== 'undefined' && !sessionStorage.getItem(storageKey)) {
        trackPurchase(order);
        sessionStorage.setItem(storageKey, 'true');
      }
    } catch {
      // Safe fallback if sessionStorage is blocked
      trackPurchase(order);
    }
  }, [order?.orderReference]);

  return null;
}
