import type { Metadata } from "next";
import Section from "@/components/marketing/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import { PhoneFrame } from "@/components/mockups/Frames";
import { UpcomingPostsScreen, CreatePostScreen, AnalyticsScreen } from "@/components/mockups/MobileScreens";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Harlo Mobile: Coming Soon | Harlo Social",
  description: "Harlo's dedicated mobile app is currently in development. Join the waitlist to be notified at launch.",
  path: "/mobile",
});

export default function MobilePage() {
  return (
    <>
      <Section className="pb-10 pt-12 text-center md:pt-16">
        <div className="flex justify-center">
          <Eyebrow>Coming Soon</Eyebrow>
        </div>
        <h1 className="balance mx-auto mt-6 max-w-2xl text-h1-page font-semibold text-foreground">
          Harlo is coming to mobile.
        </h1>
        <p className="balance mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-muted md:text-[18px]">
          Plan, schedule and manage your social content wherever you are. Harlo&apos;s dedicated mobile experience is
          currently in development.
        </p>
        <p className="balance mx-auto mt-3 max-w-md text-[14.5px] text-muted">
          Designed for mobile from the beginning, not just a desktop dashboard squeezed onto a smaller screen.
        </p>

        <form className="mx-auto mt-8 flex max-w-sm flex-col gap-2.5 sm:flex-row">
          <input
            type="email"
            placeholder="Email address"
            className="h-12 w-full flex-1 rounded-[9px] border border-border bg-white px-4 text-[14.5px] outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="h-12 rounded-[9px] bg-primary px-6 text-[14.5px] font-medium text-white transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Join the Waitlist
          </button>
        </form>
        <p className="mt-3 text-[12.5px] text-muted">
          The Harlo web app works today in any modern browser, on desktop or mobile.
        </p>
      </Section>

      <Section className="pt-0">
        <div className="flex flex-wrap items-end justify-center gap-8">
          <PhoneFrame className="w-[210px] translate-y-4 opacity-90">
            <CreatePostScreen />
          </PhoneFrame>
          <PhoneFrame className="w-[230px]">
            <UpcomingPostsScreen />
          </PhoneFrame>
          <PhoneFrame className="w-[210px] translate-y-4 opacity-90">
            <AnalyticsScreen />
          </PhoneFrame>
        </div>
        <p className="mt-6 text-center text-[12px] text-muted">Product preview: mobile app screens shown are in-progress designs.</p>
      </Section>
    </>
  );
}
