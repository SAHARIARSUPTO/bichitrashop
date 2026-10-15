// scripts/verify-seo-crawler.js
// Verify all SEO crawler pages, robots.txt, and sitemap.xml

async function verify() {
  const baseUrl = 'http://localhost:3000';
  const urls = [
    { path: '/robots.txt', expectedStatus: 200, checkContent: 'Googlebot' },
    { path: '/sitemap.xml', expectedStatus: 200, checkContent: 'urlset' },
    { path: '/about', expectedStatus: 200, checkContent: 'আমাদের পরিচিতি' },
    { path: '/contact', expectedStatus: 200, checkContent: 'যোগাযোগ ও সার্বক্ষণিক সহায়তা' },
    { path: '/shipping-policy', expectedStatus: 200, checkContent: 'শিপিং ও ডেলিভারি পলিসি' },
    { path: '/return-policy', expectedStatus: 200, checkContent: 'রিটার্ন ও রিফান্ড পলিসি' },
    { path: '/privacy-policy', expectedStatus: 200, checkContent: 'প্রাইভেসি ও ডেটা পলিসি' },
    { path: '/terms', expectedStatus: 200, checkContent: 'ব্যবহারের শর্তাবলী' },
    { path: '/faq', expectedStatus: 200, checkContent: 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' },
  ];

  console.log('Verifying Google crawler endpoints and trust pages...');

  for (const item of urls) {
    try {
      const res = await fetch(`${baseUrl}${item.path}`);
      if (res.status !== item.expectedStatus) {
        console.error(`❌ FAILED: ${item.path} returned status ${res.status}`);
        process.exit(1);
      }
      const text = await res.text();
      if (!text.includes(item.checkContent)) {
        console.error(`❌ FAILED: ${item.path} does not contain expected snippet "${item.checkContent}"`);
        process.exit(1);
      }
      console.log(`✔ SUCCESS: ${item.path} (HTTP ${res.status}) - Verified snippet "${item.checkContent}"`);
    } catch (err) {
      console.error(`❌ ERROR fetching ${item.path}:`, err.message);
      process.exit(1);
    }
  }

  console.log('All Google crawler and SEO pages verified successfully!');
  process.exit(0);
}

verify();
