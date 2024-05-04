import { createClient, RedisClientType } from 'redis';
import { config } from '../config';
import { AddAuthenticatorTransactionDTO, AddEmailTransactionDTO } from './utils.dto';

const redisPort = config.REDIS_PORT;
const redisHost = config.REDIS_HOST;
const otpExpTime = config.OTP_EXP_TIME;

const client: RedisClientType = createClient({ url: `redis://${redisHost}:${redisPort}` });

export const connectToRedis = async (): Promise<void> => {
  try {
    await client.connect();
    console.log('Conntected to redis');
  } catch (error) {
    throw error;
  }
};

export const addTransaction = async (
  key: string,
  value: AddAuthenticatorTransactionDTO | AddEmailTransactionDTO | any,
): Promise<void> => {
  try {
    const res = await readTransaction(key);
    await client.json.set(key, '$', value);
    if (!res) {
      await client.expire(key, otpExpTime);
    }
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

export const incrementTransactionCounter = async (key: string): Promise<void> => {
  try {
    await client.json.numIncrBy(key, 'counter', 1);
  } catch (error) {
    throw error;
  }
};
