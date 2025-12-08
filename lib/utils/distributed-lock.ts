import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export class DistributedLock {
  private lockKey: string;
  private identifier: string;
  private renewalInterval: NodeJS.Timeout | null = null;

  constructor(lockKey: string) {
    this.lockKey = `job:lock:${lockKey}`;
    this.identifier = `lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async acquire(ttlMs: number = 120000): Promise<boolean> {
    try {
      const acquired = await redisClient.set(
        this.lockKey, 
        this.identifier, 
        'PX', 
        ttlMs, 
        'NX'
      );
      
      if (acquired === 'OK') {
        // Auto-renew lock to prevent expiration during long jobs
        this.renewalInterval = setInterval(async () => {
          try {
            await redisClient.pexpire(this.lockKey, ttlMs);
          } catch (error) {
            console.error('Lock renewal failed:', error);
          }
        }, ttlMs / 2);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Lock acquisition failed:', error);
      return false;
    }
  }

  async release(): Promise<void> {
    if (this.renewalInterval) {
      clearInterval(this.renewalInterval);
      this.renewalInterval = null;
    }

    try {
      // Lua script for atomic lock release
      const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;
      
      await redisClient.eval(luaScript, 1, this.lockKey, this.identifier);
    } catch (error) {
      console.error('Lock release failed:', error);
    }
  }
}

export const withDistributedLock = async (
  lockKey: string, 
  task: () => Promise<void>,
  timeoutMs: number = 30000,
  ttlMs: number = 120000
): Promise<void> => {
  const lock = new DistributedLock(lockKey);
  
  const startTime = Date.now();
  
  // Try to acquire lock with timeout
  while (Date.now() - startTime < timeoutMs) {
    const acquired = await lock.acquire(ttlMs);
    if (acquired) {
      try {
        await task();
        return;
      } finally {
        await lock.release();
      }
    }
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error(`Could not acquire lock for ${lockKey} within ${timeoutMs}ms`);
};