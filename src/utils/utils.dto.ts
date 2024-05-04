import { z } from 'zod';
import { constants } from './Constants';

export const AddTransactionDTO = z.object({
  type: z.enum([constants.EMAIL, constants.AUTHENTICATOR]),
});

export const AddAuthenticatorTransactionDTO = AddTransactionDTO.extend({
  base32: z.string(),
  otpauth_url: z.string(),
});
export type AddAuthenticatorTransactionDTO = z.input<typeof AddAuthenticatorTransactionDTO>;

export const AddEmailTransactionDTO = AddTransactionDTO.extend({
  base32: z.string(),
  counter: z.number(),
  id: z.string(),
  limit: z.number(),
  verified: z.boolean(),
});
export type AddEmailTransactionDTO = z.input<typeof AddEmailTransactionDTO>;

export const IncrementFields = z.enum(['counter', 'limit']);
export type IncrementFields = z.input<typeof IncrementFields>;
