// lib/pricing.js
// Centralized server-side pricing & delivery fee calculation

export const DEFAULT_SHIPPING_RATES = {
  inside_dhaka: 70,   // ৳70 within Dhaka city
  outside_dhaka: 130, // ৳130 outside Dhaka city
};

/**
 * Determine shipping rate based on delivery zone or district
 */
export function getDeliveryCharge(zoneOrDistrict, customSettings = null) {
  const rates = customSettings?.shippingRates || DEFAULT_SHIPPING_RATES;
  
  if (typeof zoneOrDistrict === 'string') {
    const normalized = zoneOrDistrict.trim().toLowerCase();
    if (normalized === 'outside_dhaka' || normalized.includes('outside') || normalized.includes('বাইরে')) {
      return Math.round(Number(rates.outside_dhaka || 130));
    }
    if (normalized === 'inside_dhaka' || normalized.includes('inside') || normalized.includes('ভেতরে') || normalized === 'ঢাকা' || normalized === 'dhaka') {
      return Math.round(Number(rates.inside_dhaka || 70));
    }
  }
  
  return Math.round(Number(rates.outside_dhaka || 130));
}

/**
 * Calculate full order price breakdown securely on the server
 * Formula:
 * Subtotal = Unit selling price × Quantity
 * Total = Subtotal - Valid discount + Delivery charge
 */
export function calculateOrderPricing({
  unitPrice,
  quantity,
  deliveryZone,
  discount = 0,
  shippingSettings = null
}) {
  const cleanUnitPrice = Math.max(0, Math.round(Number(unitPrice) || 0));
  const cleanQuantity = Math.max(1, Math.min(50, Math.floor(Number(quantity) || 1)));
  
  const subtotal = cleanUnitPrice * cleanQuantity;
  const deliveryCharge = getDeliveryCharge(deliveryZone, shippingSettings);
  const cleanDiscount = Math.max(0, Math.min(subtotal, Math.round(Number(discount) || 0)));
  const total = subtotal - cleanDiscount + deliveryCharge;

  return {
    unitPrice: cleanUnitPrice,
    quantity: cleanQuantity,
    subtotal,
    discount: cleanDiscount,
    deliveryCharge,
    total,
    currency: 'BDT',
    currencySymbol: '৳'
  };
}

/**
 * Format currency in Bangladeshi Taka
 * e.g. ৳2,490
 */
export function formatBDT(amount) {
  const num = Math.round(Number(amount) || 0);
  return `৳${num.toLocaleString('en-BD')}`;
}
