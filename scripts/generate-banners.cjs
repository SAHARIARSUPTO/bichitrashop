// scripts/generate-banners.cjs
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const bannersDir = path.join(process.cwd(), 'public', 'banners');
if (!fs.existsSync(bannersDir)) {
  fs.mkdirSync(bannersDir, { recursive: true });
}

// Helper to mask any rectangular image into a crisp circular cutout using Sharp
async function getCircularPhoto(filename, diameter, position = 'center') {
  const filePath = path.join(bannersDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`Image file not found: ${filePath}`);
    return null;
  }
  const r = Math.floor(diameter / 2);
  const maskSvg = Buffer.from(
    `<svg width="${diameter}" height="${diameter}"><circle cx="${r}" cy="${r}" r="${r}" fill="#fff" /></svg>`
  );

  return await sharp(filePath)
    .resize(diameter, diameter, { fit: 'cover', position })
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

// Helper SVG Alpona / Bengali Mandala generator
function generateAlponaCircle(cx, cy, r, color = 'rgba(255, 215, 0, 0.25)') {
  let circles = '';
  for (let i = 1; i <= 4; i++) {
    circles += `<circle cx="${cx}" cy="${cy}" r="${(r * i) / 4}" fill="none" stroke="${color}" stroke-width="${i === 4 ? 2 : 1}" stroke-dasharray="${i % 2 === 0 ? '4 4' : 'none'}" />`;
  }
  let petals = '';
  const count = 16;
  for (let i = 0; i < count; i++) {
    const angle = (i * 360) / count;
    const rad = (angle * Math.PI) / 180;
    const px = cx + Math.cos(rad) * (r * 0.72);
    const py = cy + Math.sin(rad) * (r * 0.72);
    petals += `<circle cx="${px}" cy="${py}" r="${r * 0.16}" fill="none" stroke="${color}" stroke-width="1.5" />`;
  }
  return `<g>${circles}${petals}</g>`;
}

