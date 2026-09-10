import Link from "next/link";
import { platformItems } from "@/lib/nav-data";
import PlatformBadge from "@/components/icons/PlatformBadge";

export default function SupportedNetworksGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {platformItems.map((p) => {
        const content = (
          <>
            <PlatformBadge slug={p.slug} size={40} rounded="rounded-[10px]" className={p.status === "Coming Soon" ? "grayscale" : ""} />
            <div className="min-w-0">
              <div className="text-[14px] font-medium text-foreground">{p.name}</div>
              <span
                className={`text-[11px] font-medium ${p.status === "Supported" ? "text-primary" : "text-muted"}`}
              >
                {p.status}
              </span>
            </div>
          </>
        );
        return p.status === "Supported" ? (
          <Link key={p.slug} href={p.href} className="surface-card flex items-center gap-3 rounded-[10px] p-4">
            {content}
          </Link>
        ) : (
          <div key={p.slug} className="flex items-center gap-3 rounded-[10px] border border-border p-4 opacity-60">
            {content}
          </div>
        );
      })}
    </div>
  );
}
