import Image from "next/image";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Path under /public, optional. */
  avatarSrc?: string;
};

/**
 * Reusable homepage testimonials component. NOT wired into any page yet —
 * every quote, name, role and company here is real, attributable customer
 * feedback that must be supplied and approved before this renders anywhere.
 * Do not populate `testimonials` with invented quotes, people, titles or
 * companies — leave it empty (the component returns null) until real
 * testimonials are provided.
 */
export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
      {testimonials.map((t) => (
        <figure key={`${t.name}-${t.company}`} className="rounded-[10px] border border-border bg-white p-6">
          <blockquote className="text-[14.5px] leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            {t.avatarSrc && (
              <Image src={t.avatarSrc} alt={t.name} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
            )}
            <div>
              <div className="text-[13.5px] font-semibold text-foreground">{t.name}</div>
              <div className="text-[12.5px] text-muted">{t.role} · {t.company}</div>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
