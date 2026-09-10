import type { Metadata } from "next";
import Link from "next/link";
import SocialButtons from "@/components/auth/SocialButtons";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sign Up | Harlo Social",
  description: "Create your Harlo account.",
  path: "/signup",
  noIndex: true,
});

export default function SignupPage() {
  return (
    <div className="w-full max-w-[380px] rounded-[28px] border border-border bg-white p-8 shadow-[0_30px_80px_-30px_rgba(20,20,40,0.18)]">
      <h1 className="text-center text-[22px] font-semibold tracking-tight text-foreground">
        Get started with Harlo.
      </h1>

      <div className="mt-7">
        <SocialButtons />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[12px] text-muted">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form className="space-y-3">
        <input
          type="email"
          placeholder="Email address"
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-[14.5px] outline-none focus:border-primary"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-[14.5px] outline-none focus:border-primary"
        />
        <button
          type="submit"
          data-track="signup_completed"
          className="flex h-12 w-full items-center justify-center rounded-[13px] bg-primary text-[14.5px] font-medium text-white transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary">
          Log in
        </Link>
      </p>

      <p className="mt-4 text-center text-[11.5px] leading-relaxed text-muted">
        By creating an account you agree to Harlo&apos;s{" "}
        <Link href="/legal/terms" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
