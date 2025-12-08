#!/usr/bin/env tsx
console.log('🚀 Script starting...');

import Redis from 'ioredis';
console.log('✅ ioredis imported');

const redis = new Redis('redis://localhost:6379');
console.log('✅ Redis client created');

redis.on('connect', () => console.log('🔗 Redis connected'));
redis.on('error', (err) => console.log('❌ Redis error:', err.message));

setTimeout(async () => {
  console.log('⏰ Testing connection...');
  try {
    const result = await redis.ping();
    console.log('✅ Ping result:', result);
  } catch (err) {
    console.log('❌ Ping failed:', err);
  } finally {
    await redis.quit();
    console.log('🔚 Script finished');
  }
}, 1000);
