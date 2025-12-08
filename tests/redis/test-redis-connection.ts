// scripts/test-redis-connection.ts
import Redis from 'ioredis';

interface TestResult {
  success: boolean;
  basicOperation?: string;
  lockTest?: boolean;
  error?: string;
  duration?: number;
}

async function testRedisConnection(): Promise<TestResult> {
  const startTime = Date.now();
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  
  try {
    // Test 1: Basic connection and operations
    await redis.set('redis_test_key', 'TypeScript_connected_' + Date.now());
    const value = await redis.get('redis_test_key');
    
    // Test 2: Distributed lock functionality
    const lockKey = 'test:distributed:lock';
    const lockIdentifier = `test_${Date.now()}`;
    const lockAcquired = await redis.set(lockKey, lockIdentifier, 'PX', 10000, 'NX');
    
    // Test 3: Verify lock ownership and release
    let lockReleased = false;
    if (lockAcquired === 'OK') {
      // Verify we own the lock before releasing
      const currentLockValue = await redis.get(lockKey);
      if (currentLockValue === lockIdentifier) {
        await redis.del(lockKey);
        lockReleased = true;
      }
    }

    const duration = Date.now() - startTime;
    
    return {
      success: true,
      basicOperation: `Retrieved: ${value}`,
      lockTest: lockAcquired === 'OK' && lockReleased,
      duration
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    await redis.quit();
  }
}

// Run the test
async function main() {
  console.log('🧪 Testing Redis Connection...\n');
  
  const result = await testRedisConnection();
  
  if (result.success) {
    console.log('✅ Redis Test PASSED:');
    console.log(`   Basic Operation: ${result.basicOperation}`);
    console.log(`   Lock Test: ${result.lockTest ? 'PASSED' : 'FAILED'}`);
    console.log(`   Duration: ${result.duration}ms`);
  } else {
    console.log('❌ Redis Test FAILED:');
    console.log(`   Error: ${result.error}`);
  }
  
  console.log('\n🎉 Test completed!');
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { testRedisConnection };