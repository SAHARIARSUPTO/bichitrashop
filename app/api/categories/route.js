// app/api/categories/route.js
// Public API: List active categories

import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export async function GET() {
  try {
    await initDatabase();
    const categories = await getCollection('categories');
    const items = await categories.find({ status: 'active' }).toArray();

    return Response.json({
      success: true,
      categories: items
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json(
      { success: false, error: 'ক্যাটাগরি লোড করা যায়নি।' },
      { status: 500 }
    );
  }
}
