// lib/slug.js
// Automated SEO slug generation with collision handling

/**
 * Convert string to URL-safe slug
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove unsafe URL characters (retain alphanumeric and hyphens)
    .replace(/[^\w\u0980-\u09FF-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/--+/g, '-')
    // Trim hyphens from start and end
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generate a unique slug in the products collection.
 * If collision occurs, appends -2, -3, etc.
 */
export async function generateUniqueSlug(name, productsCollection, currentProductId = null) {
  let baseSlug = slugify(name);
  if (!baseSlug) {
    baseSlug = 'product-' + Date.now().toString(36);
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    const existing = await productsCollection.findOne(query);

    if (!existing) {
      // Slug is available!
      return slug;
    }

    // If it's the exact same product being updated, keep its slug
    if (currentProductId && existing._id && existing._id.toString() === currentProductId.toString()) {
      return slug;
    }

    // Collision! Append next number
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}
