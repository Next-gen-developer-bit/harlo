const FALLBACK = 'Publishing failed';
const TRIAL_MESSAGE =
  'Pinterest could not publish this post right now. Please try again later or contact support.';
const PLATFORM_UNAVAILABLE =
  'The platform could not publish this post right now. Please try again later.';
const RECONNECT =
  'The connected account needs to be reconnected before publishing.';
const PERMISSIONS =
  'The connected account needs additional permissions. Reconnect it and try again.';
const VERIFY_ACCOUNT =
  'The platform requires account verification. Complete it on the platform, then try again.';

const isInternalMessage = (text: string) =>
  [
    /activity task failed/i,
    /workflow task failed/i,
    /child workflow/i,
    /applicationfailure/i,
    /activityfailure/i,
    /task queue/i,
    /heartbeat/i,
    /temporal/i,
    /tripped ghost/i,
    /developer portal/i,
    /api credits?/i,
    /credits[- ]?depleted/i,
    /payment required/i,
    /database/i,
    /postgres/i,
    /redis/i,
    /\bsql\b/i,
    /\bquery\b/i,
    /\bworker\b/i,
    /\bserver\b/i,
    /\bexception\b/i,
    /\bstack\b/i,
    /node_modules/i,
    /\/(?:usr|opt|app|home)\//i,
    /prisma\./i,
    /prismaclient/i,
    /unique constraint/i,
    /typeerror:/i,
    /referenceerror:/i,
    /syntaxerror:/i,
    /econn(?:refused|reset)/i,
    /password/i,
    /api[_ -]?key/i,
    /secret/i,
    /\b(?:token|key|secret|password)\s*[:=]/i,
    /\bbearer\s+[a-z0-9._-]+/i,
    /\beyj[a-z0-9_-]{10,}\.[a-z0-9_-]+/i,
    /\b[a-z0-9_-]{40,}\b/i,
    /client_secret/i,
    /access_token/i,
    /authorization:\s*bearer/i,
  ].some((pattern) => pattern.test(text));

const isActionableValidation = (text: string) =>
  /\b(maximum|minimum|at least|at most|too (?:long|large|small)|required|only supports?|does not support|cannot|can't|should|must|invalid|corrupt|unsupported|rejected|violat|flagged|already|please (?:edit|check|remove|add|select|try))\b/i.test(
    text
  ) &&
  /\b(post|comment|caption|character|media|image|photo|video|file|attachment|hashtag|cashtag|link|url|board|page|content|story|article|account|upload)\b/i.test(
    text
  );

const decodeBase64 = (value: string) => {
  try {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(value, 'base64').toString('utf8');
    }
    if (typeof globalThis.atob === 'function') {
      return globalThis.atob(value);
    }
  } catch {
    return '';
  }
  return '';
};

const polish = (message: string) => {
  const text = message.trim();
  if (
    text.includes('Trial access') ||
    text.includes('use API Sandbox') ||
    text.includes('"code":29') ||
    text.includes('code": 29')
  ) {
    return TRIAL_MESSAGE;
  }
  if (isInternalMessage(text)) {
    return PLATFORM_UNAVAILABLE;
  }
  if (text === 'Unknown Error') {
    return PLATFORM_UNAVAILABLE;
  }
  const firstLine = text.split('\n')[0].trim();
  if (
    !firstLine ||
    firstLine.length > 280 ||
    firstLine.startsWith('{') ||
    firstLine.startsWith('[')
  ) {
    return FALLBACK;
  }
  if (
    /(?:re-authenticate|reconnect|access token (?:expired|revoked)|token has been revoked)/i.test(
      firstLine
    )
  ) {
    return RECONNECT;
  }
  if (
    /(?:not enough scopes?|additional permissions?|permission required|insufficient permissions?|not enough permissions?|no permission)/i.test(
      firstLine
    )
  ) {
    return PERMISSIONS;
  }
  if (
    /(?:confirm your identity|security check|limited access to the site)/i.test(
      firstLine
    )
  ) {
    return VERIFY_ACCOUNT;
  }
  if (isActionableValidation(firstLine)) {
    if (/https?:\/\/\S+/i.test(firstLine)) {
      return 'The post contains an invalid or unsupported link.';
    }
    return firstLine;
  }
  if (/(?:currently unavailable|please try again later)/i.test(firstLine)) {
    return PLATFORM_UNAVAILABLE;
  }
  return FALLBACK;
};

const fromTemporalDetails = (value: unknown): string | undefined => {
  const payloads =
    (value as any)?.cause?.failure?.applicationFailureInfo?.details?.payloads ||
    (value as any)?.failure?.applicationFailureInfo?.details?.payloads ||
    (value as any)?.applicationFailureInfo?.details?.payloads ||
    [];

  for (const payload of payloads) {
    const raw = decodeBase64(payload?.data || '');
    if (!raw) {
      continue;
    }
    try {
      const parsed = JSON.parse(raw);
      const json =
        typeof parsed.json === 'string' ? JSON.parse(parsed.json) : parsed.json;
      if (json?.code === 29) {
        return TRIAL_MESSAGE;
      }
    } catch {
      if (raw.includes('Trial access') || raw.includes('code":29')) {
        return TRIAL_MESSAGE;
      }
    }
  }

  return undefined;
};

const fromObject = (value: unknown, depth = 0): string | undefined => {
  if (value == null || depth > 6) {
    return undefined;
  }
  if (typeof value === 'string') {
    const text = value.trim();
    if (!text) {
      return undefined;
    }
    if (text.startsWith('{') || text.startsWith('[')) {
      try {
        return fromObject(JSON.parse(text), depth + 1);
      } catch {
        return polish(text);
      }
    }
    return polish(text);
  }
  if (typeof value !== 'object') {
    return undefined;
  }

  const obj = value as Record<string, unknown>;
  const special = fromTemporalDetails(value);
  if (special) {
    return special;
  }

  let fallback: string | undefined;
  const candidates = [
    (obj.cause as any)?.failure?.cause,
    (obj.cause as any)?.cause,
    (obj.failure as any)?.cause,
    (obj.cause as any)?.failure?.message,
    (obj.cause as any)?.message,
    (obj.failure as any)?.message,
    obj.message,
  ];
  for (const candidate of candidates) {
    const result = fromObject(candidate, depth + 1);
    if (!result) {
      continue;
    }
    if (result !== FALLBACK && result !== PLATFORM_UNAVAILABLE) {
      return result;
    }
    fallback ||= result;
  }

  return fallback;
};

export const readablePostError = (error?: unknown) => {
  if (error == null || error === '') {
    return FALLBACK;
  }
  return fromObject(error) || FALLBACK;
};
