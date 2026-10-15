// app/admin/products/page.jsx
import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';
import ProductManager from './ProductManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'পণ্য ব্যবস্থাপনা | Bichitra Shop Admin'
};

async function getProductsData() {
  await initDatabase();
  const productsColl = await getCollection('products');
  const categoriesColl = await getCollection('categories');

  const [products, categories] = await Promise.all([
    productsColl.find({ status: { $ne: 'archived' } }).sort({ createdAt: -1 }).toArray(),
    categoriesColl.find({ status: 'active' }).toArray()
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    categories: JSON.parse(JSON.stringify(categories))
  };
}

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const { products, categories } = await getProductsData();

  return <ProductManager initialProducts={products} categories={categories} />;
}
