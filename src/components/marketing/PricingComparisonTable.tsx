import type { ComponentType, CSSProperties } from "react";
import FeatureCheck from "@/components/ui/FeatureCheck";
import { plans, comparisonGroups, type PlanId, type ComparisonValue, type ComparisonGroup } from "@/lib/pricing-data";
import { BoxIcon, PlayIcon, ChartIcon, TeamIcon, ShopIcon, InfoSquareIcon } from "@/components/icons/NavIcons";
import InfoTooltip from "./InfoTooltip";

const columnOrder: PlanId[] = ["free", "creator", "pro", "agency"];

type GroupIcon = ComponentType<{ className?: string; style?: CSSProperties }>;

// One icon + pale tint per comparison CATEGORY only — individual feature
// rows underneath stay plain text, so the icon reads as a section divider
// rather than a repeated decoration on every line. Icons are drawn from the
// supplied Harlo icon library; "AI" has no accurate match in that set, so it
// intentionally has no icon rather than a forced/approximate one.
const groupStyle: Record<string, { icon?: GroupIcon; tint: string }> = {
  Usage: { icon: BoxIcon, tint: "var(--pastel-blue)" },
  "Plan & Publish": { icon: PlayIcon, tint: "var(--pastel-green)" },
  AI: { tint: "var(--pastel-purple)" },
  "Analytics & Reporting": { icon: ChartIcon, tint: "var(--pastel-peach)" },
  Collaboration: { icon: TeamIcon, tint: "var(--pastel-pink)" },
  "Agency & Clients": { icon: ShopIcon, tint: "var(--pastel-blue)" },
  Support: { icon: InfoSquareIcon, tint: "#E4F2F1" },
};

// Feature column: opaque so it blocks other columns while sticky-scrolling
// horizontally, and it's intentionally NOT the same white as the plan
// columns — a very light neutral distinguishes "this is the label column"
// from "these are the comparable values".
const FEATURE_COL_BG = "#FAFAFB";
const CATEGORY_ROW_BG = "#F8F9FB";
const DIVIDER = "#ECECF1";

export default function PricingComparisonTable() {
  return (
    <div className="relative">
      {/*
        Sticky headers and horizontal scroll fight each other: `overflow-x:
        auto` forces the browser to also compute `overflow-y: auto` on this
        element (a CSS Overflow spec rule — you can't scroll one axis and
        leave the other genuinely "visible"), which makes THIS div the
        containing block for any sticky descendant on the Y axis. Since the
        div's own height auto-fits its content, it never actually scrolls
        vertically, so a naive `sticky top-*` header would silently never
        stick. Fixed by leaning into it deliberately: bound the pane's
        height and let it become a real scrollable region — at every
        breakpoint, since the plan header must stay visible on mobile too —
        with the header sticking to *that pane's* top edge rather than the
        page's.
      */}
      <div
        className="max-h-[70vh] overflow-auto rounded-[10px] border bg-white"
        style={{ borderColor: DIVIDER }}
      >
        <table className="w-full min-w-[780px] border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              <th
                className="sticky left-0 top-0 z-30 w-[190px] min-w-[190px] border-b px-5 pb-4 align-bottom text-[13px] font-medium text-muted md:w-[260px] md:min-w-[260px] md:px-8"
                style={{ backgroundColor: FEATURE_COL_BG, borderColor: DIVIDER }}
              >
                Feature
              </th>
              {columnOrder.map((id) => {
                const plan = plans.find((p) => p.id === id)!;
                const isPopular = plan.badge === "popular";
                return (
                  <th
                    key={id}
                    className={`sticky top-0 z-20 min-w-[130px] border-b px-3 pb-4 text-center align-bottom backdrop-blur-sm ${
                      isPopular ? "bg-primary-soft/60" : "bg-background/95"
                    }`}
                    style={{ borderColor: isPopular ? "rgba(61,90,254,0.2)" : DIVIDER }}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`text-[14.5px] font-semibold ${isPopular ? "text-primary" : "text-foreground"}`}>
                        {plan.name}
                      </span>
                      {isPopular && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[9.5px] font-semibold text-white shadow-[0_4px_10px_-3px_rgba(61,90,254,0.55)]">
                          Most Popular
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {comparisonGroups.map((group, i) => (
              <GroupRows key={group.name} group={group} isFirst={i === 0} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 rounded-r-2xl bg-gradient-to-l from-white to-transparent md:hidden" />
      <div className="mt-3 text-center text-[11.5px] text-muted md:hidden">Swipe to see every plan →</div>
    </div>
  );
}

function GroupRows({ group, isFirst }: { group: ComparisonGroup; isFirst: boolean }) {
  const style = groupStyle[group.name] ?? groupStyle["Usage"];
  const Icon = style.icon;

  return (
    <>
      <tr>
        <td
          colSpan={columnOrder.length + 1}
          className={`border-b px-5 pb-3 md:px-8 ${isFirst ? "pt-4" : "pt-7"}`}
          style={{ backgroundColor: CATEGORY_ROW_BG, borderColor: DIVIDER }}
        >
          <div className="flex items-center gap-4">
            {Icon && (
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px]"
                style={{ background: style.tint }}
              >
                <Icon className="h-[13px] w-[13px]" />
              </span>
            )}
            <span className="text-[11.5px] font-semibold uppercase tracking-wider text-foreground/80">{group.name}</span>
          </div>
        </td>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.feature}>
          <td
            className="sticky left-0 z-10 border-b px-5 py-5 md:px-8"
            style={{ backgroundColor: FEATURE_COL_BG, borderColor: DIVIDER }}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[13.5px] font-medium text-foreground">{row.feature}</span>
              {row.tooltip && <InfoTooltip text={row.tooltip} />}
            </span>
          </td>
          {columnOrder.map((id) => {
            const plan = plans.find((p) => p.id === id)!;
            const isPopular = plan.badge === "popular";
            return (
              <td
                key={id}
                className={`border-b px-3 py-5 text-center text-[13.5px] ${isPopular ? "bg-primary-soft/25" : ""}`}
                style={{ borderColor: isPopular ? "rgba(61,90,254,0.15)" : DIVIDER }}
              >
                <Value value={row.values[id]} />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

function Value({ value }: { value: ComparisonValue }) {
  if (value === true) return <FeatureCheck className="mx-auto" />;
  if (value === false) return <span className="text-muted/50">—</span>;
  return <span className="text-foreground">{value}</span>;
}
