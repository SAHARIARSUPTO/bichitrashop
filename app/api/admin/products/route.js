// app/api/admin/products/route.js
// Admin API: List all products and create a new product with auto slug generation

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { productSchema } from '@/lib/validation';
import { generateUniqueSlug } from '@/lib/slug';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const products = await getCollection('products');
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    } else {
      query.status = { $ne: 'archived' };
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { slug: { $regex: term, $options: 'i' } }
      ];
    }

    const items = await products
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      products: items
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return Response.json({ success: false, error: 'পণ্যের তালিকা লোড করা যায়নি।' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = productSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues?.[0]?.message ||
        parseResult.error.errors?.[0]?.message ||
        'পণ্যের তথ্য সঠিক নয়।';
      return Response.json(
        {
          success: false,
          error: firstError,
          details: parseResult.error.format()
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const products = await getCollection('products');

    // Auto-generate clean, unique slug
    const finalSlug = data.slug && data.slug.trim()
      ? await generateUniqueSlug(data.slug, products)
      : await generateUniqueSlug(data.name, products);

    const newProduct = {
      name: data.name,
      slug: finalSlug,
      shortDescription: data.shortDescription,
      description: data.description,
      category: data.category,
      price: data.price,
      compareAtPrice: data.compareAtPrice || null,
      images: data.images,
      variants: data.variants || {},
      stockQuantity: data.stockQuantity,
      status: data.status || 'published',
      featured: Boolean(data.featured),
      seo: {
        title: data.seo?.title || data.name,
        description: data.seo?.description || data.shortDescription,
        canonicalUrl: data.seo?.canonicalUrl || ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const res = await products.insertOne(newProduct);

    return Response.json(
      {
        success: true,
        message: 'পণ্য সফলভাবে তৈরি হয়েছে।',
        product: { ...newProduct, _id: res.insertedId }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return Response.json({ success: false, error: 'পণ্য তৈরি করতে ত্রুটি ঘটেছে।' }, { status: 500 });
  }
}
