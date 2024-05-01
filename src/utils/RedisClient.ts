import { createClient, RedisClientType } from 'redis';
import { config } from '../config';
import { addAuthenticatorTransactionDTO } from './utils.dto';

const redisPort = config.REDIS_PORT;
const redisHost = config.REDIS_HOST;

const client: RedisClientType = createClient({ url: `redis://${redisHost}:${redisPort}` });

export const connectToRedis = async (): Promise<void> => {
  try {
    await client.connect();

    await client.set('key', 'value');
    console.log('Conntected to redis');
  } catch (error) {
    throw error;
  }
};

export const addTransaction = async (
  key: string,
  value: addAuthenticatorTransactionDTO,
): Promise<void> => {
  try {
    client.json.set(key, '$', value);
  } catch (error) {
    throw error;
  }
};

export const readTransaction = async (key: string): Promise<any> => {
  try {
    const result = await client.json.get(key);
    return result;
  } catch (error) {
    throw error;
  }
};
