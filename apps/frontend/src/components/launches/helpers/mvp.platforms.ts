export const MVP_PLATFORM_IDENTIFIERS = [
  'instagram',
  'instagram-standalone',
  'facebook',
  'linkedin',
  'linkedin-page',
  'tiktok',
  'youtube',
  'threads',
  'pinterest',
  'x',
] as const;

export type MvpPlatformIdentifier = (typeof MVP_PLATFORM_IDENTIFIERS)[number];

export const MVP_PLATFORM_FAMILIES: Record<string, string[]> = {
  instagram: ['instagram', 'instagram-standalone'],
  facebook: ['facebook'],
  linkedin: ['linkedin', 'linkedin-page'],
  tiktok: ['tiktok'],
  youtube: ['youtube'],
  threads: ['threads'],
  pinterest: ['pinterest'],
  x: ['x'],
};

export const isMvpPlatform = (identifier?: string) =>
  !!identifier &&
  MVP_PLATFORM_IDENTIFIERS.includes(identifier as MvpPlatformIdentifier);

export const channelKindLabel = (identifier?: string) => {
  if (identifier === 'linkedin-page') {
    return 'Company page';
  }
  if (identifier === 'linkedin') {
    return 'Personal profile';
  }
  if (identifier === 'instagram') {
    return 'Instagram Business';
  }
  if (identifier === 'instagram-standalone') {
    return 'Instagram';
  }
  if (identifier === 'facebook') {
    return 'Business Page';
  }
  return '';
};

export const platformFamily = (identifier?: string) => {
  if (!identifier) {
    return '';
  }
  if (identifier === 'instagram-standalone') {
    return 'instagram';
  }
  if (identifier === 'linkedin-page') {
    return 'linkedin';
  }
  return identifier;
};

export const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  threads: 'Threads',
  pinterest: 'Pinterest',
  x: 'X',
};

export const SOCIAL_ACCOUNT_FILTERS = [
  'instagram',
  'facebook',
  'linkedin',
  'tiktok',
  'youtube',
  'x',
  'pinterest',
] as const;
