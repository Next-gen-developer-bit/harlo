#!/usr/bin/env node
/**
 * Normalize env URLs before Prisma / the API start.
 *
 * - DATABASE_URL / DIRECT_URL: percent-encode user/password so Prisma does not
 *   throw P1013 "invalid port" when the Supabase password has @ # / ? etc.
 *   You can paste the Supabase URI as-is; this script fixes encoding.
 * - FRONTEND_URL / MAIN_URL / NEXT_PUBLIC_BACKEND_URL / BACKEND_INTERNAL_URL:
 *   prepend https:// when the protocol is missing (common Render mistake that
 *   surfaces as uncaughtException: Invalid URL).
 *
 * Usage:
 *   node ./var/docker/normalize-database-url.js
 *   node ./var/docker/normalize-database-url.js --exec -- <cmd> <args...>
 */

const { spawnSync } = require('child_process');

const HTTP_URL_KEYS = [
  'FRONTEND_URL',
  'MAIN_URL',
  'NEXT_PUBLIC_BACKEND_URL',
  'BACKEND_INTERNAL_URL',
];

function stripWrappingQuotes(value) {
  const trimmed = String(value || '').trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function ensureProtocol(raw) {
  if (/^postgres(ql)?:\/\//i.test(raw)) return raw;
  if (raw.includes('@') && raw.includes(':')) {
    return `postgresql://${raw}`;
  }
  return raw;
}

function encodeCredential(value) {
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

function encodeUserInfo(raw) {
  const withProtocol = ensureProtocol(raw);
  const protoMatch = withProtocol.match(/^(postgres(?:ql)?:\/\/)(.+)$/i);
  if (!protoMatch) return withProtocol;

  const [, protocol, rest] = protoMatch;
  const at = rest.lastIndexOf('@');
  if (at === -1) return withProtocol;

  const userInfo = rest.slice(0, at);
  const hostAndAfter = rest.slice(at + 1);
  const colon = userInfo.indexOf(':');
  if (colon === -1) return withProtocol;

  const user = userInfo.slice(0, colon);
  const password = userInfo.slice(colon + 1);

  return `${protocol}${encodeCredential(user)}:${encodeCredential(
    password
  )}@${hostAndAfter}`;
}

function ensureSslMode(urlString) {
  try {
    const parsed = new URL(urlString);
    if (
      !parsed.searchParams.has('sslmode') &&
      /supabase\.co/i.test(parsed.hostname)
    ) {
      parsed.searchParams.set('sslmode', 'require');
      return parsed.toString();
    }
  } catch {
    // ignore
  }
  return urlString;
}

function looksLikeValidPostgresUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    if (!/^postgres(ql)?:$/i.test(parsed.protocol)) return false;
    if (!parsed.hostname) return false;
    if (parsed.port && !/^\d+$/.test(parsed.port)) return false;
    if (parsed.hostname.includes('@')) return false;
    return true;
  } catch {
    return false;
  }
}

function normalizeDatabaseUrl(raw) {
  if (!raw) {
    throw new Error(
      'DATABASE_URL is missing. In Render → Environment, paste the Supabase URI from:\n' +
        '  https://supabase.com/dashboard/project/sqnqpiaauuxyrsofajzo/settings/database\n' +
        'Use Session mode / port 5432. Example:\n' +
        '  postgresql://postgres.sqnqpiaauuxyrsofajzo:PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require'
    );
  }

  let candidate = ensureProtocol(stripWrappingQuotes(raw));
  // Supabase copy sometimes leaves the literal placeholder in place.
  if (/\[YOUR[-_]?PASSWORD\]/i.test(candidate) || /YOUR_PASSWORD/i.test(candidate)) {
    throw new Error(
      'DATABASE_URL still contains a password placeholder. Replace it with your real DB password from Supabase → Database settings.'
    );
  }
  candidate = encodeUserInfo(candidate);
  candidate = ensureSslMode(candidate);

  if (!looksLikeValidPostgresUrl(candidate)) {
    throw new Error(
      'DATABASE_URL is invalid (Prisma P1013 / Invalid URL).\n' +
        'Paste the Session pooler URI from Supabase (port 5432) directly into Render.\n' +
        'If the password has special characters, either reset it to letters/numbers only, or encode it:\n' +
        '  node -e "console.log(encodeURIComponent(\'YOUR_PASSWORD\'))"\n' +
        'Docs: https://www.prisma.io/docs/orm/v7/reference/connection-urls'
    );
  }

  try {
    const port = new URL(candidate).port;
    if (port === '6543') {
      console.warn(
        '[normalize-env] DATABASE_URL uses port 6543 (transaction pooler). Prefer Session mode port 5432 for prisma db push.'
      );
    }
  } catch {
    // ignore
  }

  return candidate;
}

function normalizeHttpUrl(raw, key) {
  if (!raw) return raw;
  let value = stripWrappingQuotes(raw).replace(/\/+$/, '');
  if (!value) return value;
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
    console.warn(`[normalize-env] ${key}: prepended https:// → ${value}`);
  }
  try {
    new URL(value);
  } catch {
    console.warn(
      `[normalize-env] ${key} is still not a valid URL: ${value}. Set a full URL like https://example.com`
    );
  }
  return value;
}

function normalizeAll() {
  if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = normalizeDatabaseUrl(process.env.DATABASE_URL);
  } else {
    normalizeDatabaseUrl(process.env.DATABASE_URL);
  }
  if (process.env.DIRECT_URL) {
    process.env.DIRECT_URL = normalizeDatabaseUrl(process.env.DIRECT_URL);
  }
  for (const key of HTTP_URL_KEYS) {
    if (process.env[key]) {
      process.env[key] = normalizeHttpUrl(process.env[key], key);
    }
  }
}

function main() {
  const argv = process.argv.slice(2);
  const execIdx = argv.indexOf('--exec');

  try {
    normalizeAll();
  } catch (err) {
    console.error(`\n[normalize-env] ${err.message}\n`);
    process.exit(1);
  }

  try {
    const u = new URL(process.env.DATABASE_URL);
    if (u.password) u.password = '***';
    console.log(`[normalize-env] DATABASE_URL ok → ${u.toString()}`);
  } catch {
    console.log('[normalize-env] DATABASE_URL normalized');
  }

  if (execIdx === -1) {
    return;
  }

  const dash = argv.indexOf('--', execIdx);
  const cmd = dash === -1 ? argv.slice(execIdx + 1) : argv.slice(dash + 1);
  if (!cmd.length) {
    console.error('[normalize-env] --exec requires a command');
    process.exit(1);
  }

  const result = spawnSync(cmd[0], cmd.slice(1), {
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  });
  process.exit(result.status == null ? 1 : result.status);
}

main();
