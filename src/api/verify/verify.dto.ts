import { z } from 'zod';
import { constants } from '../../utils';

export const VerifyOtpDTO = z.object({
  type: z.enum([constants.EMAIL, constants.AUTHENTICATOR], {
    required_error: 'type is requireed',
    invalid_type_error: 'type must be a string',
  }),
  transactionId: z
    .string({
      required_error: 'id is requireed',
      invalid_type_error: 'id must be a string',
    })
    .trim(),
  otp: z.string({
    required_error: 'otp is required',
    invalid_type_error: 'otp must be a string',
  }),
});
export type VerifyOtpDTO = z.input<typeof VerifyOtpDTO>;

export const VerifyOtpResponseDTO = z.object({
  message: z.string(),
  verified: z.boolean(),
  statusCode: z.number(),
});
export type VerifyOtpResponseDTO = z.input<typeof VerifyOtpResponseDTO>;
