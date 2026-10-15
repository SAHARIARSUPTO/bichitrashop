// app/sitemap.js
// Technical SEO: Dynamic XML sitemap generation including indexable published products, categories, and trust/policy pages

import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bichitrashop.vercel.app/';

  const staticPages = [
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
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/return-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];

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
      priority: 0.8,
    }));

    return [
      ...staticPages,
      ...categoryUrls,
      ...productUrls,
    ];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return staticPages;
  }
}
