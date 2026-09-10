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

// Use real Redis if REDIS_URL is defined, otherwise use MockRedis
export const ioRedis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      connectTimeout: 10000,
    })
  : (new MockRedis() as unknown as Redis); // Type cast to Redis to maintain interface compatibility
