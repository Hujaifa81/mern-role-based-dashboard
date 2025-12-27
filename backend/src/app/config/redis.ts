import { createClient } from 'redis';
import { envVars } from './envVars';

export const redisClient = createClient({
  url: envVars.REDIS.REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Redis Connected');
  }
};
