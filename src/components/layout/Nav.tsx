"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/brand/Logo";
import { productItems, solutionItems, platformItems, categoryTint } from "@/lib/nav-data";
import { HamburgerMenuIcon } from "@/components/icons/NavIcons";
import PlatformBadge from "@/components/icons/PlatformBadge";
import Chevron from "@/components/ui/Chevron";

const linkClass =
  "text-nav font-medium text-foreground transition-colors duration-150 hover:text-foreground/65";

const supportedPlatformNavItems = platformItems
  .filter((p) => p.status === "Supported")
  .map((p) => ({ name: p.name, href: p.href, slug: p.slug }));

type OpenMenu = "product" | "solutions" | "platforms" | null;

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const productWrapRef = useRef<HTMLDivElement>(null);
  const solutionsWrapRef = useRef<HTMLDivElement>(null);
  const platformsWrapRef = useRef<HTMLDivElement>(null);
  const productButtonRef = useRef<HTMLButtonElement>(null);
  const solutionsButtonRef = useRef<HTMLButtonElement>(null);
  const platformsButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const closeMenus = () => setOpenMenu(null);

  // Safeguard against any dropdown/menu remaining visually open after a
  // navigation — covers dropdown link clicks, browser back/forward and any
  // other programmatic route change, not just the explicit onClick handlers.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Lock background scrolling while the mobile menu is open so only the
  // menu panel itself scrolls; restore it when the menu closes.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Click-outside + Escape handling for whichever desktop dropdown is open.
  useEffect(() => {
    if (!openMenu) return;

    const refs = { product: productWrapRef, solutions: solutionsWrapRef, platforms: platformsWrapRef };
    const buttons = { product: productButtonRef, solutions: solutionsButtonRef, platforms: platformsButtonRef };
    const activeRef = refs[openMenu];
    const activeButton = buttons[openMenu];

    const handlePointer = (e: MouseEvent) => {
      if (activeRef.current && !activeRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        activeButton.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openMenu]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="relative mx-auto flex h-16 w-[calc(100%-2.5rem)] items-center md:h-20 lg:w-[min(calc(100%-4rem),var(--harlo-content-width))]">
        <Link href="/" className="flex shrink-0 items-center">
          <Logo variant="dark" height={26} className="md:hidden" priority />
          <Logo variant="dark" height={28} className="hidden md:inline-flex" priority />
        </Link>

        <div className="ml-auto hidden items-center lg:flex">
          <nav aria-label="Primary" className="flex items-center gap-[28px]">
            <div ref={productWrapRef} className="relative">
              <button
                ref={productButtonRef}
                type="button"
                aria-haspopup="true"
                aria-expanded={openMenu === "product"}
                onClick={() => setOpenMenu((v) => (v === "product" ? null : "product"))}
                className={`-mx-3 -my-1.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-nav font-medium transition-colors duration-150 ${
                  openMenu === "product" ? "bg-surface text-foreground" : "text-foreground hover:text-foreground/65"
                }`}
              >
                Product
                <Chevron open={openMenu === "product"} />
              </button>

              <div
                inert={openMenu !== "product"}
                className={`absolute left-0 top-full mt-3 w-[340px] overflow-hidden rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-white shadow-[0_24px_60px_-16px_rgba(15,23,42,0.14)] transition-all duration-[180ms] ease-out ${
                  openMenu === "product" ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <div className="p-3">
                  {productItems.map((item) => (
                    <ProductItemRow key={item.key} item={item} onNavigate={closeMenus} />
                  ))}
                </div>
                <div className="flex justify-end border-t border-border/70 px-5 py-4">
                  <Link
                    href="/features"
                    onClick={closeMenus}
                    className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary transition-colors duration-150 hover:text-primary/75"
                  >
                    View all features
                    <span aria-hidden="true" className="text-[13px] leading-none">→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div ref={solutionsWrapRef} className="relative">
              <button
                ref={solutionsButtonRef}
                type="button"
                aria-haspopup="true"
                aria-expanded={openMenu === "solutions"}
                onClick={() => setOpenMenu((v) => (v === "solutions" ? null : "solutions"))}
                className={`-mx-3 -my-1.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-nav font-medium transition-colors duration-150 ${
                  openMenu === "solutions" ? "bg-surface text-foreground" : "text-foreground hover:text-foreground/65"
                }`}
              >
                Solutions
                <Chevron open={openMenu === "solutions"} />
              </button>

              <div
                inert={openMenu !== "solutions"}
                className={`absolute left-0 top-full mt-3 w-[320px] overflow-hidden rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-white p-3 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.14)] transition-all duration-[180ms] ease-out ${
                  openMenu === "solutions" ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                {solutionItems.map((item) => (
                  <ProductItemRow key={item.href} item={item} onNavigate={closeMenus} />
                ))}
              </div>
            </div>

            <div ref={platformsWrapRef} className="relative">
              <button
                ref={platformsButtonRef}
                type="button"
                aria-haspopup="true"
                aria-expanded={openMenu === "platforms"}
                onClick={() => setOpenMenu((v) => (v === "platforms" ? null : "platforms"))}
                className={`-mx-3 -my-1.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-nav font-medium transition-colors duration-150 ${
                  openMenu === "platforms" ? "bg-surface text-foreground" : "text-foreground hover:text-foreground/65"
                }`}
              >
                Platforms
                <Chevron open={openMenu === "platforms"} />
              </button>

              <div
                inert={openMenu !== "platforms"}
                className={`absolute left-0 top-full mt-3 w-[280px] overflow-hidden rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-white p-3 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.14)] transition-all duration-[180ms] ease-out ${
                  openMenu === "platforms" ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <div className="grid grid-cols-2 gap-1">
                  {supportedPlatformNavItems.map((p) => (
                    <Link
                      key={p.slug}
                      href={p.href}
                      onClick={closeMenus}
                      className="flex items-center gap-2 rounded-xl p-2 transition-colors duration-150 hover:bg-[#F5F7FF]"
                    >
                      <PlatformBadge slug={p.slug} size={26} rounded="rounded-[8px]" />
                      <span className="truncate text-[13.5px] font-medium text-foreground">{p.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/resources" className={linkClass}>
              Resources
            </Link>
            <Link href="/pricing" className={linkClass}>
              Pricing
            </Link>
          </nav>

          <div className="ml-[22px] flex items-center gap-2">
            <Link
              href="/login"
              className="flex h-10 items-center rounded-[9px] border border-border-dark bg-white px-4 text-nav font-medium text-foreground transition-colors duration-150 hover:border-border-dark-hover hover:bg-surface"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              data-track="signup_started"
              className="flex h-10 items-center rounded-[9px] bg-primary px-5 text-nav font-semibold text-white transition-all duration-150 hover:-translate-y-px hover:brightness-95"
            >
              Start free
            </Link>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2.5 lg:hidden">
          <Link
            href="/signup"
              data-track="signup_started"
            className="hidden h-9 items-center rounded-[9px] bg-primary px-4 text-[13.5px] font-semibold text-white transition-colors duration-150 hover:brightness-95 min-[420px]:flex"
          >
            Start free
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-[9px] text-foreground transition-colors duration-150 hover:bg-surface"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <MenuGlyph open={mobileOpen} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full max-h-[calc(100dvh-64px)] w-full overflow-y-auto overscroll-contain border-b border-border bg-background p-2 lg:hidden"
          style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
        >
          <nav aria-label="Mobile" className="flex flex-col">
            <MobileAccordion label="Product" items={productItems} onNavigate={() => setMobileOpen(false)} viewAllHref="/features" viewAllLabel="View all features" />
            <MobileAccordion label="Solutions" items={solutionItems} onNavigate={() => setMobileOpen(false)} />
            <MobilePlatformsAccordion onNavigate={() => setMobileOpen(false)} />
            <MobileLink href="/resources" onClick={() => setMobileOpen(false)}>
              Resources
            </MobileLink>
            <MobileLink href="/pricing" onClick={() => setMobileOpen(false)}>
              Pricing
            </MobileLink>
            <div className="my-2 border-t border-border" />
            <MobileLink href="/login" onClick={() => setMobileOpen(false)}>
              Sign in
            </MobileLink>
            <div className="p-2">
              <Link
                href="/signup"
              data-track="signup_started"
                onClick={() => setMobileOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-[9px] bg-primary text-[14px] font-semibold text-white transition-colors duration-150 hover:brightness-95"
              >
                Start free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

type NavRowItem = {
  key?: string;
  name: string;
  href: string;
  blurb?: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
};

// One flat, icon-led row per product pillar or audience — no nested
// sub-items. Each row links straight to its primary page; depth lives on
// that page, not in the dropdown.
function ProductItemRow({ item, onNavigate }: { item: NavRowItem; onNavigate: () => void }) {
  const Icon = item.icon;
  const tint = categoryTint[item.key ?? ""];

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-xl p-2.5 transition-colors duration-150 hover:bg-[#F5F7FF]"
    >
      {Icon && (
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
          style={{ background: tint?.bg ?? "var(--pastel-blue)" }}
        >
          <Icon className="h-[18px] w-[18px]" style={{ color: tint?.fg ?? "#3D5AFE" }} />
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate text-[14.5px] font-semibold text-foreground">{item.name}</span>
        {item.blurb && <span className="mt-0.5 block truncate text-[12.5px] text-muted">{item.blurb}</span>}
      </span>
    </Link>
  );
}

function MobileAccordion({
  label,
  items,
  onNavigate,
  viewAllHref,
  viewAllLabel,
}: {
  label: string;
  items: NavRowItem[];
  onNavigate: () => void;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[44px] w-full items-center justify-between rounded-xl px-4 text-[15px] font-medium text-foreground transition-colors duration-150 hover:bg-surface"
      >
        {label}
        <Chevron open={open} />
      </button>
      {open && (
        <div className="pb-1 pl-2">
          {items.map((item) => {
            const Icon = item.icon;
            const tint = categoryTint[item.key ?? ""];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="flex min-h-[44px] items-center gap-2.5 rounded-xl px-4 text-[14.5px] font-medium text-foreground transition-colors duration-150 hover:bg-surface"
              >
                {Icon && (
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px]"
                    style={{ background: tint?.bg ?? "var(--pastel-blue)" }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: tint?.fg ?? "#3D5AFE" }} />
                  </span>
                )}
                {item.name}
              </Link>
            );
          })}
          {viewAllHref && (
            <Link
              href={viewAllHref}
              onClick={onNavigate}
              className="flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 text-[14px] font-semibold text-primary transition-colors duration-150 hover:bg-surface"
            >
              {viewAllLabel}
              <span aria-hidden="true" className="text-[13px] leading-none">→</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// Closed state uses the supplied hamburger-menu asset; the open/close state
// otherwise has no icon in the library, so it falls back to a plain text
// glyph rather than a drawn "X".
function MenuGlyph({ open }: { open: boolean }) {
  if (open) {
    return (
      <span aria-hidden="true" className="text-[20px] leading-none text-foreground">
        ×
      </span>
    );
  }
  return <HamburgerMenuIcon className="h-[18px] w-[18px]" />;
}

function MobilePlatformsAccordion({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[44px] w-full items-center justify-between rounded-xl px-4 text-[15px] font-medium text-foreground transition-colors duration-150 hover:bg-surface"
      >
        Platforms
        <Chevron open={open} />
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-1 pb-1 pl-2 pr-2">
          {supportedPlatformNavItems.map((p) => (
            <Link
              key={p.slug}
              href={p.href}
              onClick={onNavigate}
              className="flex min-h-[44px] items-center gap-2.5 rounded-xl px-2 text-[14px] font-medium text-foreground transition-colors duration-150 hover:bg-surface"
            >
              <PlatformBadge slug={p.slug} size={22} rounded="rounded-[7px]" />
              <span className="truncate">{p.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex min-h-[44px] items-center rounded-xl px-3 text-[15px] font-medium text-foreground transition-colors duration-150 hover:bg-surface"
    >
      {children}
    </Link>
  );
}
