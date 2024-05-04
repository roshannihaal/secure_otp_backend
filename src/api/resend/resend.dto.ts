import { z } from 'zod';
import { constants } from '../../utils';

export const ResendOtpDTO = z.object({
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
});

export type ResendOtpDTO = z.input<typeof ResendOtpDTO>;

const DataDTO = z.object({
  transactionId: z.string(),
});
type DataDTO = z.input<typeof DataDTO>;

export const ResendHotpResponse = z.object({
  otp: z.string(),
  id: z.string(),
});
export type ResendHotpResponse = z.input<typeof ResendHotpResponse>;

export const ResendOtpResponseDTO = z.object({
  message: z.string(),
  data: DataDTO.extend({}),
});
export type ResendOtpResponseDTO = z.input<typeof ResendOtpResponseDTO>;

export const ResendAuthenticatorResponseDTO = ResendOtpResponseDTO.extend({
  data: DataDTO.extend({
    qrcode: z.string(),
  }),
});
export type ResendAuthenticatorResponseDTO = z.input<typeof ResendAuthenticatorResponseDTO>;

export const ResendEmailResponseDTO = ResendOtpResponseDTO;
export type ResendEmailResponseDTO = z.input<typeof ResendEmailResponseDTO>;
