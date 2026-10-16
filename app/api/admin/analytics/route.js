// app/api/admin/analytics/route.js
// Admin API: Aggregates visitor analytics, traffic sources (Facebook, Google, etc.),
// device statistics, and actionable SEO recommendations.

import { getAdminFromRequest } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';
import { initDatabase } from '@/lib/db-init';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত অ্যাক্সেস।' }, { status: 401 });
    }

    await initDatabase();
    const analytics = await getCollection('analytics_events');

    // Retrieve all analytics events
    const allEvents = await analytics.find({}).sort({ createdAt: -1 }).toArray();

    // If empty, return zero stats
    if (allEvents.length === 0) {
      return Response.json({
        success: true,
        stats: {
          totalViews: 0,
          todayViews: 0,
          uniqueSessions: 0,
          sources: [
            { name: 'Facebook', count: 0, percentage: 0 },
            { name: 'Google Search', count: 0, percentage: 0 },
            { name: 'WhatsApp', count: 0, percentage: 0 },
            { name: 'Direct / Organic', count: 0, percentage: 0 }
          ],
          devices: [
            { name: 'Mobile', count: 0, percentage: 0 },
            { name: 'Desktop', count: 0, percentage: 0 }
          ],
          topPages: [],
          recentActivity: [],
          seoInsights: [
            {
              type: 'info',
              title: 'রিয়েল-টাইম কাস্টমার ট্র্যাকিং সক্রিয়',
              desc: 'গ্রাহকরা ফেসবুক পোস্টের লিংক বা গুগল সার্চের মাধ্যমে আপনার ওয়েবসাইটে ঢুকলে স্বয়ংক্রিয়ভাবে তাদের সঠিক সোর্স ও পেজ ভিউ এখানে রেকর্ড হবে।'
            },
            {
              type: 'tip',
              title: 'লোকাল এসইও (রহনপুর ও চাঁপাইনবাবগঞ্জ)',
              desc: 'গুগল বিজনেস প্রোফাইলে (Google My Business) "বিচিত্র শপ - রহনপুর, চাঁপাইনবাবগঞ্জ" দিয়ে স্টোরের লোকেশন ভেরিফাই করলে স্থানীয় গ্রাহকরা গুগলে সার্চ করলেই আপনাকে সবার আগে খুঁজে পাবে।'
            }
          ]
        }
      });
    }

    const totalViews = allEvents.length;

    // Filter today's views
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();
    const todayViews = allEvents.filter(ev => ev.createdAt >= todayIso).length;

    // Unique visitors (sessions)
    const uniqueSessions = new Set(allEvents.map(ev => ev.sessionId || ev._id)).size;

    // Breakdown by Source
    const sourceMap = {
      Facebook: 0,
      'Google Search': 0,
      WhatsApp: 0,
      Instagram: 0,
      TikTok: 0,
      YouTube: 0,
      'Direct / Organic': 0,
      Other: 0
    };

    allEvents.forEach(ev => {
      const src = ev.source || 'Direct / Organic';
      if (sourceMap[src] !== undefined) {
        sourceMap[src] += 1;
      } else {
        sourceMap.Other += 1;
      }
    });

    const sources = Object.entries(sourceMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Breakdown by Device
    const deviceMap = { Mobile: 0, Desktop: 0, Tablet: 0 };
    allEvents.forEach(ev => {
      const dev = ev.device || 'Mobile';
      if (deviceMap[dev] !== undefined) {
        deviceMap[dev] += 1;
      } else {
        deviceMap.Mobile += 1;
      }
    });

    const devices = Object.entries(deviceMap).map(([name, count]) => ({
      name,
      count,
      percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0
    }));

    // Top Pages / Products
    const pageMap = {};
    allEvents.forEach(ev => {
      const p = ev.path || '/';
      if (!pageMap[p]) {
        pageMap[p] = {
          path: p,
          title: ev.title || p,
          views: 0,
          sources: {}
        };
      }
      pageMap[p].views += 1;
      const s = ev.source || 'Direct / Organic';
      pageMap[p].sources[s] = (pageMap[p].sources[s] || 0) + 1;
    });

    const topPages = Object.values(pageMap)
      .map(item => {
        let topSrc = 'Direct';
        let topSrcCount = 0;
        for (const [src, count] of Object.entries(item.sources)) {
          if (count > topSrcCount) {
            topSrcCount = count;
            topSrc = src;
          }
        }
        return {
          path: item.path,
          title: item.title,
          views: item.views,
          topSource: topSrc,
          percentage: totalViews > 0 ? Math.round((item.views / totalViews) * 100) : 0
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Recent 50 visitor activity logs
    const recentActivity = allEvents.slice(0, 50).map(ev => ({
      id: ev._id,
      path: ev.path,
      fullPath: ev.fullPath || ev.path,
      title: ev.title || 'পৃষ্ঠা',
      source: ev.source || 'Direct / Organic',
      device: ev.device || 'Mobile',
      referrer: ev.referrer || '',
      utm: ev.utm || {},
      createdAt: ev.createdAt
    }));

    // Actionable SEO & Traffic Recommendations
    const fbCount = sourceMap['Facebook'] || 0;
    const googleCount = sourceMap['Google Search'] || 0;

    const seoInsights = [];

    if (googleCount > 0) {
      seoInsights.push({
        type: 'success',
        title: 'গুগল অর্গানিক ট্রাফিক সক্রিয়!',
        desc: `আপনার স্টোরে ${googleCount}টি ভিজিট সরাসরি গুগল সার্চ থেকে এসেছে। জনপ্রিয় পণ্যগুলোর মেটা টাইটেল ও বিস্তারিত বাংলায় ডেসক্রিপশন সমৃদ্ধ রাখলে গুগল র‍্যাঙ্কিং আরও বাড়বে।`
      });
    } else {
      seoInsights.push({
        type: 'warning',
        title: 'গুগল সার্চ ট্রাফিক বৃদ্ধির সুযোগ',
        desc: 'গুগল সার্চ কনসোলে আপনার সাইটম্যাপ (bichitrashop.com/sitemap.xml) ইনডেক্সিংয়ের জন্য জমা দিন এবং প্রতিটি পণ্যের বর্ণনায় গ্রাহকরা গুগলে যা লিখে খোঁজে সেই কিওয়ার্ডগুলো যুক্ত করুন।'
      });
    }

    if (fbCount > 0) {
      seoInsights.push({
        type: 'info',
        title: 'ফেসবুক ট্রাফিক শীর্ষ তালিকায়',
        desc: `ফেসবুক থেকে ${fbCount}টি ভিজিট এসেছে। ফেসবুক পোস্টে পণ্যের সরাসরি লিঙ্ক ও আকর্ষণীয় ছবি শেয়ার চালিয়ে যান। আমাদের তৈরি ওপেনগ্রাফ শেয়ারিং পোস্টার স্বয়ংক্রিয়ভাবে প্রদর্শিত হচ্ছে।`
      });
    }

    seoInsights.push({
      type: 'tip',
      title: 'লোকাল এসইও (রহনপুর ও চাঁপাইনবাবগঞ্জ)',
      desc: 'গুগল বিজনেস প্রোফাইলে (Google My Business) "বিচিত্র শপ - রহনপুর, চাঁপাইনবাবগঞ্জ" নাম দিয়ে স্টোরের লোকেশন ভেরিফাই করলে স্থানীয় গ্রাহকরা গুগলে সার্চ করলেই আপনাকে সবার আগে খুঁজে পাবে।'
    });

    return Response.json({
      success: true,
      stats: {
        totalViews,
        todayViews,
        uniqueSessions,
        sources,
        devices,
        topPages,
        recentActivity,
        seoInsights
      }
    });
  } catch (error) {
    console.error('Analytics aggregation error:', error);
    return Response.json({ success: false, error: 'অ্যানালিটিক্স লোড করা সম্ভব হয়নি।' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'অননুমোদিত।' }, { status: 401 });
    }

    await initDatabase();
    const analytics = await getCollection('analytics_events');
    await analytics.deleteMany({});

    return Response.json({ success: true, message: 'সকল ট্রাফিক লগ সফলভাবে ক্লিয়ার করা হয়েছে।' });
  } catch (error) {
    return Response.json({ success: false, error: 'ক্লিয়ার করতে সমস্যা হয়েছে।' }, { status: 500 });
  }
}

