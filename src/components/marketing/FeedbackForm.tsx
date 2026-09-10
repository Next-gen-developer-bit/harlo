"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const feedbackTypes = [
  "Feature suggestion",
  "Improvement idea",
  "Something is confusing",
  "Something isn't working",
  "Other",
];

function normaliseType(value: string | null): string {
  if (!value) return feedbackTypes[0];
  const match = feedbackTypes.find((t) => t.toLowerCase() === value.toLowerCase());
  return match ?? feedbackTypes[0];
}

export default function FeedbackForm() {
  const searchParams = useSearchParams();
  const [feedbackType, setFeedbackType] = useState(() => normaliseType(searchParams.get("type")));
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mx-auto max-w-md rounded-[12px] border border-border bg-white p-8 text-center">
        <div className="text-[18px] font-semibold text-foreground">Thanks for helping shape Harlo.</div>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          We read every submission and use it to help decide what we build next.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="mx-auto max-w-md space-y-4"
    >
      <div>
        <label htmlFor="feedback-type" className="mb-1.5 block text-[13px] font-medium text-foreground">
          Feedback Type
        </label>
        <select
          id="feedback-type"
          value={feedbackType}
          onChange={(e) => setFeedbackType(e.target.value)}
          className="w-full rounded-[10px] border border-border bg-white px-4 py-3 text-[14.5px] outline-none focus:border-primary"
        >
          {feedbackTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="feedback-main" className="mb-1.5 block text-[13px] font-medium text-foreground">
          What would you like us to improve?
        </label>
        <textarea
          id="feedback-main"
          required
          rows={4}
          className="w-full resize-none rounded-[10px] border border-border bg-white px-4 py-3 text-[14.5px] outline-none focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="feedback-problem" className="mb-1.5 block text-[13px] font-medium text-foreground">
          What problem would this solve for you? <span className="text-muted">(optional)</span>
        </label>
        <textarea
          id="feedback-problem"
          rows={3}
          className="w-full resize-none rounded-[10px] border border-border bg-white px-4 py-3 text-[14.5px] outline-none focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="feedback-email" className="mb-1.5 block text-[13px] font-medium text-foreground">
          Email <span className="text-muted">(optional)</span>
        </label>
        <input
          id="feedback-email"
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-[10px] border border-border bg-white px-4 py-3 text-[14.5px] outline-none focus:border-primary"
        />
      </div>

      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-[9px] bg-primary text-[14.5px] font-medium text-white transition-all hover:brightness-110 active:scale-[0.98]"
      >
        Submit Feedback
      </button>
    </form>
  );
}
