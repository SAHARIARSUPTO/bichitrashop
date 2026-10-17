import { Suspense } from 'react';
import './globals.css';
import ClientNavigationLoader from './components/ClientNavigationLoader';
import TrafficTracker from './components/TrafficTracker';
import FacebookPixel from './components/FacebookPixel';
import {
  getSiteUrl,
  toAbsoluteUrl,
  toOgImageUrl,
  DEFAULT_SOCIAL_POSTER,
  DEFAULT_SITE_ICON,
  OFFICIAL_HOTLINE_TEL,
  OFFICIAL_FACEBOOK_PAGE
} from '@/lib/seo';
import { getStoreSettings } from '@/lib/settings-server';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const siteUrl = getSiteUrl();
  const settings = await getStoreSettings();

  const metaTitle = settings?.seo?.metaTitle || 'Bichitra Shop – বিচিত্র শপ | বিশ্বস্ত পণ্য ও স্মার্ট কেনাকাটা';
  const metaDescription = settings?.seo?.metaDescription || 'বিচিত্র শপ – প্রিমিয়াম কোটি সেট, পাঞ্জাবি, বোরকা ও আবায়া, খাঁটি অর্গানিক ফুড এবং আধুনিক লাইফস্টাইল পণ্য। ক্যাশ অন ডেলিভারি সারা বাংলাদেশে।';
  
  const rawKeywords = settings?.seo?.keywords;
  const keywords = Array.isArray(rawKeywords)
    ? rawKeywords
    : (typeof rawKeywords === 'string'
        ? rawKeywords.split(',').map((k) => k.trim()).filter(Boolean)
        : [
            'বিচিত্র শপ',
            'Bichitra Shop',
            'অনলাইন শপিং বাংলাদেশ',
            'কোটি সেট',
            'পাঞ্জাবি কালেকশন',
            'বোরকা আবায়া',
            'খাঁটি মধু',
            'সরিষার তেল',
            'ক্যাশ অন ডেলিভারি',
            'dropshipping bangladesh'
          ]);

  const socialPosterUrl = toOgImageUrl(
    settings?.seo?.ogImage || settings?.branding?.socialPoster || DEFAULT_SOCIAL_POSTER
  );

  const siteIconUrl = settings?.branding?.favicon || DEFAULT_SITE_ICON;
  const googleVerification = settings?.seo?.googleVerification || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'EOaABPHPI_eAaNXucQ1HhkIJaDn3uocSezsHHmnAI-A';

  const customFavicon = settings?.branding?.favicon;
  const hasCustomFavicon = Boolean(customFavicon && customFavicon !== DEFAULT_SITE_ICON);

  const iconEntries = [
    ...(hasCustomFavicon ? [{ url: customFavicon, sizes: 'any' }] : []),
    { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { url: '/favicon.svg', type: 'image/svg+xml' }
  ];

  const appleEntries = [
    ...(hasCustomFavicon ? [{ url: customFavicon, sizes: '180x180' }] : []),
    { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
  ];

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: metaTitle,
      template: '%s | Bichitra Shop (বিচিত্র শপ)'
    },
    description: metaDescription,
    keywords,
    authors: [{ name: 'Bichitra Shop' }],
    creator: 'Bichitra Shop',
    publisher: 'Bichitra Shop',
    alternates: {
      canonical: siteUrl
    },
    verification: {
      google: googleVerification
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    openGraph: {
      type: 'website',
      locale: 'bn_BD',
      url: siteUrl,
      siteName: 'Bichitra Shop – বিচিত্র শপ',
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: socialPosterUrl,
          secureUrl: socialPosterUrl,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: 'Bichitra Shop – বিচিত্র শপ সোশ্যাল শেয়ার পোস্টার'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [socialPosterUrl]
    },
    icons: {
      icon: iconEntries,
      apple: appleEntries,
      shortcut: '/favicon.ico',
      other: [
        {
          rel: 'apple-touch-icon-precomposed',
          url: '/apple-touch-icon-precomposed.png'
        }
      ]
    },
    manifest: '/site.webmanifest'
  };
}

export const viewport = {
  themeColor: '#08542C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }) {
  const siteUrl = getSiteUrl();
  const settings = await getStoreSettings();
  const hotline = settings?.contact?.phone || OFFICIAL_HOTLINE_TEL;
  const facebookPage = settings?.social?.facebook || OFFICIAL_FACEBOOK_PAGE;
  const facebookPixelId = settings?.marketing?.facebookPixelId || settings?.seo?.facebookPixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Bichitra Shop – বিচিত্র শপ',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: toAbsoluteUrl(settings?.branding?.logo || DEFAULT_SITE_ICON)
        },
        sameAs: [
          facebookPage
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: hotline,
          contactType: 'customer service',
          areaServed: 'BD',
          availableLanguage: ['Bengali', 'English']
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Bichitra Shop',
        publisher: {
          '@id': `${siteUrl}/#organization`
        },
        inLanguage: 'bn-BD',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  return (
    <html lang="bn" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F6FAF7] text-[#0F2417]" suppressHydrationWarning>
        <Suspense fallback={null}>
          <ClientNavigationLoader />
          <TrafficTracker />
          <FacebookPixel pixelId={facebookPixelId} />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
