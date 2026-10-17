// lib/pixel.js
// Safe Meta (Facebook) Pixel Event Tracker Helper for Bichitra Shop
// Works even before running ads to build Custom Audiences, Lookalikes & Purchase history

/**
 * Dispatches a standard or custom Meta Pixel event safely without breaking if fbq is unavailable
 */
export function trackPixelEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      window.fbq('track', eventName, params);
    } catch {
      // Safe fallback - avoid interrupting client interactions
    }
  }
}

/**
 * Track Product Details Page View (ViewContent)
 */
export function trackViewContent(product) {
  if (!product) return;
  trackPixelEvent('ViewContent', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id || product.slug || 'product'],
    content_type: 'product',
    value: Number(product.price) || 0,
    currency: 'BDT'
  });
}

/**
 * Track Add to Cart Action (AddToCart)
 */
export function trackAddToCart(product, quantity = 1) {
  if (!product) return;
  trackPixelEvent('AddToCart', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id || product.slug || 'product'],
    content_type: 'product',
    value: (Number(product.price) || 0) * (Number(quantity) || 1),
    currency: 'BDT'
  });
}

/**
 * Track Initiate Checkout Action (InitiateCheckout)
 */
export function trackInitiateCheckout(items = [], totalValue = 0) {
  trackPixelEvent('InitiateCheckout', {
    content_ids: items.map(item => item.id || item.slug || item.productId),
    content_type: 'product',
    num_items: items.length || 1,
    value: Number(totalValue) || 0,
    currency: 'BDT'
  });
}

/**
 * Track Successful Order Purchase (Purchase)
 */
export function trackPurchase(order) {
  if (!order) return;
  trackPixelEvent('Purchase', {
    content_ids: order.items?.map(item => item.productId || item.slug) || [],
    content_type: 'product',
    value: Number(order.total || order.subtotal) || 0,
    currency: 'BDT'
  });
}
