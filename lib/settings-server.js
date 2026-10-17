// lib/settings-server.js
// Server-only store settings fetcher for Next.js Server Components
import { getCollection } from './mongodb.js';

/**
 * Fetch dynamic store settings for SEO, Contact and Branding (Server Component only)
 */
export async function getStoreSettings() {
  try {
    const settingsColl = await getCollection('settings');
    const settings = await settingsColl.findOne({ key: 'store_settings' });
    return settings || null;
  } catch (error) {
    console.error('Failed to load store settings for SEO:', error);
    return null;
  }
}
