import 'dotenv/config';

import { ConfigSchema } from './config.schema';

const result = ConfigSchema.safeParse(process.env);
if (!result.success) {
  console.error(`Dotenv Config Error: ${result.error}`);
  throw new Error('Invalid Environment Configuration');
}

export const config = result.data;