// 1. BANNER: Festive Bengali Calligraphy Showcase (উৎসবের রঙে সাজুন)
async function createFestiveCalligraphyBanner() {
  const width = 1600;
  const height = 680;
  const cx = 1260;
  const cy = 340;
  const d = 420;
  const left = cx - d / 2;
  const top = cy - d / 2;

  const bgSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#021C0F" />
        <stop offset="40%" stop-color="#06351D" />
        <stop offset="85%" stop-color="#0A4D29" />
        <stop offset="100%" stop-color="#031A0E" />
      </linearGradient>

      <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFF3B0" />
        <stop offset="35%" stop-color="#FFD700" />
        <stop offset="70%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#D97706" />
      </linearGradient>

      <linearGradient id="redBadge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#DC2626" />
        <stop offset="100%" stop-color="#991B1B" />
      </linearGradient>

      <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="2" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.85"/>
      </filter>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

    <!-- Ornate Traditional Alpona / Bengali Mandala -->
    ${generateAlponaCircle(cx, cy, 290, 'rgba(255, 215, 0, 0.22)')}
    ${generateAlponaCircle(100, 80, 110, 'rgba(255, 215, 0, 0.12)')}
    ${generateAlponaCircle(100, 600, 110, 'rgba(255, 215, 0, 0.12)')}

    <!-- Calligraphic Flourish Borders -->
    <path d="M 60,40 L 1540,40" stroke="url(#goldGlow)" stroke-width="1.5" stroke-dasharray="12 6" opacity="0.6"/>
    <path d="M 60,640 L 1540,640" stroke="url(#goldGlow)" stroke-width="1.5" stroke-dasharray="12 6" opacity="0.6"/>
    <path d="M 60,70 L 60,40 L 90,40" fill="none" stroke="url(#goldGlow)" stroke-width="3" />
    <path d="M 1540,70 L 1540,40 L 1510,40" fill="none" stroke="url(#goldGlow)" stroke-width="3" />
    <path d="M 60,610 L 60,640 L 90,640" fill="none" stroke="url(#goldGlow)" stroke-width="3" />
    <path d="M 1540,610 L 1540,640 L 1510,640" fill="none" stroke="url(#goldGlow)" stroke-width="3" />

    <!-- Top Badge -->
    <rect x="90" y="85" width="310" height="40" rx="20" fill="url(#goldGlow)" filter="url(#shadow)" />
    <text x="245" y="111" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="14" font-weight="900" fill="#032112" text-anchor="middle" letter-spacing="1">
      ✦ ঐতিহ্যবাহী উৎসব ও ফ্যাশন মহোৎসব ✦
    </text>

    <!-- Main Bengali Calligraphic Headline -->
    <text x="90" y="225" font-family="'Segoe UI', 'Kalpurush', 'SolaimanLipi', 'Noto Sans Bengali', Arial, sans-serif" font-size="64" font-weight="900" fill="url(#goldGlow)" filter="url(#shadow)">
      উৎসবের রঙে সাজুন
    </text>

    <text x="90" y="300" font-family="'Segoe UI', 'Kalpurush', 'Noto Sans Bengali', Arial, sans-serif" font-size="34" font-weight="700" fill="#FFFFFF" filter="url(#shadow)">
      এক্সক্লুসিভ কোটি সেট, পাঞ্জাবি ও প্রিমিয়াম দুবাই আবায়া
    </text>

    <text x="90" y="360" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="20" font-weight="400" fill="#D1FAE5">
      নিখুঁত হ্যান্ডক্রাফটেড সুতার কাজ, আরামদায়ক সিল্ক-কটন ব্লেন্ড এবং শতভাগ পাকা রঙের নিশ্চয়তা।
    </text>

    <!-- Price Pill with Proper Spacing -->
    <g filter="url(#shadow)">
      <rect x="90" y="415" width="560" height="74" rx="16" fill="rgba(0, 0, 0, 0.75)" stroke="url(#goldGlow)" stroke-width="1.5" />
      <text x="115" y="445" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="13" font-weight="600" fill="#E2E8F0">
        উৎসবের বিশেষ অফার মূল্য
      </text>
      <text x="115" y="475" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="26" font-weight="900" fill="#34D399">
        মাত্র ৳১,৮৫০
      </text>
      <text x="295" y="474" font-family="'Segoe UI', Roboto, Arial, sans-serif" font-size="18" font-weight="600" fill="#94A3B8" text-decoration="line-through">
        ৳২,৪৫০
      </text>

      <rect x="390" y="432" width="225" height="40" rx="20" fill="url(#redBadge)" />
      <text x="502" y="458" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">
        ৳৬০০ ছাড় (২৫% OFF)
      </text>
    </g>

    <!-- Button -->
    <g filter="url(#shadow)">
      <rect x="90" y="525" width="220" height="56" rx="28" fill="url(#goldGlow)" />
      <text x="200" y="560" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="18" font-weight="900" fill="#021C0F" text-anchor="middle">
        অর্ডার করুন ➔
      </text>
    </g>

    <text x="340" y="560" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="16" font-weight="600" fill="#A7F3D0">
      ✓ পার্সেল খুলে চেক করে টাকা দিন (ক্যাশ অন ডেলিভারি)
    </text>

    <!-- Placeholder base circle behind photo -->
    <circle cx="${cx}" cy="${cy}" r="218" fill="#032112" stroke="url(#goldGlow)" stroke-width="6" />
  </svg>
  `;

  // Gold Rim and Badge to overlay directly over the photo
  const rimSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGlow2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFF3B0" />
        <stop offset="35%" stop-color="#FFD700" />
        <stop offset="70%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#D97706" />
      </linearGradient>
      <filter id="shadowRim">
        <feDropShadow dx="2" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.85"/>
      </filter>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="210" fill="none" stroke="url(#goldGlow2)" stroke-width="5" />
    <circle cx="${cx}" cy="${cy}" r="218" fill="none" stroke="rgba(255, 215, 0, 0.4)" stroke-width="2" />
    <g transform="translate(${cx}, 525)" filter="url(#shadowRim)">
      <rect x="-105" y="-18" width="210" height="36" rx="18" fill="url(#goldGlow2)" />
      <text x="0" y="6" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="13" font-weight="900" fill="#032112" text-anchor="middle">
        ★ ১০০% অরিজিনাল কালেকশন ★
      </text>
    </g>
  </svg>
  `;

  const photoBuf = await getCircularPhoto('koti_collection_banner.jpg', d, 'right');
  const composites = [];
  if (photoBuf) {
    composites.push({ input: photoBuf, left, top });
  }
  composites.push({ input: Buffer.from(rimSvg), left: 0, top: 0 });

  const outPath = path.join(bannersDir, 'bengali_calligraphy_festive_banner.jpg');
  await sharp(Buffer.from(bgSvg))
    .composite(composites)
    .jpeg({ quality: 92 })
    .toFile(outPath);
  console.log('Saved:', outPath);
}

