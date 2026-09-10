import Link from "next/link";
import Image from "next/image";

export type ResourceCategory =
  | "Social Media Strategy"
  | "Scheduling"
  | "Analytics"
  | "Agency Growth"
  | "Marketing Workflows"
  | "Harlo Guides"
  | "Product Updates";

export type ResourceItem = {
  title: string;
  description: string;
  href: string;
  category: ResourceCategory;
  kind: "article" | "guide" | "update" | "help";
  date?: string;
  imageSrc?: string;
  featured?: boolean;
};

const kindLabel: Record<ResourceItem["kind"], string> = {
  article: "Article",
  guide: "Guide",
  update: "Product update",
  help: "Help",
};

/**
 * Reusable resource card — used for articles, guides, product updates and
 * help content alike (the `kind` label is the only visual difference).
 * Ready to receive real content; not populated with placeholder entries.
 */
export function ResourceCard({ item }: { item: ResourceItem }) {
  return (
    <Link
      href={item.href}
      className="group flex flex-col overflow-hidden rounded-[10px] border border-border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-border-dark-hover"
    >
      {item.imageSrc && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
          <Image src={item.imageSrc} alt="" fill className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-wide text-muted">
          <span>{kindLabel[item.kind]}</span>
          <span aria-hidden="true">·</span>
          <span>{item.category}</span>
        </div>
        <div className="mt-2.5 text-[16px] font-semibold text-foreground">{item.title}</div>
        <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted">{item.description}</p>
        {item.date && <div className="mt-3 text-[12px] text-muted">{item.date}</div>}
      </div>
    </Link>
  );
}

/** Large featured variant for the single lead resource at the top of the hub. */
export function FeaturedResourceCard({ item }: { item: ResourceItem }) {
  return (
    <Link
      href={item.href}
      className="group grid gap-6 overflow-hidden rounded-[12px] border border-border bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-dark-hover md:grid-cols-2 md:items-center md:p-8"
    >
      {item.imageSrc && (
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-surface">
          <Image src={item.imageSrc} alt="" fill className="object-cover" />
        </div>
      )}
      <div>
        <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-wide text-muted">
          <span>Featured</span>
          <span aria-hidden="true">·</span>
          <span>{item.category}</span>
        </div>
        <div className="mt-3 text-[22px] font-semibold text-foreground">{item.title}</div>
        <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{item.description}</p>
      </div>
    </Link>
  );
}

/** One category section — hidden entirely when it has no items yet (see brief: hide empty categories rather than showing placeholder content). */
export function ResourceCategorySection({ category, items }: { category: ResourceCategory; items: ResourceItem[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="text-h4 font-semibold text-foreground">{category}</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ResourceCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}
