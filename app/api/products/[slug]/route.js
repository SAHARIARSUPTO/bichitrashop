// app/api/products/[slug]/route.js
// Public API: Fetch a single published product by unique slug and fetch related products

import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export async function GET(request, { params }) {
  try {
    await initDatabase();
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    if (!slug) {
      return Response.json({ success: false, error: 'Product slug is required' }, { status: 400 });
    }

    const products = await getCollection('products');
    const product = await products.findOne({
      slug: slug.trim(),
      status: 'published'
    });

    if (!product) {
      return Response.json(
        { success: false, error: 'পণ্যটি পাওয়া যায়নি অথবা বর্তমানে বিক্রয়যোগ্য নয়।' },
        { status: 404 }
      );
    }

    // Fetch up to 4 related products from the same category
    let relatedProducts = [];
    if (product.category) {
      relatedProducts = await products
        .find({
          category: product.category,
          status: 'published',
          slug: { $ne: product.slug }
        })
        .limit(4)
        .toArray();
    }

    return Response.json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return Response.json(
      { success: false, error: 'পণ্যের বিবরণ লোড করা যায়নি।' },
      { status: 500 }
    );
  }
}
