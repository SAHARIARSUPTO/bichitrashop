// app/api/products/route.js
// Public API: List published products with search, category filtering, and sorting

import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export async function GET(request) {
  try {
    // Ensure DB and sample seeds are initialized
    await initDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '12', 10)));
    const featuredOnly = searchParams.get('featured') === 'true';

    const products = await getCollection('products');

    const query = {
      status: 'published'
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featuredOnly) {
      query.featured = true;
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { shortDescription: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'popular') {
      sortOption = { featured: -1, createdAt: -1 };
    }

    const totalCount = await products.countDocuments(query);
    const skip = (page - 1) * limit;

    const items = await products
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    return Response.json({
      success: true,
      products: items,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching public products:', error);
    return Response.json(
      { success: false, error: 'পণ্যের তথ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
