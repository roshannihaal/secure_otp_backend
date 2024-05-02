import { z } from 'zod';
import { constants } from '../../utils';

export const GenerateOtpDTO = z.object({
  type: z.enum([constants.EMAIL, constants.AUTHENTICATOR], {
    required_error: 'type is requireed',
    invalid_type_error: 'type must be a string',
  }),
  id: z
    .string({
      required_error: 'id is requireed',
      invalid_type_error: 'id must be a string',
    })
    .trim()
    .optional(),
});
export type GenerateOtpDTO = z.input<typeof GenerateOtpDTO>;

const DataDTO = z.object({
  transactionId: z.string(),
});
type DataDTO = z.input<typeof DataDTO>;

export const GenerateOtpResponseDTO = z.object({
  message: z.string(),
  data: DataDTO.extend({}),
});
export type GenerateOtpResponseDTO = z.input<typeof GenerateOtpResponseDTO>;

export const GenerateAuthenticatorResponseDTO = GenerateOtpResponseDTO.extend({
  data: DataDTO.extend({
    qrcode: z.string(),
  }),
});
export type GenerateAuthenticatorResponseDTO = z.input<typeof GenerateAuthenticatorResponseDTO>;

export const GenerateEmailResponseDTO = GenerateOtpResponseDTO.extend({
  data: DataDTO.extend({
    otp: z.string(),
  }),
});
export type GenerateEmailResponseDTO = z.input<typeof GenerateEmailResponseDTO>;
