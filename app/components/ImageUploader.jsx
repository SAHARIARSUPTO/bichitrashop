// app/components/ImageUploader.jsx
'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Link as LinkIcon,
  Image as ImageIcon,
  Star
} from 'lucide-react';

export default function ImageUploader({
  value = [],
  onChange,
  multiple = false,
  folder = 'bichitra_shop/products',
  label = 'পণ্যের ছবি (Cloudinary আপলোড)',
  maxFiles = 6
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const fileInputRef = useRef(null);

  // Normalize value to array
  const imageList = Array.isArray(value)
    ? value.filter(Boolean)
    : (typeof value === 'string' && value.trim() ? [value.trim()] : []);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadError('');
    setUploading(true);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          throw new Error(`"${file.name}" কোনো ইমেজ ফাইল নয়।`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'ইমেজ আপলোড ব্যর্থ হয়েছে।');
        }

        uploadedUrls.push(data.url);
      }

      if (multiple) {
        const nextList = [...imageList, ...uploadedUrls].slice(0, maxFiles);
        onChange(nextList);
      } else {
        onChange(uploadedUrls[0]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'আপলোড ব্যর্থ হয়েছে।');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlDraft.trim()) return;

    if (multiple) {
      const nextList = [...imageList, urlDraft.trim()].slice(0, maxFiles);
      onChange(nextList);
    } else {
      onChange(urlDraft.trim());
    }

    setUrlDraft('');
    setShowUrlInput(false);
  };

  const handleRemove = (index) => {
    if (multiple) {
      const nextList = imageList.filter((_, i) => i !== index);
      onChange(nextList);
    } else {
      onChange('');
    }
  };

  const handleSetPrimary = (index) => {
    if (!multiple || index === 0) return;
    const target = imageList[index];
    const rest = imageList.filter((_, i) => i !== index);
    onChange([target, ...rest]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-zinc-900">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-semibold text-zinc-600 hover:text-black flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3 text-black stroke-[2]" />
          <span>{showUrlInput ? 'ফাইল আপলোডে ফিরুন' : 'সরাসরি লিংক যুক্ত করুন'}</span>
        </button>
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Direct URL Input Toggle */}
      {showUrlInput && (
        <div className="flex gap-2 p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl">
          <input
            type="url"
            placeholder="https://... বা /products/image.jpg"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs bg-white outline-none focus:border-zinc-900"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            যোগ করুন
          </button>
        </div>
      )}

      {/* Cloudinary Drag & Drop / Click to Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
          uploading
            ? 'border-zinc-400 bg-zinc-50 pointer-events-none'
            : 'border-zinc-300 hover:border-zinc-900 bg-[#F6FAF7] hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-2xs flex items-center justify-center">
            {uploading ? (
              <Loader2 className="w-5 h-5 text-black animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5 text-black stroke-[2]" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-zinc-900">
              {uploading
                ? 'Cloudinary-তে আপলোড হচ্ছে, অপেক্ষা করুন...'
                : 'কম্পিউটার বা মোবাইল থেকে ছবি আপলোড করুন'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              PNG, JPG, WEBP (সর্বোচ্চ ১০MB) • সরাসরি Cloudinary-তে সেভ হবে
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Thumbnails Preview Grid */}
      {imageList.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
          {imageList.map((imgUrl, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-200 bg-white shadow-2xs"
            >
              <Image
                src={imgUrl}
                alt={`Image ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />

              {/* Badges and Actions overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                {multiple && idx > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetPrimary(idx);
                    }}
                    title="মূল ছবি বানান"
                    className="p-1 rounded-md bg-white text-zinc-900 hover:bg-zinc-100 shadow-xs cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  title="মুছে ফেলুন"
                  className="p-1 rounded-md bg-red-600 text-white hover:bg-red-700 shadow-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Primary Image Label */}
              {multiple && idx === 0 && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider">
                  প্রধান ছবি
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
