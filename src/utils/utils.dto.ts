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
});
export type AddEmailTransactionDTO = z.input<typeof AddEmailTransactionDTO>;
