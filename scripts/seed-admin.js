// scripts/seed-admin.js
// Run directly: node scripts/seed-admin.js [email] [password]
// Securely provisions or resets an administrator account

import { getCollection } from '../lib/mongodb.js';
import { hashPassword } from '../lib/auth.js';

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@bichitrashop.com';
  const plainPassword = process.argv[3] || process.env.ADMIN_PASSWORD || 'BichitraAdmin2026!';

  console.log(`🔒 Provisioning administrator: ${email}...`);

  try {
    const admins = await getCollection('admins');
    const passwordHash = await hashPassword(plainPassword);

    const existing = await admins.findOne({ email });
    if (existing) {
      await admins.updateOne(
        { email },
        {
          $set: {
            passwordHash,
            updatedAt: new Date().toISOString()
          }
        }
      );
      console.log(`✅ Administrator password updated for ${email}`);
    } else {
      await admins.insertOne({
        email,
        passwordHash,
        role: 'superadmin',
        name: 'Bichitra Shop Administrator',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Initial administrator created: ${email}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to provision administrator:', err);
    process.exit(1);
  }
}

main();
