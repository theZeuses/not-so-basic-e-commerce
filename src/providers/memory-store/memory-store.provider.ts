import * as Redis from 'ioredis';
import { redisForMSConfig } from './redis/redis.config';

export const memoryStore = new Redis(redisForMSConfig);