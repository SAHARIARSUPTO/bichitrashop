// app/admin/settings/page.jsx
import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';
import SettingsManager from './SettingsManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'স্টোর সেটিংস | Bichitra Shop Admin'
};

async function getSettingsData() {
  await initDatabase();
  const settingsColl = await getCollection('settings');
  const settings = await settingsColl.findOne({ key: 'store_settings' });
  return JSON.parse(JSON.stringify(settings || {}));
}

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const settings = await getSettingsData();

  return <SettingsManager initialSettings={settings} />;
}
