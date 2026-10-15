// scripts/init-db.js
// Run directly: node scripts/init-db.js
// Initializes MongoDB indexes and seeds store data

import { initDatabase } from '../lib/db-init.js';

async function main() {
  console.log('🔄 Initializing Bichitra Shop database and indexes...');
  try {
    await initDatabase();
    console.log('✅ Database initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();
