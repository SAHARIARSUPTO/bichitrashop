// app/admin/orders/page.jsx
import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';
import OrderManager from './OrderManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'অর্ডার ব্যবস্থাপনা | Bichitra Shop Admin'
};

async function getOrdersData() {
  await initDatabase();
  const ordersColl = await getCollection('orders');
  const orders = await ordersColl.find({}).sort({ createdAt: -1 }).toArray();
  return JSON.parse(JSON.stringify(orders));
}

export default async function AdminOrdersPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const orders = await getOrdersData();

  return <OrderManager initialOrders={orders} />;
}
