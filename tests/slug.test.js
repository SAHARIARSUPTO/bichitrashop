// tests/slug.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { slugify, generateUniqueSlug } from '../lib/slug.js';

describe('SEO Slug Generator and Collision Resolution', () => {
  it('should generate clean URL-safe kebab-case slugs from English titles', () => {
    assert.strictEqual(
      slugify('Exclusive Embroidered Premium Koti Set'),
      'exclusive-embroidered-premium-koti-set'
    );
  });

  it('should clean up special characters and whitespace', () => {
    assert.strictEqual(
      slugify('  Jamdani Panjabi @ 2026 !! (Sale)  '),
      'jamdani-panjabi-2026-sale'
    );
  });

  it('should resolve slug collisions by appending incremental counters (-2, -3)', async () => {
    const mockStore = [
      { slug: 'embroidered-koti-set', _id: '1' },
      { slug: 'embroidered-koti-set-2', _id: '2' }
    ];

    const mockCollection = {
      findOne: async (query) => {
        return mockStore.find(doc => doc.slug === query.slug) || null;
      }
    };

    const newSlug = await generateUniqueSlug('Embroidered Koti Set', mockCollection);
    assert.strictEqual(newSlug, 'embroidered-koti-set-3');
  });

  it('should preserve existing slug when updating the same product', async () => {
    const mockStore = [
      { slug: 'embroidered-koti-set', _id: '100' }
    ];

    const mockCollection = {
      findOne: async (query) => {
        return mockStore.find(doc => doc.slug === query.slug) || null;
      }
    };

    const slug = await generateUniqueSlug('Embroidered Koti Set', mockCollection, '100');
    assert.strictEqual(slug, 'embroidered-koti-set');
  });
});
