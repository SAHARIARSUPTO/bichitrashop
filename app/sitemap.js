// app/sitemap.js
// Technical SEO: Dynamic XML sitemap generation including indexable published products & categories

import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bichitrashop.com';

  try {
    await initDatabase();
    const productsColl = await getCollection('products');
    const categoriesColl = await getCollection('categories');

    // Only published products
    const products = await productsColl
      .find({ status: 'published' })
      .toArray();

    const categories = await categoriesColl
      .find({ status: 'active' })
      .toArray();

    const productUrls = products.map((prod) => ({
      url: `${baseUrl}/products/${prod.slug}`,
      lastModified: prod.updatedAt || prod.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: prod.featured ? 0.9 : 0.8,
    }));

    const categoryUrls = categories.map((cat) => ({
      url: `${baseUrl}/products?category=${cat.slug}`,
      lastModified: cat.updatedAt || cat.createdAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      ...categoryUrls,
      ...productUrls,
    ];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}
