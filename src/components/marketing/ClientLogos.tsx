import Image from "next/image";

export type ClientLogo = {
  name: string;
  /** Path under /public, e.g. "/brand/clients/hgw-consult.svg" */
  logoSrc: string;
  href?: string;
  /** Intrinsic asset dimensions, used to keep aspect ratio without distorting the mark. */
  width: number;
  height: number;
};

/**
 * Reusable client/trust-logo strip. NOT wired into any page yet — only
 * render this once real logo assets exist under public/brand/clients/ and
 * each company has confirmed permission to display their mark publicly.
 * Do not populate `logos` with placeholder or fabricated entries.
 */
export default function ClientLogos({ logos, label = "Trusted by" }: { logos: ClientLogo[]; label?: string }) {
  if (logos.length === 0) return null;

  return (
    <div className="py-10">
      <p className="text-center text-[12px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {logos.map((logo) => {
          const img = (
            <Image
              src={logo.logoSrc}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              className="h-7 w-auto grayscale opacity-70 transition-all duration-200 hover:grayscale-0 hover:opacity-100"
            />
          );
          return logo.href ? (
            <a key={logo.name} href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={logo.name}>
              {img}
            </a>
          ) : (
            <span key={logo.name} aria-label={logo.name}>
              {img}
            </span>
          );
        })}
      </div>
    </div>
  );
}
