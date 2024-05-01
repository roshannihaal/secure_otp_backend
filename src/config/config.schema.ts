import { z } from 'zod';

export const ConfigSchema = z.object({
  PORT: z.string().trim(),
  REDIS_PORT: z.string().trim(),
  REDIS_HOST: z.string().trim(),
  NODE_ENV: z.enum(['development', 'production']),
});
export type ConfigSchema = z.input<typeof ConfigSchema>;
