// app/components/ProductGallery.jsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images = [], name = 'Product Image' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-4">
      {/* Primary Hero Image */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#E2ECE3] shadow-xs">
        <Image
          src={activeImage}
          alt={`${name} - ছবি ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
          priority
        />
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
          {activeIndex + 1} / {images.length || 1}
        </div>
      </div>

      {/* Thumbnails Carousel / Row */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0 border-2 transition-all ${
                activeIndex === idx
                  ? 'border-[#08542C] ring-2 ring-[#08542C]/20 scale-95'
                  : 'border-[#E2ECE3] hover:border-gray-400 opacity-80 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
