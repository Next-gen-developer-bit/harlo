import { Redis } from 'ioredis';

// Create a mock Redis implementation for testing environments
class MockRedis {
  private data: Map<string, { value: any; expiresAt?: number }> = new Map();

  async get(key: string) {
    const entry = this.data.get(key);
    if (!entry) {
      return undefined;
    }
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.data.delete(key);
      return undefined;
    }
    return entry.value;
  }

  async set(key: string, value: any, ...rest: any[]) {
    let expiresAt: number | undefined;
    const exIndex = rest.findIndex(
      (item) => String(item).toUpperCase() === 'EX'
    );
    if (exIndex >= 0) {
      const seconds = Number(rest[exIndex + 1]);
      if (Number.isFinite(seconds) && seconds > 0) {
        expiresAt = Date.now() + seconds * 1000;
      }
    }
    this.data.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(key: string) {
    this.data.delete(key);
    return 1;
  }
}

function createRedis() {
  const redisUrl = (process.env.REDIS_URL || '').trim();
  if (!redisUrl) {
    return new MockRedis() as unknown as Redis;
  }
  try {
    const parsed = new URL(redisUrl);
    if (parsed.protocol !== 'redis:' && parsed.protocol !== 'rediss:') {
      console.warn(
        `REDIS_URL must start with redis:// or rediss:// (got ${parsed.protocol}). Using in-memory mock.`
      );
      return new MockRedis() as unknown as Redis;
    }
  } catch {
    console.warn(
      'REDIS_URL is not a valid URL. Using in-memory mock. Example: redis://default:PASSWORD@host:6379'
    );
    return new MockRedis() as unknown as Redis;
  }
  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    connectTimeout: 10000,
  });
}

// Use real Redis if REDIS_URL is defined, otherwise use MockRedis
export const ioRedis = createRedis();