// 2. BANNER: Deshi Kitchen & Home Appliances (দেশি কিচেন ও হোম অ্যাপ্লায়েন্স)
async function createKitchenCalligraphyBanner() {
  const width = 1600;
  const height = 680;
  const cx = 1260;
  const cy = 340;
  const d = 420;
  const left = cx - d / 2;
  const top = cy - d / 2;

  const bgSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="spiceBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1A0A02" />
        <stop offset="45%" stop-color="#381305" />
        <stop offset="85%" stop-color="#4A1807" />
        <stop offset="100%" stop-color="#150601" />
      </linearGradient>

      <linearGradient id="amberGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FEF08A" />
        <stop offset="40%" stop-color="#FBBF24" />
        <stop offset="70%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#EA580C" />
      </linearGradient>

      <linearGradient id="badgeFlame" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#EA580C" />
        <stop offset="100%" stop-color="#C2410C" />
      </linearGradient>

      <filter id="shadow2" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="2" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.85"/>
      </filter>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#spiceBg)" />

    ${generateAlponaCircle(cx, cy, 290, 'rgba(251, 191, 36, 0.22)')}
    ${generateAlponaCircle(80, 80, 100, 'rgba(251, 191, 36, 0.1)')}
    ${generateAlponaCircle(80, 600, 100, 'rgba(251, 191, 36, 0.1)')}

    <rect x="90" y="80" width="330" height="40" rx="20" fill="url(#amberGold)" filter="url(#shadow2)" />
    <text x="255" y="106" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="14" font-weight="900" fill="#1C0A00" text-anchor="middle">
      ✦ দেশি গৃহস্থালি ও আধুনিক কিচেন বাজার ✦
    </text>

    <text x="90" y="215" font-family="'Segoe UI', 'Kalpurush', 'Noto Sans Bengali', Arial, sans-serif" font-size="62" font-weight="900" fill="url(#amberGold)" filter="url(#shadow2)">
      দেশি কিচেন ও হোম অ্যাপ্লায়েন্স
    </text>

    <text x="90" y="295" font-family="'Segoe UI', 'Kalpurush', 'Noto Sans Bengali', Arial, sans-serif" font-size="32" font-weight="700" fill="#FFFFFF" filter="url(#shadow2)">
      খাঁটি মসলা বাটার শক্তিশালী ব্লেন্ডার, গ্রাইন্ডার ও রাইস কুকার
    </text>

    <text x="90" y="355" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="20" font-weight="400" fill="#FED7AA">
      জিরা, হলুদ, আদা-রসুন বাটা ও স্মুদি তৈরিতে ১০০% কপার মোটর এবং টেকসই স্টেইনলেস স্টিল ব্লেড।
    </text>

    <!-- Price Pill with Proper Spacing -->
    <g filter="url(#shadow2)">
      <rect x="90" y="415" width="560" height="74" rx="16" fill="rgba(0, 0, 0, 0.75)" stroke="url(#amberGold)" stroke-width="1.5" />
      <text x="115" y="445" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="13" font-weight="600" fill="#E2E8F0">
        স্পেশাল মেগা অফার মূল্য
      </text>
      <text x="115" y="475" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="26" font-weight="900" fill="#FBBF24">
        মাত্র ৳১,৯৫০
      </text>
      <text x="295" y="474" font-family="'Segoe UI', Roboto, Arial, sans-serif" font-size="18" font-weight="600" fill="#94A3B8" text-decoration="line-through">
        ৳২,৬০০
      </text>

      <rect x="390" y="432" width="225" height="40" rx="20" fill="url(#badgeFlame)" />
      <text x="502" y="458" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">
        ৳৬৫০ ছাড় (২৫% OFF)
      </text>
    </g>

    <g filter="url(#shadow2)">
      <rect x="90" y="525" width="220" height="56" rx="28" fill="url(#amberGold)" />
      <text x="200" y="560" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="18" font-weight="900" fill="#1C0A00" text-anchor="middle">
        অর্ডার করুন ➔
      </text>
    </g>

    <text x="340" y="560" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="16" font-weight="600" fill="#FDBA74">
      ✓ ঢাকা ও সারা বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি
    </text>

    <!-- Base Ring -->
    <circle cx="${cx}" cy="${cy}" r="218" fill="#1C0A02" stroke="url(#amberGold)" stroke-width="6" />
  </svg>
  `;

  const rimSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="amberGold2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FEF08A" />
        <stop offset="40%" stop-color="#FBBF24" />
        <stop offset="70%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#EA580C" />
      </linearGradient>
      <filter id="shadowRim2">
        <feDropShadow dx="2" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.85"/>
      </filter>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="210" fill="none" stroke="url(#amberGold2)" stroke-width="5" />
    <circle cx="${cx}" cy="${cy}" r="218" fill="none" stroke="rgba(251, 191, 36, 0.4)" stroke-width="2" />
    <g transform="translate(${cx}, 525)" filter="url(#shadowRim2)">
      <rect x="-105" y="-18" width="210" height="36" rx="18" fill="url(#amberGold2)" />
      <text x="0" y="6" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="13" font-weight="900" fill="#1C0A00" text-anchor="middle">
        ★ খাঁটি দেশি মশলা ও কিচেন ★
      </text>
    </g>
  </svg>
  `;

  // Use blender image if available, otherwise deshi spices curry
  const photoBuf = (await getCircularPhoto('kitchen_blender_appliance.jpg', d, 'center')) ||
                   (await getCircularPhoto('deshi_spices_curry.jpg', d, 'center'));

  const composites = [];
  if (photoBuf) {
    composites.push({ input: photoBuf, left, top });
  }
  composites.push({ input: Buffer.from(rimSvg), left: 0, top: 0 });

  const outPath = path.join(bannersDir, 'bengali_calligraphy_kitchen_banner.jpg');
  await sharp(Buffer.from(bgSvg))
    .composite(composites)
    .jpeg({ quality: 92 })
    .toFile(outPath);
  console.log('Saved:', outPath);
}

