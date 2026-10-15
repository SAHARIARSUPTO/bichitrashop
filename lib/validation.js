// lib/validation.js
// Zod schema validation for API boundaries and form submissions

import { z } from 'zod';

/**
 * Standardize Bangladesh mobile numbers to standard local format: 01XXXXXXXXX
 * Valid prefixes: 013, 014, 015, 016, 017, 018, 019 (GP, Banglalink, Robi, Airtel, Teletalk, Skitto)
 */
export function normalizeBangladeshPhone(phone) {
  if (!phone) return '';
  let cleaned = phone.toString().replace(/[^\d]/g, '');
  if (cleaned.startsWith('880')) {
    cleaned = cleaned.slice(2);
  } else if (!cleaned.startsWith('0') && cleaned.startsWith('1')) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
}

export const bangladeshPhoneRegex = /^(?:\+?88)?0?1[3-9]\d{8}$/;

// Checkout Form Schema
export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, { message: 'আপনার পূর্ণ নাম লিখুন (কমপক্ষে ২ অক্ষর)' })
    .max(100, { message: 'নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারবে' })
    .trim(),
  customerPhone: z
    .string()
    .trim()
    .refine((val) => bangladeshPhoneRegex.test(val), {
      message: 'সঠিক বাংলাদেশি ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)'
    })
    .transform(normalizeBangladeshPhone),
  customerAddress: z
    .string()
    .min(5, { message: 'সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (বাসা/রোড/এলাকা)' })
    .max(300, { message: 'ঠিকানা সর্বোচ্চ ৩০০ অক্ষরের হতে পারবে' })
    .trim(),
  customerDistrict: z
    .string()
    .min(2, { message: 'জেলা বা শহরের নাম নির্বাচন করুন' })
    .max(50)
    .trim(),
  customerEmail: z
    .string()
    .email({ message: 'সঠিক ইমেইল ঠিকানা দিন' })
    .optional()
    .or(z.literal('')),
  productId: z
    .string()
    .min(1, { message: 'পণ্য নির্বাচন করা আবশ্যক' }),
  quantity: z
    .coerce
    .number()
    .int()
    .min(1, { message: 'কমপক্ষে ১টি পণ্য নির্বাচন করুন' })
    .max(50, { message: 'একবারে সর্বোচ্চ ৫০টি পণ্য অর্ডার করতে পারবেন' })
    .default(1),
  variant: z
    .object({
      size: z.string().optional(),
      color: z.string().optional(),
      capacity: z.string().optional(),
      weight: z.string().optional(),
      model: z.string().optional()
    })
    .optional()
    .nullable(),
  deliveryZone: z
    .enum(['inside_dhaka', 'outside_dhaka'], {
      errorMap: () => ({ message: 'ডেলিভারি এরিয়া নির্বাচন করুন (ঢাকার ভেতরে বা বাইরে)' })
    }),
  notes: z
    .string()
    .max(500)
    .optional()
    .or(z.literal(''))
});

// Product Management Schema (Admin)
export const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'পণ্যের নাম কমপক্ষে ২ অক্ষর হতে হবে' })
    .max(200)
    .trim(),
  slug: z
    .string()
    .trim()
    .optional(),
  shortDescription: z
    .string()
    .min(5, { message: 'সংক্ষিপ্ত বিবরণ দিন (কমপক্ষে ৫ অক্ষর)' })
    .max(300)
    .trim(),
  description: z
    .string()
    .min(10, { message: 'বিস্তারিত বিবরণ দিন (কমপক্ষে ১০ অক্ষর)' })
    .trim(),
  category: z
    .string()
    .min(2, { message: 'ক্যাটাগরি নির্বাচন করুন' })
    .trim(),
  price: z
    .coerce
    .number()
    .positive({ message: 'বিক্রয় মূল্য অবশ্যই শূন্যের বেশি হতে হবে' }),
  compareAtPrice: z
    .union([z.coerce.number().positive(), z.literal(''), z.null()])
    .optional()
    .transform((val) => (val === '' || val === null || val === undefined ? null : Number(val))),
  images: z
    .array(z.string().min(1, { message: 'ইমেজ লিংক প্রদান করুন' }))
    .min(1, { message: 'কমপক্ষে ১টি পণ্যের ছবি যুক্ত করুন' }),
  variants: z
    .object({
      sizes: z.array(z.string()).optional(),
      colors: z.array(z.string()).optional(),
      warranty: z.string().optional(),
      capacities: z.array(z.string()).optional(),
      weights: z.array(z.string()).optional(),
      models: z.array(z.string()).optional(),
      specs: z.string().optional()
    })
    .optional()
    .default({}),
  stockQuantity: z
    .coerce
    .number()
    .int()
    .min(0, { message: 'স্টক পরিমাণ ০ বা তার বেশি হতে হবে' })
    .default(50),
  status: z
    .enum(['published', 'draft', 'archived'])
    .default('published'),
  featured: z
    .boolean()
    .default(false),
  seo: z
    .object({
      title: z.string().max(100).optional(),
      description: z.string().max(250).optional(),
      canonicalUrl: z.string().optional()
    })
    .optional()
    .default({})
});

// Admin Login Schema
export const adminLoginSchema = z.object({
  email: z
    .string()
    .email({ message: 'সঠিক ইমেইল এড্রেস লিখুন' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে' })
});

// Admin Order Status Update Schema
export const orderStatusUpdateSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ], {
    errorMap: () => ({ message: 'অবৈধ অর্ডার স্ট্যাটাস' })
  }),
  note: z.string().max(300).optional()
});
