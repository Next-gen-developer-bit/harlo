import { PostgresStore } from '@mastra/pg';

function createStore() {
  const connectionString = (process.env.DATABASE_URL || '').trim();
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is required. Set it to your Postgres connection string (include sslmode=require for Supabase).'
    );
  }
  try {
    // Catch malformed URLs early (e.g. unencoded @ in the password).
    new URL(connectionString);
  } catch {
    throw new Error(
      'DATABASE_URL is not a valid URL. If the password has special characters (@ # / ?), URL-encode them.'
    );
  }
  return new PostgresStore({
    id: 'poscally-store',
    connectionString,
  });
}

let store: PostgresStore | undefined;

/** Lazy so a bad DATABASE_URL does not crash the process at import time. */
export const pStore = new Proxy({} as PostgresStore, {
  get(_target, prop, receiver) {
    if (!store) {
      store = createStore();
    }
    const value = Reflect.get(store as object, prop, receiver);
    return typeof value === 'function' ? value.bind(store) : value;
  },
});
