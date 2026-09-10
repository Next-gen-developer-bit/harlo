'use client';

import React, { useState } from 'react';

const DOC_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    desc: 'Learn the basics of setting up your Harlo Social workspace, creating posts, and inviting team members.',
    icon: '🚀',
  },
  {
    id: 'social-connections',
    title: 'Social Connections',
    desc: 'Connecting Instagram, Facebook, LinkedIn, TikTok, YouTube, Threads, and Pinterest accounts.',
    icon: '🔗',
  },
  {
    id: 'scheduling',
    title: 'Scheduling',
    desc: 'Best practices for automated social scheduling, calendar views, queue times, and post drafts.',
    icon: '📅',
  },
  {
    id: 'media-limits',
    title: 'Media Limits',
    desc: 'Supported image formats, video aspect ratios, file size limits, and bulk upload specifications.',
    icon: '🎥',
  },
  {
    id: 'account-billing',
    title: 'Account & Billing',
    desc: 'Managing plans, payment methods, invoices, upgrades, downgrades, and billing portal access.',
    icon: '💳',
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    desc: 'Fixing failed posts, re-authenticating disconnected accounts, and rate limit guidelines.',
    icon: '🛠️',
  },
  {
    id: 'api-integrations',
    title: 'API & Integrations',
    desc: 'Developer API keys, webhook event payloads, and custom OAuth client configurations.',
    icon: '⚡',
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    desc: 'Quick answers to common questions about Harlo Social features, security, and policies.',
    icon: '❓',
  },
];

export const DocsComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = DOC_CATEGORIES.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-8 font-sans min-h-screen">
      
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 text-white mb-10 shadow-md">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          Harlo Social Help Center & Documentation
        </h1>
        <p className="text-emerald-100 text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
          Everything you need to master social scheduling, account connections, and workspace management.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search documentation (e.g. Instagram limits, scheduling, API keys)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-slate-800 text-sm pl-12 pr-4 py-3.5 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium placeholder-slate-400"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Browse by Category</h2>
        <p className="text-xs text-slate-500 mb-6">Select a category to explore detailed guides and articles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="text-3xl mb-4">{category.icon}</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{category.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {category.desc}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline">
              Read Guides →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
