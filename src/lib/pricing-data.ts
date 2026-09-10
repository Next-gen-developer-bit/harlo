export type BillingPeriod = "monthly" | "annual";
export type PlanId = "free" | "creator" | "pro" | "agency";

export type Plan = {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  badge?: "popular" | "agency";
  includesLabel?: string;
  includes: string[];
  /** Shown as a quiet note beneath the feature list, not a pricing claim. */
  footnote?: string;
  cta: string;
  ctaHref: string;
  limits: {
    socialAccounts: string;
    posts: string;
    workspaces: string;
    teamUsers: string;
    analyticsHistory: string;
  };
};

export const ANNUAL_DISCOUNT = 0.2;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// Annual pricing is always derived from the monthly price (20% off, billed
// yearly) so it never has to be kept in sync by hand. Rounded to the
// nearest cent, not the nearest whole dollar — the displayed monthly
// equivalent must match what Stripe actually charges annually (e.g.
// $19 x 0.8 = $15.20/month, billed $182.40/year), and silently rounding
// that to a whole dollar would show a figure that doesn't reconcile with
// the real annual charge.
export function getAnnualPricing(monthlyPrice: number) {
  const perMonth = round2(monthlyPrice * (1 - ANNUAL_DISCOUNT));
  const billedTotal = round2(perMonth * 12);
  return { perMonth, billedTotal };
}

export function formatPrice(n: number) {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

// Harlo bills in USD — made explicit next to prices rather than left
// implicit in a bare "$", per the pricing page's currency requirement.
export const CURRENCY_LABEL = "USD";

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "For getting started with one simple social setup.",
    monthlyPrice: 0,
    includes: [
      "2 social accounts",
      "1 workspace",
      "1 user",
      "30 scheduled posts per month",
      "Content calendar",
      "Drafts",
      "Multi-platform publishing",
      "Platform-specific post editing",
      "Analytics",
      "Content library",
    ],
    cta: "Start free",
    ctaHref: "/signup",
    limits: { socialAccounts: "2", posts: "30 / month", workspaces: "1", teamUsers: "1", analyticsHistory: "30 days" },
  },
  {
    id: "creator",
    name: "Creator",
    description: "For freelancers, creators and small businesses managing their social content consistently.",
    monthlyPrice: 19,
    includesLabel: "Everything in Free, plus:",
    includes: [
      "10 social accounts",
      "Unlimited scheduled posts",
      "Queue scheduling",
      "Full content library",
      "AI caption assistant",
      "Campaign organisation",
      "Extended analytics history",
      "1 workspace",
      "1 user",
    ],
    cta: "Start free trial",
    ctaHref: "/signup",
    limits: { socialAccounts: "10", posts: "Unlimited", workspaces: "1", teamUsers: "1", analyticsHistory: "3 months" },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing teams and professionals managing multiple brands, campaigns and workflows.",
    monthlyPrice: 39,
    badge: "popular",
    includesLabel: "Everything in Creator, plus:",
    includes: [
      "30 social accounts",
      "5 workspaces",
      "3 team users",
      "Team collaboration",
      "Approval workflows",
      "Campaign analytics",
      "Shared workflow tools",
      "Expanded analytics",
      "Reporting and export tools",
    ],
    cta: "Start free trial",
    ctaHref: "/signup",
    limits: { socialAccounts: "30", posts: "Unlimited", workspaces: "5", teamUsers: "3", analyticsHistory: "12 months" },
  },
  {
    id: "agency",
    name: "Agency",
    description: "For agencies managing multiple clients, accounts and team members.",
    monthlyPrice: 99,
    badge: "agency",
    includesLabel: "Everything in Pro, plus:",
    includes: [
      "100 social accounts",
      "15 workspaces",
      "10 team users",
      "Client management",
      "Client approval workflows",
      "Advanced roles and permissions",
      "Client reporting",
      "Priority support",
      "Longer analytics history",
    ],
    footnote: "Need more accounts, workspaces or team members? Contact us.",
    cta: "Start free trial",
    ctaHref: "/signup",
    limits: { socialAccounts: "100", posts: "Unlimited", workspaces: "15", teamUsers: "10", analyticsHistory: "24 months+" },
  },
];

export const plansById: Record<PlanId, Plan> = Object.fromEntries(plans.map((p) => [p.id, p])) as Record<
  PlanId,
  Plan
>;

// --- Trial entitlement rule ------------------------------------------------
// Application/billing logic only — intentionally has no representation
// anywhere on the pricing page. A free trial grants Creator-tier feature
// access and limits, never Pro or Agency; Pro/Agency functionality (higher
// account/workspace/team limits, team collaboration, approval workflows,
// client management, roles & permissions, client reporting) only unlocks
// once the corresponding paid subscription is active. This is the single
// source of truth wherever plan entitlements are checked — access must be
// resolved from subscription state, never from frontend visibility alone.
export type SubscriptionState = "free" | "trial" | "creator_paid" | "pro_paid" | "agency_paid";

export const entitlementByState: Record<SubscriptionState, PlanId> = {
  free: "free",
  trial: "creator",
  creator_paid: "creator",
  pro_paid: "pro",
  agency_paid: "agency",
};

/** Resolves which plan's feature/limit entitlement a given subscription state should receive. */
export function resolveEntitlement(state: SubscriptionState): PlanId {
  return entitlementByState[state];
}

