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
  const productsColl = await getCollection('products');

  const [orders, products] = await Promise.all([
    ordersColl.find({}).sort({ createdAt: -1 }).toArray(),
    productsColl.find({ status: 'published' }).toArray()
  ]);

  return {
    orders: JSON.parse(JSON.stringify(orders)),
    products: JSON.parse(JSON.stringify(products))
  };
}

export default async function AdminOrdersPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const { orders, products } = await getOrdersData();

  return <OrderManager initialOrders={orders} initialProducts={products} />;
}
