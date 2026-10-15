// app/components/TrustBadges.jsx

import React from 'react';
import { Truck, ShieldCheck, CheckCircle2, PhoneCall } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: 'সারা দেশে ক্যাশ অন ডেলিভারি',
      desc: 'অগ্রিম পেমেন্ট ছাড়াই অর্ডার করুন',
    },
    {
      icon: ShieldCheck,
      title: 'চেক করে নেওয়ার সুবিধা',
      desc: 'পার্সেল দেখে ডেলিভারি গ্রহণের নিশ্চয়তা',
    },
    {
      icon: CheckCircle2,
      title: '১০০% অরিজিনাল পণ্য',
      desc: 'মানসম্মত ফিনিশিং ও প্রিমিয়াম মান',
    },
    {
      icon: PhoneCall,
      title: 'সার্বক্ষণিক সহায়তা',
      desc: 'সরাসরি হেল্পলাইন ও কাস্টমার সাপোর্ট',
    },
  ];

  return (
    <section className="py-6 bg-white border-y border-zinc-200">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-black stroke-[2]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-zinc-900 leading-tight">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-zinc-600 mt-0.5 leading-tight">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
