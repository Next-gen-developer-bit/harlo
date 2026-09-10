'use client';

import React, { useState, useCallback } from 'react';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';

export const FeedbackModal = () => {
  const modals = useModals();
  const toaster = useToaster();
  const fetch = useFetch();
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('feature');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!feedback.trim()) return;
      setLoading(true);
      try {
        const res = await fetch('/user/feedback', {
          method: 'POST',
          body: JSON.stringify({
            message: feedback.trim(),
            category,
          }),
        });
        if (!res.ok) {
          throw new Error('Failed to submit feedback');
        }
        modals.closeAll();
        toaster.show('Thank you! Your feedback has been submitted.', 'success');
      } catch {
        toaster.show('Could not submit feedback. Please try again.', 'warning');
      } finally {
        setLoading(false);
      }
    },
    [feedback, category, fetch, modals, toaster]
  );

  return (
    <div className="bg-white rounded-2xl p-6 text-left shadow-xl max-w-md w-full font-sans">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Share Feedback</h2>
        <button
          onClick={() => modals.closeAll()}
          className="text-slate-400 hover:text-slate-600 text-sm font-bold"
        >
          ✕
        </button>
      </div>

      <p className="text-xs text-slate-500 mb-6">
        Help us improve Harlo Social. Tell us what failed, what you need, or what to
        build next.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Feedback Type</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-700 p-2.5 rounded-xl font-medium focus:outline-none focus:border-blue-600"
          >
            <option value="feature">Feature Request</option>
            <option value="bug">Report a Bug</option>
            <option value="general">General Feedback</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message</label>
          <textarea
            rows={4}
            required
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what's on your mind..."
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-700 p-3 rounded-xl focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => modals.closeAll()}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !feedback.trim()}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};
