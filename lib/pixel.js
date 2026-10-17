import {
  trackGtmViewItem,
  trackGtmAddToCart,
  trackGtmBeginCheckout,
  trackGtmPurchase
} from './gtm.js';

export const OFFICIAL_FACEBOOK_PIXEL_ID = '2204374163789446';

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
 * Track Product Details Page View (ViewContent + GTM view_item)
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
  trackGtmViewItem(product);
}

/**
 * Track Add to Cart Action (AddToCart + GTM add_to_cart)
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
  trackGtmAddToCart(product, quantity);
}

/**
 * Track Initiate Checkout Action (InitiateCheckout + GTM begin_checkout)
 */
export function trackInitiateCheckout(items = [], totalValue = 0) {
  trackPixelEvent('InitiateCheckout', {
    content_ids: items.map(item => item.id || item.slug || item.productId),
    content_type: 'product',
    num_items: items.length || 1,
    value: Number(totalValue) || 0,
    currency: 'BDT'
  });
  trackGtmBeginCheckout(items, totalValue);
}

/**
 * Track Successful Order Purchase (Purchase + GTM purchase)
 */
export function trackPurchase(order) {
  if (!order) return;
  trackPixelEvent('Purchase', {
    content_ids: order.items?.map(item => item.productId || item.slug) || [],
    content_type: 'product',
    value: Number(order.total || order.subtotal) || 0,
    currency: 'BDT'
  });
  trackGtmPurchase(order);
}