// 3. BANNER: Elegant Abaya & Borka Calligraphy Banner (মার্জিত আবায়া ও বোরকা কালেকশন)
async function createAbayaCalligraphyBanner() {
  const width = 1600;
  const height = 680;
  const cx = 1260;
  const cy = 340;
  const d = 420;
  const left = cx - d / 2;
  const top = cy - d / 2;

  const bgSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="plumBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E0A16" />
        <stop offset="45%" stop-color="#380F2A" />
        <stop offset="85%" stop-color="#4F133B" />
        <stop offset="100%" stop-color="#180512" />
      </linearGradient>

      <linearGradient id="roseGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFF1F2" />
        <stop offset="30%" stop-color="#FECDD3" />
        <stop offset="70%" stop-color="#F43F5E" />
        <stop offset="100%" stop-color="#BE123C" />
      </linearGradient>

      <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFF3B0" />
        <stop offset="40%" stop-color="#FFD700" />
        <stop offset="100%" stop-color="#F59E0B" />
      </linearGradient>

      <filter id="shadowAbaya" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="2" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.85"/>
      </filter>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#plumBg)" />

    ${generateAlponaCircle(cx, cy, 290, 'rgba(254, 205, 211, 0.22)')}
    ${generateAlponaCircle(100, 80, 110, 'rgba(254, 205, 211, 0.12)')}
    ${generateAlponaCircle(100, 600, 110, 'rgba(254, 205, 211, 0.12)')}

    <rect x="90" y="85" width="320" height="40" rx="20" fill="url(#goldGlow)" filter="url(#shadowAbaya)" />
    <text x="250" y="111" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="14" font-weight="900" fill="#2E081F" text-anchor="middle">
      ✦ এক্সক্লুসিভ দুবাই বোরকা ও আবায়া ✦
    </text>

    <text x="90" y="225" font-family="'Segoe UI', 'Kalpurush', 'Noto Sans Bengali', Arial, sans-serif" font-size="64" font-weight="900" fill="url(#goldGlow)" filter="url(#shadowAbaya)">
      মার্জিত ও স্নিগ্ধ ফ্যাশন
    </text>

    <text x="90" y="300" font-family="'Segoe UI', 'Kalpurush', 'Noto Sans Bengali', Arial, sans-serif" font-size="34" font-weight="700" fill="#FFFFFF" filter="url(#shadowAbaya)">
      প্রিমিয়াম দুবাই চেরি জর্জেট পার্টি আবায়া কালেকশন
    </text>

    <text x="90" y="360" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="20" font-weight="400" fill="#FFE4E6">
      মার্জিত কাট, নিখুঁত স্টোন ও হ্যান্ড এম্ব্রয়ডারি ওয়ার্ক। ১০০% পাকা রঙ ও প্রিমিয়াম সফট ফেব্রিক।
    </text>

    <!-- Price Pill -->
    <g filter="url(#shadowAbaya)">
      <rect x="90" y="415" width="560" height="74" rx="16" fill="rgba(0, 0, 0, 0.75)" stroke="url(#goldGlow)" stroke-width="1.5" />
      <text x="115" y="445" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="13" font-weight="600" fill="#E2E8F0">
        উৎসবের বিশেষ অফার মূল্য
      </text>
      <text x="115" y="475" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="26" font-weight="900" fill="#FDA4AF">
        মাত্র ৳২,২৫০
      </text>
      <text x="295" y="474" font-family="'Segoe UI', Roboto, Arial, sans-serif" font-size="18" font-weight="600" fill="#94A3B8" text-decoration="line-through">
        ৳২,৮৫০
      </text>

      <rect x="390" y="432" width="225" height="40" rx="20" fill="#E11D48" />
      <text x="502" y="458" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">
        ৳৬০০ ছাড় (২১% OFF)
      </text>
    </g>

    <g filter="url(#shadowAbaya)">
      <rect x="90" y="525" width="220" height="56" rx="28" fill="url(#goldGlow)" />
      <text x="200" y="560" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="18" font-weight="900" fill="#2E081F" text-anchor="middle">
        অর্ডার করুন ➔
      </text>
    </g>

    <text x="340" y="560" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="16" font-weight="600" fill="#FECDD3">
      ✓ পার্সেল খুলে চেক করে টাকা দিন (ক্যাশ অন ডেলিভারি)
    </text>

    <!-- Base Ring -->
    <circle cx="${cx}" cy="${cy}" r="218" fill="#1E0A16" stroke="url(#goldGlow)" stroke-width="6" />
  </svg>
  `;

  const rimSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGlow3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFF3B0" />
        <stop offset="40%" stop-color="#FFD700" />
        <stop offset="100%" stop-color="#F59E0B" />
      </linearGradient>
      <filter id="shadowRim3">
        <feDropShadow dx="2" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.85"/>
      </filter>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="210" fill="none" stroke="url(#goldGlow3)" stroke-width="5" />
    <circle cx="${cx}" cy="${cy}" r="218" fill="none" stroke="rgba(255, 215, 0, 0.4)" stroke-width="2" />
    <g transform="translate(${cx}, 525)" filter="url(#shadowRim3)">
      <rect x="-105" y="-18" width="210" height="36" rx="18" fill="url(#goldGlow3)" />
      <text x="0" y="6" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="13" font-weight="900" fill="#2E081F" text-anchor="middle">
        ★ প্রিমিয়াম চেরি জর্জেট ★
      </text>
    </g>
  </svg>
  `;

  const photoBuf = await getCircularPhoto('abaya_collection_banner.jpg', d, 'right');
  const composites = [];
  if (photoBuf) {
    composites.push({ input: photoBuf, left, top });
  }
  composites.push({ input: Buffer.from(rimSvg), left: 0, top: 0 });

  const outPath = path.join(bannersDir, 'bengali_calligraphy_abaya_banner.jpg');
  await sharp(Buffer.from(bgSvg))
    .composite(composites)
    .jpeg({ quality: 92 })
    .toFile(outPath);
  console.log('Saved:', outPath);
}

