import type { ComponentType, CSSProperties, ReactNode } from "react";

export type ShowcaseTint = "surface" | "blue" | "purple" | "peach" | "yellow" | "green" | "none";

const tintClass: Record<ShowcaseTint, string> = {
  surface: "bg-surface/70",
  blue: "bg-pastel-blue/50",
  purple: "bg-pastel-purple/50",
  peach: "bg-pastel-peach/50",
  yellow: "bg-pastel-yellow/60",
  green: "bg-pastel-green/60",
  none: "",
};

// Solid (non-translucent) counterpart to tintClass, used for the small icon
// badge so it reads clearly against the lighter visual-slot background above it.
const iconBgClass: Record<ShowcaseTint, string> = {
  surface: "bg-surface-2",
  blue: "bg-pastel-blue",
  purple: "bg-pastel-purple",
  peach: "bg-pastel-peach",
  yellow: "bg-pastel-yellow",
  green: "bg-pastel-green",
  none: "bg-surface-2",
};

// Thin dark border is the signature, not a soft floating shadow — hover
// strengthens the border and lifts by 2px maximum.
const cardBase =
  "rounded-[12px] border border-border-dark bg-white shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-border-dark-hover";

type IconType = ComponentType<{ className?: string; style?: CSSProperties }>;

type BaseProps = {
  title: string;
  description: string;
  visual?: ReactNode;
  /** Small concept icon shown above the title, in a tinted rounded-square badge. Optional — most cards don't need one. */
  icon?: IconType;
  label?: string;
  tint?: ShowcaseTint;
  className?: string;
};

function IconBadge({ Icon, tint, size }: { Icon: IconType; tint: ShowcaseTint; size: "md" | "sm" }) {
  const box = size === "md" ? "h-10 w-10 rounded-[11px]" : "h-9 w-9 rounded-[10px]";
  const glyph = size === "md" ? "h-[19px] w-[19px]" : "h-[17px] w-[17px]";
  return (
    <div className={`mb-4 flex shrink-0 items-center justify-center ${box} ${iconBgClass[tint]}`}>
      <Icon className={glyph} />
    </div>
  );
}

/** icon+label used when a card already has its own illustrative visual — a lightweight inline row rather than a second stacked badge. */
function IconLabel({ Icon, label, size }: { Icon: IconType; label: string; size: "md" | "sm" }) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-muted">
      <Icon className={size === "md" ? "h-[13px] w-[13px]" : "h-3 w-3"} />
      <span className={`font-semibold uppercase tracking-wide ${size === "md" ? "text-[11.5px]" : "text-[11px]"}`}>{label}</span>
    </div>
  );
}

function TitleMeta({ icon, label, visual, tint, size }: { icon?: IconType; label?: string; visual?: ReactNode; tint: ShowcaseTint; size: "md" | "sm" }) {
  const Icon = icon;
  if (Icon && label) return <IconLabel Icon={Icon} label={label} size={size} />;
  if (Icon && visual) {
    // A visual already carries the card's illustration — keep this to a bare, unboxed glyph so it reads as a tag, not a second graphic.
    return <Icon className={size === "md" ? "mb-2 h-[18px] w-[18px] opacity-70" : "mb-2 h-4 w-4 opacity-70"} />;
  }
  if (Icon) return <IconBadge Icon={Icon} tint={tint} size={size} />;
  if (label) return <div className={`mb-1.5 font-semibold uppercase tracking-wide text-muted ${size === "md" ? "text-[11.5px]" : "text-[11px]"}`}>{label}</div>;
  return null;
}

/** Larger card for the most important feature in a section — visual on top, generous scale. */
export function FeaturedCard({ title, description, visual, icon, label, tint = "surface", className = "" }: BaseProps) {
  return (
    <div className={`${cardBase} flex flex-col p-7 md:p-8 ${className}`}>
      {visual && <div className={`mb-6 rounded-[10px] ${tintClass[tint]} p-4 md:p-5`}>{visual}</div>}
      <TitleMeta icon={icon} label={label} visual={visual} tint={tint} size="md" />
      <div className="text-[22px] font-semibold text-foreground">{title}</div>
      <p className="mt-2.5 max-w-md text-[15.5px] leading-relaxed text-muted">{description}</p>
    </div>
  );
}

/** Default card for a feature that deserves its own visual but not top billing. */
export function StandardCard({ title, description, visual, icon, label, tint = "surface", className = "" }: BaseProps) {
  return (
    <div className={`${cardBase} flex flex-col p-6 ${className}`}>
      {visual && <div className={`mb-5 rounded-[10px] ${tintClass[tint]} p-3.5`}>{visual}</div>}
      <TitleMeta icon={icon} label={label} visual={visual} tint={tint} size="sm" />
      <div className="text-[17px] font-semibold text-foreground">{title}</div>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{description}</p>
    </div>
  );
}

/** Wide card for visuals that need horizontal room — timelines, charts, grids. */
export function HorizontalCard({ title, description, visual, icon, label, tint = "surface", className = "" }: BaseProps) {
  return (
    <div className={`${cardBase} grid grid-cols-1 gap-6 p-7 md:grid-cols-2 md:items-center md:gap-10 md:p-8 ${className}`}>
      <div className="min-w-0">
        <TitleMeta icon={icon} label={label} visual={visual} tint={tint} size="sm" />
        <div className="text-[20px] font-semibold text-foreground">{title}</div>
        <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed text-muted">{description}</p>
      </div>
      {visual && <div className={`min-w-0 rounded-[10px] ${tintClass[tint]} p-4`}>{visual}</div>}
    </div>
  );
}

/** Low-emphasis card for supporting capabilities that shouldn't compete for attention. */
export function CompactCard({ title, description, visual, className = "" }: Omit<BaseProps, "label" | "tint" | "icon">) {
  return (
    <div className={`${cardBase} p-5 ${className}`}>
      {visual && <div className="mb-3">{visual}</div>}
      <div className="text-[15px] font-semibold text-foreground">{title}</div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{description}</p>
    </div>
  );
}
