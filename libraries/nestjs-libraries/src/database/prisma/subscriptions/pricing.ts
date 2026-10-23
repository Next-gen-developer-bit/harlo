export interface PricingInnerInterface {
  current: string;
  label: string;
  checkout: boolean;
  month_price: number;
  year_price: number;
  channel?: number;
  posts_per_month: number;
  users: number;
  workspaces: number;
  storage_mb: number;
  max_file_mb: number;
  analytics_days: number;
  queue: boolean;
  recurring: boolean;
  reports: 'none' | 'basic' | 'full' | 'agency';
  exports: boolean;
  campaigns: 'none' | 'yes' | 'full';
  client_workspaces: boolean;
  priority_support: boolean;
  team_members: boolean;
  community_features: boolean;
  featured_by_gitroom: boolean;
  ai: boolean;
  import_from_channels: boolean;
  image_generator?: boolean;
  image_generation_count: number;
  generate_videos: number;
  public_api: boolean;
  webhooks: number;
  autoPost: boolean;
}

export interface PricingInterface {
  [key: string]: PricingInnerInterface;
}

const unlimitedPosts = 1000000;

const annualTotal = (monthPrice: number) =>
  Math.round(monthPrice * 12 * 0.8 * 100) / 100;

export const stripeUnitAmount = (dollars: number) => Math.round(dollars * 100);

export const formatStorage = (mb: number) =>
  mb >= 1024 ? `${Math.round(mb / 1024)} GB` : `${mb} MB`;

export const formatAnalyticsHistory = (days: number) => {
  if (days >= 700) {
    return '24 months';
  }
  if (days >= 360) {
    return '12 months';
  }
  return `${days} days`;
};

export const planFor = (tier?: string | null) =>
  pricing[tier || 'FREE'] || pricing.FREE;

export const pricing: PricingInterface = {
  FREE: {
    current: 'FREE',
    label: 'Free',
    checkout: false,
    month_price: 0,
    year_price: 0,
    channel: 2,
    posts_per_month: 10,
    users: 1,
    workspaces: 1,
    storage_mb: 500,
    max_file_mb: 100,
    analytics_days: 30,
    queue: false,
    recurring: false,
    reports: 'none',
    exports: false,
    campaigns: 'none',
    client_workspaces: false,
    priority_support: false,
    image_generation_count: 0,
    team_members: false,
    community_features: false,
    featured_by_gitroom: false,
    ai: false,
    import_from_channels: false,
    image_generator: false,
    public_api: false,
    webhooks: 0,
    autoPost: false,
    generate_videos: 0,
  },
  CREATOR: {
    current: 'CREATOR',
    label: 'Creator',
    checkout: true,
    month_price: 19,
    year_price: annualTotal(19),
    channel: 10,
    posts_per_month: unlimitedPosts,
    users: 1,
    workspaces: 1,
    storage_mb: 5 * 1024,
    max_file_mb: 500,
    analytics_days: 90,
    queue: true,
    recurring: true,
    reports: 'basic',
    exports: false,
    campaigns: 'none',
    client_workspaces: false,
    priority_support: false,
    image_generation_count: 20,
    team_members: false,
    ai: true,
    community_features: false,
    featured_by_gitroom: false,
    import_from_channels: true,
    image_generator: false,
    public_api: true,
    webhooks: 2,
    autoPost: false,
    generate_videos: 3,
  },
  PRO: {
    current: 'PRO',
    label: 'Pro',
    checkout: true,
    month_price: 39,
    year_price: annualTotal(39),
    channel: 30,
    posts_per_month: unlimitedPosts,
    users: 3,
    workspaces: 5,
    storage_mb: 25 * 1024,
    max_file_mb: 1024,
    analytics_days: 365,
    queue: true,
    recurring: true,
    reports: 'full',
    exports: true,
    campaigns: 'yes',
    client_workspaces: false,
    priority_support: false,
    image_generation_count: 300,
    team_members: true,
    community_features: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 30,
    autoPost: true,
    generate_videos: 30,
  },
  AGENCY: {
    current: 'AGENCY',
    label: 'Agency',
    checkout: true,
    month_price: 99,
    year_price: annualTotal(99),
    channel: 100,
    posts_per_month: unlimitedPosts,
    users: 5,
    workspaces: 15,
    storage_mb: 100 * 1024,
    max_file_mb: 2 * 1024,
    analytics_days: 730,
    queue: true,
    recurring: true,
    reports: 'agency',
    exports: true,
    campaigns: 'full',
    client_workspaces: true,
    priority_support: true,
    image_generation_count: 500,
    team_members: true,
    community_features: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 10000,
    autoPost: true,
    generate_videos: 60,
  },
  // Older subscriptions still stored in the database. Hidden from checkout.
  STANDARD: {
    current: 'STANDARD',
    label: 'Creator',
    checkout: false,
    month_price: 29,
    year_price: 278,
    channel: 10,
    posts_per_month: unlimitedPosts,
    users: 1,
    workspaces: 1,
    storage_mb: 5 * 1024,
    max_file_mb: 500,
    analytics_days: 90,
    queue: true,
    recurring: true,
    reports: 'basic',
    exports: false,
    campaigns: 'none',
    client_workspaces: false,
    priority_support: false,
    image_generation_count: 20,
    team_members: false,
    ai: true,
    community_features: false,
    featured_by_gitroom: false,
    import_from_channels: true,
    image_generator: false,
    public_api: true,
    webhooks: 2,
    autoPost: false,
    generate_videos: 3,
  },
  TEAM: {
    current: 'TEAM',
    label: 'Pro',
    checkout: false,
    month_price: 39,
    year_price: 374,
    channel: 30,
    posts_per_month: unlimitedPosts,
    users: 1000,
    workspaces: 5,
    storage_mb: 25 * 1024,
    max_file_mb: 1024,
    analytics_days: 365,
    queue: true,
    recurring: true,
    reports: 'full',
    exports: true,
    campaigns: 'yes',
    client_workspaces: false,
    priority_support: false,
    image_generation_count: 100,
    community_features: true,
    team_members: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 10,
    autoPost: true,
    generate_videos: 10,
  },
  ULTIMATE: {
    current: 'ULTIMATE',
    label: 'Agency',
    checkout: false,
    month_price: 99,
    year_price: 950,
    channel: 100,
    posts_per_month: unlimitedPosts,
    users: 1000,
    workspaces: 15,
    storage_mb: 100 * 1024,
    max_file_mb: 2 * 1024,
    analytics_days: 730,
    queue: true,
    recurring: true,
    reports: 'agency',
    exports: true,
    campaigns: 'full',
    client_workspaces: true,
    priority_support: true,
    image_generation_count: 500,
    community_features: true,
    team_members: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 10000,
    autoPost: true,
    generate_videos: 60,
  },
};