// 4. BANNER: Dhamaka Sale Banner (ধামাকা অফার সপ্তাহ - ৫০% পর্যন্ত বিশেষ ছাড়)
async function createDhamakaSaleBanner() {
  const width = 1200;
  const height = 500;
  const cx = 970;
  const cy = 250;
  const d = 320;
  const left = cx - d / 2;
  const top = cy - d / 2;

  const bgSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="redRuby" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#450A0A" />
        <stop offset="50%" stop-color="#7F1D1D" />
        <stop offset="100%" stop-color="#180303" />
      </linearGradient>

      <linearGradient id="goldCalligraphy" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFBEB" />
        <stop offset="40%" stop-color="#FCD34D" />
        <stop offset="80%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#D97706" />
      </linearGradient>

      <filter id="shadow3" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="2" dy="3" stdDeviation="5" flood-color="#000" flood-opacity="0.8"/>
      </filter>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#redRuby)" />

    ${generateAlponaCircle(cx, cy, 210, 'rgba(253, 224, 71, 0.2)')}
    ${generateAlponaCircle(70, 70, 90, 'rgba(253, 224, 71, 0.12)')}

    <rect x="70" y="60" width="230" height="34" rx="17" fill="url(#goldCalligraphy)" filter="url(#shadow3)" />
    <text x="185" y="83" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="13" font-weight="900" fill="#450A0A" text-anchor="middle">
      ✦ ধামাকা অফার সপ্তাহ ✦
    </text>

    <text x="70" y="165" font-family="'Segoe UI', 'Kalpurush', 'Noto Sans Bengali', Arial, sans-serif" font-size="50" font-weight="900" fill="url(#goldCalligraphy)" filter="url(#shadow3)">
      ৫০% পর্যন্ত বিশেষ ছাড়
    </text>

    <text x="70" y="230" font-family="'Segoe UI', 'Kalpurush', 'Noto Sans Bengali', Arial, sans-serif" font-size="25" font-weight="700" fill="#FFFFFF" filter="url(#shadow3)">
      হোম অ্যাপ্লায়েন্স, প্রিমিয়াম পোশাক ও স্মার্ট গ্যাজেটে
    </text>

    <text x="70" y="280" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="16" font-weight="400" fill="#FECACA">
      সীমিত সময়ের অবিশ্বাস্য মূল্যছাড়। যেকোনো ৩টি পণ্য অর্ডারে সারা দেশে ডেলিভারি ফ্রি!
    </text>

    <g filter="url(#shadow3)">
      <rect x="70" y="340" width="190" height="52" rx="26" fill="url(#goldCalligraphy)" />
      <text x="165" y="373" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="16" font-weight="900" fill="#450A0A" text-anchor="middle">
        কালেকশন দেখুন ➔
      </text>
    </g>

    <text x="285" y="373" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="14" font-weight="700" fill="#FDE68A">
      ✓ ক্যাশ অন ডেলিভারি | ১০০% অরিজিনাল
    </text>

    <!-- Base Ring -->
    <circle cx="${cx}" cy="${cy}" r="165" fill="#2B0505" stroke="url(#goldCalligraphy)" stroke-width="5"/>
  </svg>
  `;

  const rimSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldCalligraphy2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFBEB" />
        <stop offset="40%" stop-color="#FCD34D" />
        <stop offset="80%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#D97706" />
      </linearGradient>
      <filter id="shadow3Rim">
        <feDropShadow dx="2" dy="3" stdDeviation="5" flood-color="#000" flood-opacity="0.8"/>
      </filter>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="160" fill="none" stroke="url(#goldCalligraphy2)" stroke-width="4" />
    <g transform="translate(${cx}, 380)" filter="url(#shadow3Rim)">
      <rect x="-70" y="-15" width="140" height="30" rx="15" fill="#DC2626" />
      <text x="0" y="6" font-family="'Segoe UI', Roboto, Arial, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">
        50% OFF
      </text>
    </g>
  </svg>
  `;

  const photoBuf = await getCircularPhoto('gadgets_lifestyle_banner.jpg', d, 'center');
  const composites = [];
  if (photoBuf) {
    composites.push({ input: photoBuf, left, top });
  }
  composites.push({ input: Buffer.from(rimSvg), left: 0, top: 0 });

  const outPath = path.join(bannersDir, 'bengali_calligraphy_dhamaka_sale.jpg');
  await sharp(Buffer.from(bgSvg))
    .composite(composites)
    .jpeg({ quality: 92 })
    .toFile(outPath);
  console.log('Saved:', outPath);
}

