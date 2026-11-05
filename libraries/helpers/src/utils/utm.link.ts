export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

const UTM_FIELDS: Array<[keyof UtmParams, string]> = [
  ['source', 'utm_source'],
  ['medium', 'utm_medium'],
  ['campaign', 'utm_campaign'],
  ['term', 'utm_term'],
  ['content', 'utm_content'],
];

const emptyParams = (): UtmParams => ({
  source: '',
  medium: '',
  campaign: '',
  term: '',
  content: '',
});

const withProtocol = (value: string) =>
  /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;

const withoutEmptySlash = (url: URL, original: string) => {
  const href = url.toString();
  const hostAndRest = original.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
  const hadPath = hostAndRest.includes('/');
  if (url.pathname === '/' && !hadPath) {
    return href.replace(/^(https?:\/\/[^/?#]+)\/(?=[?#]|$)/, '$1');
  }
  return href;
};

export const buildUtmUrl = (base: string, params: UtmParams) => {
  const trimmed = base.trim();
  if (!trimmed || /\s/.test(trimmed)) {
    return '';
  }

  let url: URL;
  try {
    url = new URL(withProtocol(trimmed));
  } catch {
    return '';
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return '';
  }
  if (!url.hostname.includes('.')) {
    return '';
  }

  for (const [, query] of UTM_FIELDS) {
    url.searchParams.delete(query);
  }
  for (const [field, query] of UTM_FIELDS) {
    const value = (params[field] || '').trim();
    if (value) {
      url.searchParams.set(query, value);
    }
  }

  return withoutEmptySlash(url, withProtocol(trimmed));
};

export const parseUtmUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(withProtocol(trimmed));
  } catch {
    return null;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return null;
  }

  const params = emptyParams();
  for (const [field, query] of UTM_FIELDS) {
    params[field] = url.searchParams.get(query) || '';
    url.searchParams.delete(query);
  }

  return {
    base: withoutEmptySlash(url, withProtocol(trimmed)),
    params,
  };
};

export const defaultUtmParams = (
  source: string,
  campaign?: string
): UtmParams => ({
  source: source.trim() || 'social',
  medium: 'social',
  campaign: (campaign || '').trim(),
  term: '',
  content: '',
});
