// lib/gtm.js
// Safe Google Tag Manager (GTM) dataLayer Integration for Bichitra Shop
// Official GTM Container ID: GTM-T7BT3F2L
export const OFFICIAL_GTM_ID = 'GTM-T7BT3F2L';

/**
 * Safely push an event to window.dataLayer
 */
export function pushDataLayerEvent(event, data = {}) {
  if (typeof window !== 'undefined') {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event,
        ...data
      });
    } catch {
      // Safe fallback - avoid interrupting client interactions
    }
  }
}

/**
 * Track Product View in GA4/GTM dataLayer (view_item)
 */
export function trackGtmViewItem(product) {
  if (!product) return;
  pushDataLayerEvent('view_item', {
    ecommerce: {
      currency: 'BDT',
      value: Number(product.price) || 0,
      items: [
        {
          item_id: product.id || product.slug || 'product',
          item_name: product.name,
          item_category: product.category,
          price: Number(product.price) || 0,
          quantity: 1
        }
      ]
    }
  });
}

/**
 * Track Add to Cart in GA4/GTM dataLayer (add_to_cart)
 */
export function trackGtmAddToCart(product, quantity = 1) {
  if (!product) return;
  const qty = Number(quantity) || 1;
  pushDataLayerEvent('add_to_cart', {
    ecommerce: {
      currency: 'BDT',
      value: (Number(product.price) || 0) * qty,
      items: [
        {
          item_id: product.id || product.slug || 'product',
          item_name: product.name,
          item_category: product.category,
          price: Number(product.price) || 0,
          quantity: qty
        }
      ]
    }
  });
}

/**
 * Track Begin Checkout in GA4/GTM dataLayer (begin_checkout)
 */
export function trackGtmBeginCheckout(items = [], totalValue = 0) {
  pushDataLayerEvent('begin_checkout', {
    ecommerce: {
      currency: 'BDT',
      value: Number(totalValue) || 0,
      items: items.map((item) => ({
        item_id: item.id || item.slug || item.productId,
        item_name: item.name || item.productName,
        price: Number(item.price || item.unitPrice) || 0,
        quantity: Number(item.quantity) || 1
      }))
    }
  });
}

/**
 * Track Purchase in GA4/GTM dataLayer (purchase)
 */
export function trackGtmPurchase(order) {
  if (!order) return;
  pushDataLayerEvent('purchase', {
    ecommerce: {
      transaction_id: order.orderReference || order.id || `ORD-${Date.now()}`,
      value: Number(order.total || order.subtotal) || 0,
      currency: 'BDT',
      items: order.items?.map((item) => ({
        item_id: item.productId || item.slug,
        item_name: item.productName || item.name,
        price: Number(item.unitPrice || item.price) || 0,
        quantity: Number(item.quantity) || 1
      })) || []
    }
  });
}
