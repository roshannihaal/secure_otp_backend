import { z } from 'zod';
import { constants } from './Constants';

export const AddTransactionDTO = z.object({
  type: z.enum([constants.EMAIL, constants.AUTHENTICATOR]),
});

export const AddAuthenticatorTransactionDTO = AddTransactionDTO.extend({
  ascii: z.string(),
  hex: z.string(),
  base32: z.string(),
  otpauth_url: z.string(),
});
export type AddAuthenticatorTransactionDTO = z.input<typeof AddAuthenticatorTransactionDTO>;
