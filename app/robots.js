// app/robots.js
// Technical SEO: Configurable robots.txt with security exclusions for admin and private routes

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bichitrashop.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/admin',
          '/api/admin/',
          '/order-success',
          '/order-success/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
