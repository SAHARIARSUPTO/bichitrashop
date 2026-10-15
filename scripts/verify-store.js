// scripts/verify-store.js
// Automated end-to-end HTTP verification of Bichitra Shop on localhost:3000

const BASE_URL = 'http://localhost:3000';

async function runVerification() {
  console.log('🚀 Starting Bichitra Shop Live Verification against', BASE_URL, '...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Homepage
  await test('Homepage loads successfully with 200 OK', async () => {
    const res = await fetch(`${BASE_URL}/`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const text = await res.text();
    if (!text.includes('Bichitra') || !text.includes('বিচিত্র শপ')) {
      throw new Error('Homepage missing brand title');
    }
  });

  // 2. Robots.txt
  await test('Robots.txt returns 200 and disallows /admin', async () => {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const text = await res.text();
    if (!text.includes('Disallow: /admin')) throw new Error('Missing disallow /admin');
  });

  // 3. Sitemap.xml
  await test('Sitemap.xml dynamically returns indexable URLs', async () => {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const text = await res.text();
    if (!text.includes('/products/')) throw new Error('Sitemap missing product URLs');
  });

  // 4. Products Catalog Page & API
  await test('Public Products API returns catalog list', async () => {
    const res = await fetch(`${BASE_URL}/api/products`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.products) || data.products.length === 0) {
      throw new Error('API products list empty or failed');
    }
  });

  // 5. Product Details SSR Page
  await test('Product details page for exclusive-embroidered-koti-set loads with JSON-LD', async () => {
    const res = await fetch(`${BASE_URL}/products/exclusive-embroidered-koti-set`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const text = await res.text();
    if (!text.includes('schema.org') || !text.includes('এক্সক্লুসিভ')) {
      throw new Error('Product details page missing title or JSON-LD');
    }
  });

  // 6. Checkout Order Placement
  let orderRef = '';
  let confirmToken = '';
  let cookieHeader = '';

  await test('Guest checkout places order with server-calculated price snapshot', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'সাকিব আল হাসান',
        customerPhone: '01711223344',
        customerAddress: 'বাড়ি ৫, রোড ২, মিরপুর ২',
        customerDistrict: 'ঢাকা (Dhaka)',
        productId: 'exclusive-embroidered-koti-set',
        quantity: 1,
        variant: { size: 'L (40)', color: 'রয়েল নেভি ব্লু' },
        deliveryZone: 'inside_dhaka'
      })
    });

    if (res.status !== 201) throw new Error(`Order placement status: ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.orderReference) throw new Error('Order creation missing reference');
    orderRef = data.orderReference;
    confirmToken = data.confirmationToken;
    cookieHeader = res.headers.get('set-cookie') || '';
    if (data.total !== 1850 + 70) {
      throw new Error(`Total calculated incorrectly: expected ${1850 + 70}, got ${data.total}`);
    }
  });

  // 7. Thank-You Page with Token Verification
  await test('Thank-you page successfully verifies high-entropy token', async () => {
    const res = await fetch(`${BASE_URL}/api/orders/${orderRef}?token=${confirmToken}`);
    if (res.status !== 200) throw new Error(`Order confirmation status: ${res.status}`);
    const data = await res.json();
    if (!data.success || data.order.orderReference !== orderRef) {
      throw new Error('Order confirmation reference mismatch');
    }
    if (data.order.customer.name !== 'সাকিব আল হাসান') {
      throw new Error('Customer name mismatch in receipt');
    }
  });

  // 8. Order Access Control without token (Security requirement)
  await test('Unauthorized order access without token is blocked with 403', async () => {
    const res = await fetch(`${BASE_URL}/api/orders/${orderRef}`);
    if (res.status !== 403) {
      throw new Error(`Security breach: expected 403 Forbidden, got ${res.status}`);
    }
  });

  // 9. Admin Authentication
  let adminCookie = '';
  await test('Admin login issues secure session cookie', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@bichitrashop.com',
        password: 'BichitraAdmin2026!'
      })
    });

    if (res.status !== 200) throw new Error(`Admin login status: ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Admin login failed');
    adminCookie = res.headers.get('set-cookie');
    if (!adminCookie || !adminCookie.includes('bichitra_admin_token')) {
      throw new Error('Missing bichitra_admin_token in Set-Cookie header');
    }
  });

  // 10. Admin Dashboard Metrics
  await test('Admin dashboard computes live operational metrics', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { Cookie: adminCookie }
    });
    if (res.status !== 200) throw new Error(`Dashboard status: ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.metrics) throw new Error('Dashboard missing metrics');
    if (data.metrics.totalOrders < 1) throw new Error('Dashboard orders count should be >= 1');
  });

  // 11. Admin Orders Status Lifecycle
  await test('Admin can update order status lifecycle with audit timeline', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders/${orderRef}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie
      },
      body: JSON.stringify({
        status: 'confirmed',
        note: 'কাস্টমারের সাথে কথা বলে অর্ডার নিশ্চিত করা হয়েছে।'
      })
    });

    if (res.status !== 200) throw new Error(`Status update status: ${res.status}`);
    const data = await res.json();
    if (!data.success || data.orderStatus !== 'confirmed') {
      throw new Error('Status transition to confirmed failed');
    }
  });

  console.log(`\n========================================`);
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runVerification().catch(err => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
