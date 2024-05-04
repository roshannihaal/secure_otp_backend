import { z } from 'zod';

export const ConfigSchema = z.object({
  PORT: z.string().trim(),
  REDIS_PORT: z.string().trim(),
  REDIS_HOST: z.string().trim(),
  NODE_ENV: z.enum(['development', 'production']),
  APP_NAME: z.string().trim(),
  OTP_EXP_TIME: z
    .string()
    .trim()
    .transform((value) => parseInt(value)),
  OTP_COUNTER_INIT: z
    .string()
    .trim()
    .transform((value) => parseInt(value)),
  OTP_COUNTER_INCREMENT: z
    .string()
    .trim()
    .transform((value) => parseInt(value)),
  OTP_MAX_ATTEMPTS: z
    .string()
    .trim()
    .transform((value) => parseInt(value)),
  EMAIL_HOST: z.string().trim(),
  EMAIL_SERVICE: z.string().trim(),
  EMAIL_PORT: z
    .string()
    .trim()
    .transform((value) => parseInt(value)),
  EMAIL_SECURE: z
    .string()
    .trim()
    .transform((value) => value === 'true'),
  EMAIL_AUTH_USER: z.string().trim(),
  EMAIL_AUTH_PASSWORD: z.string().trim(),
});
export type ConfigSchema = z.input<typeof ConfigSchema>;
