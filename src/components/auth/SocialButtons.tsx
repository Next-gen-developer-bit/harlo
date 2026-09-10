export default function SocialButtons() {
  return (
    <div className="space-y-2.5">
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center gap-2.5 rounded-[13px] border border-border bg-white text-[14.5px] font-medium text-foreground shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_22px_-10px_rgba(16,24,40,0.3)]"
      >
        <GoogleGlyph />
        Continue with Google
      </button>
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center gap-2.5 rounded-[13px] border border-border bg-white text-[14.5px] font-medium text-foreground shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_22px_-10px_rgba(16,24,40,0.3)]"
      >
        <AppleGlyph />
        Continue with Apple
      </button>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.5 12.23c0-.78-.07-1.53-.2-2.25H12v4.26h5.87a5.02 5.02 0 0 1-2.18 3.3v2.74h3.52c2.06-1.9 3.24-4.7 3.24-8.05Z" />
      <path fill="#34A853" d="M12 23c2.94 0 5.4-.97 7.2-2.63l-3.52-2.74c-.98.66-2.23 1.04-3.68 1.04-2.83 0-5.23-1.91-6.09-4.48H2.27v2.82A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.91 14.19a6.6 6.6 0 0 1 0-4.38V6.99H2.27a11 11 0 0 0 0 10.02l3.64-2.82Z" />
      <path fill="#EA4335" d="M12 5.34c1.6 0 3.03.55 4.16 1.63l3.12-3.12A10.98 10.98 0 0 0 12 1a11 11 0 0 0-9.73 5.99l3.64 2.82C6.77 7.25 9.17 5.34 12 5.34Z" />
    </svg>
  );
}

function AppleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.36 1c.13 1.05-.3 2.09-.94 2.86-.66.79-1.75 1.4-2.8 1.32-.16-1.02.34-2.08.96-2.79.7-.8 1.87-1.4 2.78-1.39ZM19.9 17.32c-.35.8-.77 1.55-1.27 2.24-.68.94-1.24 1.6-1.67 1.96-.66.6-1.37.91-2.13.93-.55.01-1.21-.15-1.98-.48-.77-.33-1.48-.48-2.13-.48-.68 0-1.4.15-2.16.48-.77.33-1.39.5-1.87.51-.73.03-1.46-.29-2.19-.96-.46-.4-1.05-1.09-1.75-2.08-.75-1.05-1.37-2.28-1.85-3.68-.52-1.52-.78-3-.78-4.42 0-1.63.35-3.04 1.06-4.22a6.2 6.2 0 0 1 2.22-2.25 5.98 5.98 0 0 1 3-.85c.6 0 1.4.18 2.4.55.99.37 1.63.55 1.9.55.2 0 .9-.21 2.1-.63 1.13-.39 2.08-.55 2.87-.49 2.12.17 3.71 1 4.77 2.51-1.9 1.15-2.84 2.76-2.83 4.83.01 1.62.6 2.96 1.75 4.03.52.5 1.1.88 1.75 1.15-.14.41-.29.8-.46 1.19Z" />
    </svg>
  );
}
