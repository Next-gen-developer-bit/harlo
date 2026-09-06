import Link from "next/link";
import Container from "@/components/ui/Container";
import { MentionCircleIcon } from "@/components/icons/NavIcons";

// The supplied icon artwork is a fixed dark navy stroke (not recolourable),
// so the badge behind it needs a light background for contrast rather than
// the previous dark gradient.
const iconStyle = {
  background: "var(--pastel-blue)",
};

function Eyebrow() {
  return (
    <span className="inline-flex items-center rounded-full border border-[rgba(61,90,254,0.35)] bg-[rgba(61,90,254,0.14)] px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wide text-[#A9B8FF]">
      Product Feedback
    </span>
  );
}

export default function FeedbackBanner() {
  return (
    <section className="bg-background py-14 md:py-16">
      <Container>
        <div className="feedback-panel flex flex-col gap-7 rounded-[22px] px-6 py-8 md:flex-row md:items-center md:justify-between md:gap-10 md:rounded-[10px] md:px-11 md:py-11">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
            <div className="md:hidden">
              <Eyebrow />
            </div>

            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] md:hidden"
              style={iconStyle}
            >
              <MentionCircleIcon className="h-5 w-5" />
            </div>
            <div
              className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-[10px] md:flex"
              style={iconStyle}
            >
              <MentionCircleIcon className="h-[22px] w-[22px]" />
            </div>

            <div className="min-w-0">
              <div className="hidden md:block">
                <Eyebrow />
              </div>
              <h2 className="mt-3 text-[21px] font-semibold text-white md:text-[26px]">Help shape Harlo.</h2>
              <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-[#A7ADBD]">
                Tell us what you&apos;d like to see in the next update.
              </p>
              <p className="mt-1 text-[12.5px] text-[#666C80]">We read every suggestion.</p>
            </div>
          </div>

          <Link
            href="/feedback"
            className="group inline-flex h-[50px] w-full shrink-0 items-center justify-center gap-2 rounded-[9px] bg-primary px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(61,90,254,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_30px_-6px_rgba(61,90,254,0.7)] active:translate-y-0 active:brightness-95 sm:w-auto"
          >
            Share Feedback
            <span aria-hidden="true" className="inline-block transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
