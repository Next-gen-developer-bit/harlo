const FALLBACK = 'Publishing failed';
const TRIAL_MESSAGE =
  'Pinterest Trial access cannot create live pins. Request Standard access in the Pinterest developer portal. Until it is approved, this pin cannot be published.';

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
  const text = message.replace(/^ApplicationFailure:\s*/, '').trim();
  if (
    text.includes('Trial access') ||
    text.includes('use API Sandbox') ||
    text.includes('"code":29') ||
    text.includes('code": 29')
  ) {
    return TRIAL_MESSAGE;
  }
  if (text === 'Unknown Error') {
    return 'The platform rejected this post.';
  }
  return text.split('\n')[0].trim() || FALLBACK;
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
      const apiMessage = json?.message || json?.error?.message || parsed.message;
      if (typeof apiMessage === 'string' && apiMessage.trim()) {
        return polish(apiMessage);
      }
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
  const nested =
    fromObject((obj.cause as any)?.failure?.message, depth + 1) ||
    fromObject((obj.failure as any)?.message, depth + 1) ||
    fromObject(obj.message, depth + 1);
  if (nested && nested !== 'The platform rejected this post.') {
    return nested;
  }

  return fromTemporalDetails(value) || nested;
};

export const readablePostError = (error?: unknown) => {
  if (error == null || error === '') {
    return FALLBACK;
  }
  return fromObject(error) || FALLBACK;
};
