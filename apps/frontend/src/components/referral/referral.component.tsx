'use client';

import React, { useState } from 'react';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import copy from 'copy-to-clipboard';
import { useToaster } from '@gitroom/react/toaster/toaster';

export const ReferralComponent = () => {
  const user = useUser();
  const toaster = useToaster();

  const referralCode = user?.id ? `POSCALLY-${user.id.substring(0, 6).toUpperCase()}` : 'POSCALLY-PROMO';
  const referralLink = `https://poscally.co/signup?ref=${referralCode}`;

  const handleCopy = () => {
    copy(referralLink);
    toaster.show('Referral link copied to clipboard!', 'success');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 font-sans min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Harlo Social Referral Program</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Invite friends and creators to Harlo Social and earn rewards according to our commercial partner policy.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-2">Your Unique Referral Link</h2>
        <p className="text-xs text-slate-500 mb-6">
          Share your link with creators, agencies, and friends to invite them to Harlo Social.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full bg-transparent text-xs font-mono text-slate-700 outline-none px-2"
          />
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            Copy Link
          </button>
        </div>
      </div>

      {/* Commercial Policy Note */}
      <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-xl shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-sky-900">Commercial Partner Policy</h3>
            <p className="text-xs text-sky-700 mt-1 leading-relaxed">
              Referral commissions, tier payouts, and referral credits are governed by Harlo Social's official commercial policy. Referrals are tracked automatically upon account registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
