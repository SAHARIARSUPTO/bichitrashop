// scripts/test-api-product-upload.js
// Verify end-to-end admin login, image upload API, and product creation via HTTP

async function testApi() {
  const baseUrl = 'http://localhost:3000';

  console.log('1. Logging in as admin...');
  const loginRes = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@bichitrashop.com',
      password: 'BichitraAdmin2026!'
    })
  });

  const loginData = await loginRes.json();
  if (!loginRes.ok || !loginData.success) {
    console.error('Admin login failed:', loginData);
    process.exit(1);
  }

  // Extract set-cookie
  const cookie = loginRes.headers.get('set-cookie');
  console.log('✔ Admin logged in successfully.');

  // 2. Test Image Upload
  console.log('2. Testing image upload API...');
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const dummyImageBytes = Buffer.from('fake-image-bytes-for-test-png');
  
  // Construct multipart form data
  const formData = new FormData();
  const fileBlob = new Blob([dummyImageBytes], { type: 'image/png' });
  formData.append('file', fileBlob, 'test-gadget.png');
  formData.append('folder', 'bichitra_shop/products');

  const uploadRes = await fetch(`${baseUrl}/api/admin/upload`, {
    method: 'POST',
    headers: {
      cookie: cookie || ''
    },
    body: formData
  });

  const uploadData = await uploadRes.json();
  console.log('Upload response:', uploadData);
  if (!uploadRes.ok || !uploadData.success) {
    console.error('Upload failed:', uploadData);
    process.exit(1);
  }
  console.log('✔ Image upload succeeded. URL:', uploadData.url);

  // 3. Test Product Creation with new category 'gadgets' & warranty
  console.log('3. Creating new gadget product...');
  const newProdRes = await fetch(`${baseUrl}/api/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookie || ''
    },
    body: JSON.stringify({
      name: 'অরিজিনাল ব্লুটুথ ৫.৩ স্মার্ট ফিটনেস ওয়াচ',
      shortDescription: 'হার্ট রেট মনিটর, অ্যামোলেড ডিসপ্লে ও ৭ দিনের ব্যাটারি লাইফ।',
      description: `প্রতিদিনের ফিটনেস ট্র্যাকিং ও স্মার্ট নোটিফিকেশনের জন্য সেরা স্মার্টওয়াচ।
• ১.৯৬ ইঞ্চি এইচডি অ্যামোলেড ডিসপ্লে
• ব্লুটুথ কলিং ও নোটিফিকেশন সাপোর্ট
• আইপি৬৮ ওয়াটার রেজিস্ট্যান্স
• ১ বছর অফিসিয়াল রিপ্লেসমেন্ট ওয়ারেন্টি`,
      category: 'gadgets',
      price: 2450,
      compareAtPrice: 3200,
      images: [uploadData.url],
      variants: {
        colors: ['জেট ব্ল্যাক', 'স্পেস গ্রে'],
        warranty: '১ বছর অফিসিয়াল রিপ্লেসমেন্ট ওয়ারেন্টি',
        specs: 'অ্যামোলেড ডিসপ্লে, ব্লুটুথ কলিং, IP68'
      },
      stockQuantity: 40,
      status: 'published',
      featured: true
    })
  });

  const newProdData = await newProdRes.json();
  console.log('Create product response:', newProdData);
  if (!newProdRes.ok || !newProdData.success) {
    console.error('Product creation failed:', newProdData);
    process.exit(1);
  }
  console.log('✔ Product created successfully with slug:', newProdData.product?.slug);

  // 4. Verify public fetch of the new product
  console.log('4. Verifying public product retrieval...');
  const fetchRes = await fetch(`${baseUrl}/api/products`);
  const fetchData = await fetchRes.json();
  const found = fetchData.products?.find(p => p.slug === newProdData.product?.slug);
  if (!found) {
    console.error('Created product not found in public list');
    process.exit(1);
  }
  console.log('✔ Verified product appears in store catalogue with category:', found.category);
  console.log('All end-to-end tests passed!');
  process.exit(0);
}

testApi().catch(err => {
  console.error('Test API error:', err);
  process.exit(1);
});
