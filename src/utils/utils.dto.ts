import { z } from 'zod';

export const addAuthenticatorTransactionDTO = z.object({
  ascii: z.string(),
  hex: z.string(),
  base32: z.string(),
  otpauth_url: z.string(),
});

export type addAuthenticatorTransactionDTO = z.input<typeof addAuthenticatorTransactionDTO>;
