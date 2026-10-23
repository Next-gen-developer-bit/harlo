'use client';

import React, { FC, useCallback, useMemo, useState } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useToaster } from '@gitroom/react/toaster/toaster';
import clsx from 'clsx';
import {
  formatAnalyticsHistory,
  formatStorage,
  pricing,
} from '@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useVariables } from '@gitroom/react/helpers/variable.context';

export const MainBillingComponent: FC = () => {
  const t = useT();
  const fetch = useFetch();
  const user = useUser();
  const toast = useToaster();
  const { billingEnabled } = useVariables();
  const currentPackage = useMemo(() => {
    if (user?.tier?.current) {
      return user?.tier?.current.toUpperCase();
    }
    return 'FREE';
  }, [user]);

  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePortal = useCallback(async () => {
    try {
      const response = await fetch('/billing/portal');
      const payload = await response.json().catch(() => ({}));
      const url = payload.portal || payload.url;
      if (url && String(url).startsWith('http')) {
        window.location.href = url;
        return;
      }
      toast.show(
        payload.message || 'Unable to open billing portal',
        'warning'
      );
    } catch {
      toast.show('Unable to open billing portal', 'warning');
    }
  }, [fetch, toast]);

  const moveToCheckout = useCallback(
    (billing: 'FREE' | 'CREATOR' | 'PRO' | 'AGENCY') => async () => {
      if (!billingEnabled) {
        toast.show(
          'Stripe is not connected yet. Add the Stripe keys and restart the servers to checkout.',
          'warning'
        );
        return;
      }
      setLoading(true);
      try {
        if (billing === 'FREE') {
          if (!(await deleteDialog('Are you sure you want to cancel your subscription?'))) {
            setLoading(false);
            return;
          }
          const response = await fetch('/billing/cancel', {
            method: 'POST',
            body: JSON.stringify({
              feedback: 'Moving to the Free plan',
            }),
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) {
            toast.show(payload.message || 'Could not cancel the subscription', 'warning');
            return;
          }
          toast.show('Subscription set to cancel at the end of the period', 'success');
          return;
        }
        const response = await fetch('/billing/subscribe', {
          method: 'POST',
          body: JSON.stringify({
            period: isYearly ? 'YEARLY' : 'MONTHLY',
            billing,
          }),
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          toast.show(
            payload.message ||
              'Checkout is not available until Stripe is configured.',
            'warning'
          );
          return;
        }

        if (payload.blocked) {
          toast.show(
            'Another account with this email already has an active subscription.',
            'warning'
          );
          return;
        }

        if (payload.url === 'Already subscribed') {
          toast.show('You are already subscribed to this plan', 'warning');
          return;
        }

        const checkoutUrl = payload.url || payload.portal;
        if (checkoutUrl && String(checkoutUrl).startsWith('http')) {
          window.location.href = checkoutUrl;
          return;
        }

        if (payload.id) {
          toast.show('Plan updated', 'success');
          return;
        }

        toast.show('Could not start checkout. Please try again.', 'warning');
      } catch {
        toast.show('Error initiating checkout', 'warning');
      } finally {
        setLoading(false);
      }
    },
    [billingEnabled, fetch, isYearly, toast]
  );

  const plans = (['FREE', 'CREATOR', 'PRO', 'AGENCY'] as const).map((key) => {
    const item = pricing[key];
    return {
      key,
      name: item.label,
      audience:
        key === 'FREE'
          ? 'Publish and schedule with the essentials'
          : key === 'CREATOR'
          ? 'For individual creators'
          : key === 'PRO'
          ? 'For growing teams'
          : 'For agencies managing client workspaces',
      priceMonthly: item.month_price,
      priceYearly: Math.round(item.month_price * 0.8 * 100) / 100,
      channels: item.channel,
      posts:
        item.posts_per_month > 10000
          ? 'Unlimited scheduled posts'
          : `${item.posts_per_month} scheduled posts / month`,
      users: item.users,
      workspaces: item.workspaces,
      storage: formatStorage(item.storage_mb),
      fileSize: formatStorage(item.max_file_mb),
      analytics: formatAnalyticsHistory(item.analytics_days),
      badge: key === 'PRO' ? 'Most Popular' : null,
      trial: key !== 'FREE',
    };
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-8 pt-10 font-sans min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[32px] font-bold leading-tight tracking-[-0.03em] text-slate-900">
            Billing & Plans
          </h1>
          {!billingEnabled && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3 max-w-xl">
              Stripe is not connected yet. You can review plans here. Checkout
              will start as soon as the Stripe keys are added and the servers
              are restarted.
            </p>
          )}
        </div>

        {currentPackage !== 'FREE' && (
          <button
            onClick={handlePortal}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm self-start md:self-auto"
          >
            Manage Billing Portal →
          </button>
        )}
      </div>

      {/* Monthly / Yearly Toggle Switch */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className={clsx('text-xs font-bold', !isYearly ? 'text-slate-900' : 'text-slate-400')}>
          Monthly Billing
        </span>
        <button
          onClick={() => setIsYearly(!isYearly)}
          className={clsx(
            'w-12 h-6 rounded-full p-1 transition-colors relative focus:outline-none',
            isYearly ? 'bg-blue-600' : 'bg-slate-200'
          )}
        >
          <div
            className={clsx(
              'w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
              isYearly ? 'translate-x-6' : 'translate-x-0'
            )}
          />
        </button>
        <span className={clsx('text-xs font-bold flex items-center gap-1.5', isYearly ? 'text-slate-900' : 'text-slate-400')}>
          Annual Billing
          <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
            Save up to 20%
          </span>
        </span>
      </div>

      {/* 3 Plan Cards Grid */}
      {!['FREE', 'CREATOR', 'PRO', 'AGENCY'].includes(currentPackage) && (
        <p className="mb-6 text-center text-xs text-slate-500">
          You are on a previous {currentPackage.toLowerCase()} plan. Choose a
          current plan when you are ready to switch. Your existing subscription
          stays active until you do.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentPackage === plan.key;
          const price = isYearly ? plan.priceYearly : plan.priceMonthly;

          return (
            <div
              key={plan.key}
              className={clsx(
                'bg-white rounded-2xl border p-8 flex flex-col justify-between relative transition-all shadow-sm',
                plan.badge ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200/80',
                isCurrent && 'bg-slate-50/50'
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </span>
              )}

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{plan.audience}</p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-slate-900">${price}</span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                </div>
                <p className="mb-6 text-[11px] text-slate-400">
                  {plan.trial
                    ? isYearly
                      ? 'Billed annually · 7-day trial'
                      : '7-day free trial'
                    : 'No trial'}
                </p>

                <div className="space-y-3 border-t border-slate-100 pt-6 text-xs text-slate-700">
                  {[
                    `${plan.channels} social accounts`,
                    plan.posts,
                    `${plan.users} user${plan.users === 1 ? '' : 's'}`,
                    `${plan.workspaces} workspace${plan.workspaces === 1 ? '' : 's'}`,
                    `${plan.storage} content library`,
                    `${plan.fileSize} max file size`,
                    `${plan.analytics} analytics history`,
                  ].map((line) => (
                    <div key={line} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full bg-slate-100 text-slate-500 text-xs font-bold py-3 rounded-xl cursor-default"
                  >
                    Current Active Plan
                  </button>
                ) : (
                  <button
                    disabled={loading}
                    onClick={moveToCheckout(plan.key as any)}
                    className={clsx(
                      'w-full text-xs font-bold py-3 rounded-xl transition-colors shadow-sm',
                      plan.badge
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    )}
                  >
                    {plan.key === 'FREE'
                      ? 'Move to Free'
                      : currentPackage === 'FREE'
                      ? 'Start 7-day trial'
                      : 'Switch to ' + plan.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
