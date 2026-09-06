import Link from "next/link";
import { platformItems } from "@/lib/nav-data";
import PlatformBadge from "@/components/icons/PlatformBadge";

export default function PlatformStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
      {platformItems.map((p) => {
        const content = (
          <>
            <PlatformBadge slug={p.slug} size={30} className={p.status === "Supported" ? "icon-pop" : "grayscale"} />
            <span className="text-[14px] font-medium text-foreground">{p.name}</span>
            {p.status === "Coming Soon" && (
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">Soon</span>
            )}
          </>
        );
        return p.status === "Supported" ? (
          <Link key={p.slug} href={p.href} className="flex items-center gap-2.5">
            {content}
          </Link>
        ) : (
          <div key={p.slug} className="flex items-center gap-2.5 opacity-50">
            {content}
          </div>
        );
      })}
    </div>
  );
}
