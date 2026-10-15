// app/layout.jsx
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bichitrashop.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bichitra Shop – বিচিত্র শপ | বিশ্বস্ত পণ্য ও স্মার্ট কেনাকাটা',
    template: '%s | Bichitra Shop (বিচিত্র শপ)'
  },
  description: 'বিচিত্র শপ – প্রিমিয়াম কোটি সেট, পাঞ্জাবি, বোরকা ও আবায়া, খাঁটি অর্গানিক ফুড এবং আধুনিক লাইফস্টাইল পণ্য। ক্যাশ অন ডেলিভারি সারা বাংলাদেশে।',
  keywords: [
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
  ],
  authors: [{ name: 'Bichitra Shop' }],
  creator: 'Bichitra Shop',
  publisher: 'Bichitra Shop',
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: siteUrl,
    siteName: 'Bichitra Shop – বিচিত্র শপ',
    title: 'Bichitra Shop – বিচিত্র শপ | বিশ্বস্ত পণ্য ও স্মার্ট কেনাকাটা',
    description: 'বিচিত্র শপ – প্রিমিয়াম কোটি সেট, ঐতিহ্যবাহী পাঞ্জাবি, আধুনিক আবায়া ও অর্গানিক ফুড। ক্যাশ অন ডেলিভারি সারা বাংলাদেশে।',
    images: [
      {
        url: '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png',
        width: 800,
        height: 800,
        alt: 'Bichitra Shop – বিচিত্র শপ অফিসিয়াল লোগো'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bichitra Shop – বিচিত্র শপ',
    description: 'বিশ্বস্ত পণ্য | স্মার্ট কেনাকাটা। ক্যাশ অন ডেলিভারি সারা বাংলাদেশে।',
    images: ['/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png'
  }
};

export const viewport = {
  themeColor: '#08542C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
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
          url: `${siteUrl}/Bichitra_Shop_Green_Badge_Logo-removebg-preview.png`
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+880-1700-000000',
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
    <html lang="bn" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F6FAF7] text-[#0F2417]">
        {children}
      </body>
    </html>
  );
}
