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

export const utmToken = (value?: string) => {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return '';
  }
  const slug = trimmed
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || trimmed;
};

export const trackingUrl = (destination: string, params: UtmParams) =>
  buildUtmUrl(destination, {
    source: utmToken(params.source),
    medium: utmToken(params.medium || 'social') || 'social',
    campaign: utmToken(params.campaign),
    term: utmToken(params.term),
    content: utmToken(params.content),
  });

const sameDestination = (left: string, right: string) => {
  try {
    const a = new URL(left);
    const b = new URL(right);
    return (
      a.origin === b.origin &&
      a.pathname.replace(/\/$/, '') === b.pathname.replace(/\/$/, '') &&
      a.search === b.search
    );
  } catch {
    return false;
  }
};

export const rewriteTrackedLinks = (
  content: string,
  destination: string,
  params: UtmParams,
  append: boolean
) => {
  const tracked = trackingUrl(destination, params);
  const target = parseUtmUrl(destination);
  if (!tracked || !target) {
    return { content, found: false };
  }

  let found = false;
  const next = (content || '').replace(/https?:\/\/[^\s"'<>]+/g, (match) => {
    const cleaned = match.replace(/[),.;]+$/g, '').replace(/&amp;/g, '&');
    const suffix = match.slice(match.replace(/[),.;]+$/g, '').length);
    const parsed = parseUtmUrl(cleaned);
    if (!parsed || !sameDestination(parsed.base, target.base)) {
      return match;
    }
    found = true;
    return tracked + suffix;
  });

  if (!found && append) {
    const trimmed = next.trim();
    return {
      content: trimmed ? `${trimmed} ${tracked}` : tracked,
      found: false,
    };
  }

  return { content: next, found };
};

export const applyTrackingToValues = <T extends { content?: string }>(
  values: T[],
  destination: string,
  params: UtmParams
) => {
  let found = false;
  const next = values.map((item) => {
    const result = rewriteTrackedLinks(
      item.content || '',
      destination,
      params,
      false
    );
    if (result.found) {
      found = true;
    }
    return { ...item, content: result.content };
  });

  if (!found && next[0]) {
    next[0] = {
      ...next[0],
      content: rewriteTrackedLinks(
        next[0].content || '',
        destination,
        params,
        true
      ).content,
    };
  }

  return next;
};
