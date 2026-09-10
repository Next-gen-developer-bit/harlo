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
  return '';
};