export type ComparisonValue = boolean | string;
export type ComparisonRow = { feature: string; values: Record<PlanId, ComparisonValue>; tooltip?: string };
export type ComparisonGroup = { name: string; rows: ComparisonRow[] };

const allPlanIds: PlanId[] = ["free", "creator", "pro", "agency"];

function row(feature: string, values: Record<PlanId, ComparisonValue>, tooltip?: string): ComparisonRow {
  return { feature, values, tooltip };
}

function limitRow(feature: string, pick: (limits: Plan["limits"]) => string, tooltip?: string): ComparisonRow {
  return row(
    feature,
    Object.fromEntries(allPlanIds.map((id) => [id, pick(plansById[id].limits)])) as Record<PlanId, ComparisonValue>,
    tooltip
  );
}

// Seven sections mirror the plan progression the pricing page is meant to
// tell: Free covers core publishing, Creator is serious solo use, Pro adds
// teams/collaboration/deeper reporting, Agency adds client management and
// scale. Only Phase 1 functionality appears here — nothing on the roadmap.
export const comparisonGroups: ComparisonGroup[] = [
  {
    name: "Usage",
    rows: [
      limitRow("Social accounts", (l) => l.socialAccounts),
      limitRow("Workspaces", (l) => l.workspaces, "Separate environments for managing different brands, businesses or clients."),
      limitRow("Team users", (l) => l.teamUsers, "People who can access and work inside your Harlo account."),
      limitRow("Scheduled posts", (l) => l.posts),
      limitRow("Analytics history", (l) => l.analyticsHistory),
    ],
  },
  {
    name: "Plan & Publish",
    rows: [
      row("Content calendar", { free: true, creator: true, pro: true, agency: true }),
      row("Post scheduling", { free: true, creator: true, pro: true, agency: true }),
      row("Drafts", { free: true, creator: true, pro: true, agency: true }),
      row("Multi-platform publishing", { free: true, creator: true, pro: true, agency: true }),
      row("Platform-specific post editing", { free: true, creator: true, pro: true, agency: true }),
      row("Images, video and multi-media publishing", { free: true, creator: true, pro: true, agency: true }),
      row("Supported social networks", { free: "All networks", creator: "All networks", pro: "All networks", agency: "All networks" }),
      row("Queue scheduling", { free: false, creator: true, pro: true, agency: true }),
      row("Content library", { free: "Basic", creator: "Full", pro: "Full", agency: "Full" }),
      row("Campaign organisation", { free: false, creator: true, pro: true, agency: true }),
    ],
  },
  {
    name: "AI",
    rows: [row("AI caption assistant", { free: false, creator: true, pro: true, agency: true })],
  },
  {
    // Depth, history, comparison, reporting and scale are what customers pay
    // for here — not access to the essential metrics themselves, which stay
    // available from Free upward. "Analytics history" and "Client reporting"
    // intentionally live only in Usage / Agency & Clients rather than being
    // duplicated in this section.
    name: "Analytics & Reporting",
    rows: [
      row("Account overview", { free: true, creator: true, pro: true, agency: true }),
      row("Post performance", { free: true, creator: true, pro: true, agency: true }),
      row("Reach and impressions", { free: true, creator: true, pro: true, agency: true }),
      row("Engagement metrics", { free: true, creator: true, pro: true, agency: true }),
      row("Follower growth", { free: true, creator: true, pro: true, agency: true }),
      row("Period comparison", { free: "Basic", creator: true, pro: true, agency: true }),
      row("Custom date ranges", { free: false, creator: true, pro: true, agency: true }),
      row("Content format performance", { free: false, creator: true, pro: true, agency: true }),
      row("Best days and times", { free: false, creator: true, pro: true, agency: true }),
      row("Platform comparison", { free: false, creator: true, pro: true, agency: true }),
      row("Campaign analytics", { free: false, creator: "Basic", pro: "Advanced", agency: "Advanced" }),
      row("Cross-platform analytics dashboard", { free: false, creator: false, pro: true, agency: true }),
      row("Reporting exports", { free: false, creator: false, pro: true, agency: true }),
      row("Multi-workspace reporting", { free: false, creator: false, pro: false, agency: true }),
    ],
  },
  {
    name: "Collaboration",
    rows: [
      row("Team collaboration", { free: false, creator: false, pro: true, agency: true }),
      row("Approval workflows", { free: false, creator: false, pro: true, agency: true }),
      row("Team roles", { free: false, creator: false, pro: true, agency: true }),
    ],
  },
  {
    name: "Agency & Clients",
    rows: [
      row("Multiple client workspaces", { free: false, creator: false, pro: false, agency: true }),
      row("Client management", { free: false, creator: false, pro: false, agency: true }),
      row("Client approval workflows", { free: false, creator: false, pro: false, agency: true }),
      row("Multi-client campaigns", { free: false, creator: false, pro: false, agency: true }),
      row("Client reporting", { free: false, creator: false, pro: false, agency: true }),
      row("Advanced roles and permissions", { free: false, creator: false, pro: false, agency: true }),
    ],
  },
  {
    name: "Support",
    rows: [
      row("Help centre", { free: true, creator: true, pro: true, agency: true }),
      row("Email support", { free: true, creator: true, pro: true, agency: true }),
      row("Priority support", { free: false, creator: false, pro: false, agency: true }),
    ],
  },
];
