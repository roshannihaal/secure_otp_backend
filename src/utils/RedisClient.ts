import { createClient, RedisClientType } from 'redis';
import { config } from '../config';

const redis_port = config.REDIS_PORT;
const redis_host = config.REDIS_HOST;

const client: RedisClientType = createClient({ url: `redis://${redis_host}:${redis_port}` });

export const connectToRedis = async (): Promise<void> => {
  try {
    await client.connect();

    await client.set('key', 'value');
    console.log('Conntected to redis');
  } catch (error) {
    throw error;
  }
};
