// app/admin/banners/page.jsx
import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';
import BannerManager from './BannerManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'ব্যানার ও স্লাইডার ব্যবস্থাপনা | Bichitra Shop Admin'
};

async function getBannersData() {
  await initDatabase();
  const settingsColl = await getCollection('settings');
  const productsColl = await getCollection('products');

  const [settings, products] = await Promise.all([
    settingsColl.findOne({ key: 'store_settings' }),
    productsColl.find({ status: 'published' }).sort({ name: 1 }).toArray()
  ]);

  return {
    settings: JSON.parse(JSON.stringify(settings || {})),
    products: JSON.parse(JSON.stringify(products || []))
  };
}

export default async function AdminBannersPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const { settings, products } = await getBannersData();

  return <BannerManager initialSettings={settings} products={products} />;
}
