export default function FeatureCheck({ inverted = false, className = "" }: { inverted?: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border text-[11px] leading-none ${
        inverted ? "border-white/40 text-white" : "border-primary/30 text-primary"
      } ${className}`}
    >
      ✓
    </span>
  );
}
