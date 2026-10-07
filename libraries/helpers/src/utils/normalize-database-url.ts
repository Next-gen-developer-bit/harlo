/**
 * Ensure a value is a Prisma-compatible Postgres URI.
 */
export function normalizePostgresConnectionString(raw: string): string {
  let value = String(raw).trim().replace(/^\uFEFF/, '');
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  value = value.replace(/^DATABASE_URL\s*=\s*/i, '');
  value = value.replace(/^DIRECT_URL\s*=\s*/i, '');

  if (/^jdbc:postgresql:/i.test(value)) {
    value = value.replace(/^jdbc:/i, '');
  }

  if (/^prisma\+postgres:/i.test(value)) {
    throw new Error(
      'DATABASE_URL uses prisma+postgres:// (Accelerate). For this app use a normal Supabase URI starting with postgresql://'
    );
  }

  if (!/^postgres(ql)?:\/\//i.test(value)) {
    const withoutSlashes = value.replace(/^\/\//, '');
    if (withoutSlashes.includes('@')) {
      value = `postgresql://${withoutSlashes}`;
    } else {
      throw new Error(
        `DATABASE_URL must start with postgresql:// or postgres:// (got: ${redact(value)})`
      );
    }
  }

  // Force lowercase protocol — Prisma rejects mixed-case schemes.
  value = value.replace(/^postgres(ql)?:\/\//i, (m) => m.toLowerCase());

  if (/\[YOUR[-_]?PASSWORD\]/i.test(value) || /YOUR_PASSWORD/i.test(value)) {
    throw new Error(
      'DATABASE_URL still contains a password placeholder. Paste the real password from Supabase.'
    );
  }

  value = encodeUserInfo(value);

  try {
    const parsed = new URL(value);
    if (!parsed.hostname || (parsed.port && !/^\d+$/.test(parsed.port))) {
      throw new Error('invalid host/port');
    }
    if (
      /supabase\.co/i.test(parsed.hostname) &&
      !parsed.searchParams.has('sslmode')
    ) {
      parsed.searchParams.set('sslmode', 'require');
      value = parsed.toString();
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('DATABASE_URL')) {
      throw err;
    }
    throw new Error(
      `DATABASE_URL is not a valid Postgres URI after normalization (got: ${redact(value)}). ` +
        'Paste the Session pooler URI from Supabase (port 5432) starting with postgresql://'
    );
  }

  return value;
}

/**
 * Mutates process.env.DATABASE_URL (and DIRECT_URL when set).
 * Call before PrismaClient is constructed.
 */
export function normalizeDatabaseUrlEnv(
  env: NodeJS.ProcessEnv = process.env
): string {
  if (!env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is missing. Set it in Render to your Supabase Session pooler URI starting with postgresql://'
    );
  }

  const value = normalizePostgresConnectionString(env.DATABASE_URL);
  env.DATABASE_URL = value;

  if (env.DIRECT_URL) {
    env.DIRECT_URL = normalizePostgresConnectionString(env.DIRECT_URL);
  }

  return value;
}

function encodeCredential(value: string): string {
  if (!value) return value;
  try {
    if (
      value.includes('%') &&
      encodeURIComponent(decodeURIComponent(value)) === value
    ) {
      return value;
    }
  } catch {
    // fall through
  }
  return encodeURIComponent(value);
}

function encodeUserInfo(raw: string): string {
  const match = raw.match(/^(postgres(?:ql)?:\/\/)(.+)$/i);
  if (!match) return raw;
  const [, protocol, rest] = match;
  const at = rest.lastIndexOf('@');
  if (at === -1) return raw;
  const userInfo = rest.slice(0, at);
  const hostAndAfter = rest.slice(at + 1);
  const colon = userInfo.indexOf(':');
  if (colon === -1) return raw;
  const user = userInfo.slice(0, colon);
  const password = userInfo.slice(colon + 1);
  return `${protocol}${encodeCredential(user)}:${encodeCredential(
    password
  )}@${hostAndAfter}`;
}

function redact(value: string): string {
  try {
    const u = new URL(
      /^postgres(ql)?:\/\//i.test(value) ? value : `postgresql://${value}`
    );
    if (u.password) u.password = '***';
    return u.toString();
  } catch {
    if (value.length <= 24) return JSON.stringify(value);
    return JSON.stringify(`${value.slice(0, 12)}…${value.slice(-8)}`);
  }
}