// 5. BANNER: Organic Deshi Foods (খাঁটি দেশি পণ্যের আস্থা)
async function createOrganicDeshiBanner() {
  const width = 1200;
  const height = 500;
  const cx = 970;
  const cy = 250;
  const d = 320;
  const left = cx - d / 2;
  const top = cy - d / 2;

  const bgSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#022C22" />
        <stop offset="50%" stop-color="#064E3B" />
        <stop offset="100%" stop-color="#021C14" />
      </linearGradient>

      <linearGradient id="honeyGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FEF08A" />
        <stop offset="50%" stop-color="#FBBF24" />
        <stop offset="100%" stop-color="#F59E0B" />
      </linearGradient>

      <filter id="shadow4" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="2" dy="3" stdDeviation="5" flood-color="#000" flood-opacity="0.8"/>
      </filter>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#tealGrad)" />

    ${generateAlponaCircle(cx, cy, 210, 'rgba(251, 191, 36, 0.2)')}
    ${generateAlponaCircle(70, 70, 90, 'rgba(251, 191, 36, 0.12)')}

    <rect x="70" y="60" width="240" height="34" rx="17" fill="url(#honeyGold)" filter="url(#shadow4)" />
    <text x="190" y="83" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="13" font-weight="900" fill="#022C22" text-anchor="middle">
      ✦ ১০০% প্রাকৃতিক ও বিশুদ্ধ ✦
    </text>

    <text x="70" y="165" font-family="'Segoe UI', 'Kalpurush', 'Noto Sans Bengali', Arial, sans-serif" font-size="48" font-weight="900" fill="url(#honeyGold)" filter="url(#shadow4)">
      খাঁটি দেশি পণ্যের আস্থা
    </text>

    <text x="70" y="230" font-family="'Segoe UI', 'Kalpurush', 'Noto Sans Bengali', Arial, sans-serif" font-size="25" font-weight="700" fill="#FFFFFF" filter="url(#shadow4)">
      সুন্দরবনের প্রাকৃতিক কাঁচা মধু ও কাঠের ঘানির সরিষার তেল
    </text>

    <text x="70" y="280" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="16" font-weight="400" fill="#A7F3D0">
      কোনো প্রিজারভেটিভ বা ভেজাল নেই। স্বাস্থ্যকর দেশি স্বাদে আপনার পরিবার রাখুন সুরক্ষিত।
    </text>

    <g filter="url(#shadow4)">
      <rect x="70" y="340" width="190" height="52" rx="26" fill="url(#honeyGold)" />
      <text x="165" y="373" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="16" font-weight="900" fill="#022C22" text-anchor="middle">
        অর্ডার করুন ➔
      </text>
    </g>

    <text x="285" y="373" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="14" font-weight="700" fill="#FDE68A">
      ✓ খাঁটি মধু ও তেলের আকর্ষণীয় কম্বো অফার
    </text>

    <!-- Base Ring -->
    <circle cx="${cx}" cy="${cy}" r="165" fill="#042F24" stroke="url(#honeyGold)" stroke-width="5"/>
  </svg>
  `;

  const rimSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="honeyGold2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FEF08A" />
        <stop offset="50%" stop-color="#FBBF24" />
        <stop offset="100%" stop-color="#F59E0B" />
      </linearGradient>
      <filter id="shadow4Rim">
        <feDropShadow dx="2" dy="3" stdDeviation="5" flood-color="#000" flood-opacity="0.8"/>
      </filter>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="160" fill="none" stroke="url(#honeyGold2)" stroke-width="4" />
    <g transform="translate(${cx}, 380)" filter="url(#shadow4Rim)">
      <rect x="-70" y="-15" width="140" height="30" rx="15" fill="#059669" />
      <text x="0" y="6" font-family="'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle">
        ১০০% খাঁটি পণ্য
      </text>
    </g>
  </svg>
  `;

  const photoBuf = (await getCircularPhoto('deshi_aromatic_spices.jpg', d, 'center')) ||
                   (await getCircularPhoto('deshi_mortar_pestle_spices.jpg', d, 'center'));

  const composites = [];
  if (photoBuf) {
    composites.push({ input: photoBuf, left, top });
  }
  composites.push({ input: Buffer.from(rimSvg), left: 0, top: 0 });

  const outPath = path.join(bannersDir, 'bengali_calligraphy_organic_deshi.jpg');
  await sharp(Buffer.from(bgSvg))
    .composite(composites)
    .jpeg({ quality: 92 })
    .toFile(outPath);
  console.log('Saved:', outPath);
}

async function run() {
  console.log('Starting Bengali Calligraphy & E-Commerce Composite Banner Generation...');
  await createFestiveCalligraphyBanner();
  await createKitchenCalligraphyBanner();
  await createAbayaCalligraphyBanner();
  await createDhamakaSaleBanner();
  await createOrganicDeshiBanner();
  console.log('✨ All 5 Bengali Calligraphy Banners successfully generated!');
}

run();
