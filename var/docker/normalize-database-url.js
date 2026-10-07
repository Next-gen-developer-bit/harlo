#!/usr/bin/env node
/**
 * Normalize DATABASE_URL (and DIRECT_URL) before Prisma runs.
 *
 * Prisma P1013 "invalid port number" almost always means the password has
 * unescaped special characters (@ # / ? : etc.) that break URL parsing.
 * See: https://www.prisma.io/docs/orm/v7/reference/connection-urls#special-characters
 *
 * Usage:
 *   node ./var/docker/normalize-database-url.js
 *   node ./var/docker/normalize-database-url.js --exec -- <cmd> <args...>
 */

const { spawnSync } = require('child_process');

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
    // Already correctly percent-encoded — keep as-is.
    if (value.includes('%') && encodeURIComponent(decodeURIComponent(value)) === value) {
      return value;
    }
  } catch {
    // fall through and encode
  }
  return encodeURIComponent(value);
}

/**
 * Rebuild protocol://user:password@host:port/db by treating the last @ as the
 * userinfo/host separator and percent-encoding user + password.
 */
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
    // Unencoded @ in password often lands in hostname as "something@host"
    if (parsed.hostname.includes('@')) return false;
    return true;
  } catch {
    return false;
  }
}

function normalizeDatabaseUrl(raw) {
  if (!raw) {
    throw new Error(
      'DATABASE_URL is missing. In Render → Environment, set it to your Supabase Postgres URI.\n' +
        'Example:\n' +
        '  postgresql://postgres.PROJECT:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require\n' +
        'If the password has @ # / ? : & etc., percent-encode it (@→%40, #→%23). See\n' +
        'https://www.prisma.io/docs/orm/v7/reference/connection-urls#special-characters'
    );
  }

  let candidate = ensureProtocol(stripWrappingQuotes(raw));
  candidate = encodeUserInfo(candidate);
  candidate = ensureSslMode(candidate);

  if (!looksLikeValidPostgresUrl(candidate)) {
    throw new Error(
      'DATABASE_URL is still invalid after normalization (Prisma P1013 / invalid port).\n' +
        'Fix it in the Render dashboard:\n' +
        '  1. Open Supabase → Project Settings → Database → Connection string (URI)\n' +
        '  2. Use Session pooler host on port 5432 (not 6543 for prisma db push)\n' +
        '  3. Percent-encode special characters in the password:\n' +
        '       node -e "console.log(encodeURIComponent(\'YOUR_PASSWORD\'))"\n' +
        '  4. Set DATABASE_URL to the full URI, e.g.\n' +
        '       postgresql://postgres.REF:ENCODED_PASS@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require\n' +
        'Docs: https://www.prisma.io/docs/orm/v7/reference/connection-urls'
    );
  }

  return candidate;
}

function main() {
  const argv = process.argv.slice(2);
  const execIdx = argv.indexOf('--exec');

  try {
    if (process.env.DATABASE_URL) {
      process.env.DATABASE_URL = normalizeDatabaseUrl(process.env.DATABASE_URL);
    } else {
      normalizeDatabaseUrl(process.env.DATABASE_URL);
    }
    if (process.env.DIRECT_URL) {
      process.env.DIRECT_URL = normalizeDatabaseUrl(process.env.DIRECT_URL);
    }
  } catch (err) {
    console.error(`\n[normalize-database-url] ${err.message}\n`);
    process.exit(1);
  }

  try {
    const u = new URL(process.env.DATABASE_URL);
    if (u.password) u.password = '***';
    console.log(`[normalize-database-url] DATABASE_URL ok → ${u.toString()}`);
  } catch {
    console.log('[normalize-database-url] DATABASE_URL normalized');
  }

  if (execIdx === -1) {
    return;
  }

  const dash = argv.indexOf('--', execIdx);
  const cmd = dash === -1 ? argv.slice(execIdx + 1) : argv.slice(dash + 1);
  if (!cmd.length) {
    console.error('[normalize-database-url] --exec requires a command');
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
