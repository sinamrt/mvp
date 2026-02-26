class DistributedLock {
  private static locks = new Map<string, number>();
  private key: string;

  constructor(key: string) { this.key = key; }

  async acquire(ttlMs: number): Promise<boolean> {
    const expiry = DistributedLock.locks.get(this.key);
    if (expiry && Date.now() < expiry) return false;
    DistributedLock.locks.set(this.key, Date.now() + ttlMs);
    return true;
  }

  async release(): Promise<void> {
    DistributedLock.locks.delete(this.key);
  }
}

export const withDistributedLock = async <T>(
  lockKey:   string,
  task:      () => Promise<T>,
  timeoutMs: number = 30000,
  ttlMs:     number = 120000
): Promise<T> => {
  const lock      = new DistributedLock(lockKey);
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const acquired = await lock.acquire(ttlMs);
    if (acquired) {
      try { return await task(); }
      finally { await lock.release(); }
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Could not acquire lock for ${lockKey} within ${timeoutMs}ms`);
};