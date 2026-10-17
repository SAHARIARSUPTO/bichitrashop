// app/robots.js
// Technical SEO: Configurable robots.txt with dedicated rules for Googlebot, Bingbot, and general web crawlers

import { headers } from 'next/headers';
import { getSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function robots() {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/about',
          '/contact',
          '/privacy-policy',
          '/terms',
          '/return-policy',
          '/shipping-policy',
          '/faq',
          '/_next/static/',
          '/*.png$',
          '/*.jpg$',
          '/*.jpeg$',
          '/*.webp$',
          '/*.svg$',
          '/*.ico$'
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/admin',
          '/api/admin/*',
          '/order-success',
          '/order-success/*',
          '/checkout',
          '/checkout/*'
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/',
          '/products/*',
          '/_next/image*',
          '/uploads/*',
          '/*.png$',
          '/*.jpg$',
          '/*.jpeg$',
          '/*.webp$'
        ],
        disallow: [
          '/admin/*'
        ]
      },
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/admin/*',
          '/order-success/*',
          '/checkout/*'
        ]
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/admin',
          '/api/admin/*',
          '/order-success',
          '/order-success/*',
          '/checkout',
          '/checkout/*'
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
