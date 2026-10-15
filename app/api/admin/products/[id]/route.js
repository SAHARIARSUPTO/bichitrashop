// app/api/admin/products/[id]/route.js
// Admin API: Single product retrieval, update, and soft deletion

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection, ObjectId } from '@/lib/mongodb';
import { generateUniqueSlug } from '@/lib/slug';

function parseIdQuery(id) {
  try {
    return { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
  } catch {
    return { _id: id };
  }
}

export async function GET(request, { params }) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const products = await getCollection('products');
    const product = await products.findOne(parseIdQuery(id));

    if (!product) {
      return Response.json({ success: false, error: 'পণ্যটি পাওয়া যায়নি।' }, { status: 404 });
    }

    return Response.json({ success: true, product });
  } catch (error) {
    return Response.json({ success: false, error: 'পণ্যের তথ্য লোড করা যায়নি।' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    const products = await getCollection('products');
    const existing = await products.findOne(parseIdQuery(id));

    if (!existing) {
      return Response.json({ success: false, error: 'পণ্যটি পাওয়া যায়নি।' }, { status: 404 });
    }

    const updateFields = {};

    if (body.name !== undefined) updateFields.name = body.name.trim();
    if (body.shortDescription !== undefined) updateFields.shortDescription = body.shortDescription.trim();
    if (body.description !== undefined) updateFields.description = body.description.trim();
    if (body.category !== undefined) updateFields.category = body.category.trim();
    if (body.price !== undefined) updateFields.price = Math.round(Number(body.price));
    if (body.compareAtPrice !== undefined) {
      updateFields.compareAtPrice = body.compareAtPrice ? Math.round(Number(body.compareAtPrice)) : null;
    }
    if (body.images !== undefined) updateFields.images = body.images;
    if (body.variants !== undefined) updateFields.variants = body.variants;
    if (body.stockQuantity !== undefined) updateFields.stockQuantity = Math.max(0, parseInt(body.stockQuantity, 10));
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.featured !== undefined) updateFields.featured = Boolean(body.featured);
    if (body.seo !== undefined) updateFields.seo = body.seo;

    // Handle slug change safely
    if (body.slug && body.slug.trim() && body.slug !== existing.slug) {
      updateFields.slug = await generateUniqueSlug(body.slug, products, existing._id);
    }

    updateFields.updatedAt = new Date().toISOString();

    await products.updateOne(parseIdQuery(id), { $set: updateFields });

    const updated = await products.findOne(parseIdQuery(id));
    return Response.json({
      success: true,
      message: 'পণ্য সফলভাবে আপডেট করা হয়েছে।',
      product: updated
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return Response.json({ success: false, error: 'পণ্য আপডেট করতে সমস্যা হয়েছে।' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const products = await getCollection('products');
    const existing = await products.findOne(parseIdQuery(id));

    if (!existing) {
      return Response.json({ success: false, error: 'পণ্যটি পাওয়া যায়নি।' }, { status: 404 });
    }

    // Soft delete / archive to ensure historical orders remain intact
    await products.updateOne(parseIdQuery(id), {
      $set: {
        status: 'archived',
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });

    return Response.json({
      success: true,
      message: 'পণ্যটি সফলভাবে আর্কাইভ/মুছে ফেলা হয়েছে। পূর্বের অর্ডার অক্ষত রয়েছে।'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return Response.json({ success: false, error: 'পণ্য মুছতে সমস্যা হয়েছে।' }, { status: 500 });
  }
}
