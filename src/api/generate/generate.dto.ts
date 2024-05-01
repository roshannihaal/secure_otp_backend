import { z } from 'zod';

export const GenerateOtpDTO = z.object({
  type: z.enum(['email'], {
    required_error: 'type is requireed',
    invalid_type_error: 'type must be a string',
  }),
  id: z
    .string({
      required_error: 'id is requireed',
      invalid_type_error: 'id must be a string',
    })
    .trim(),
});
export type GenerateOtpDTO = z.input<typeof GenerateOtpDTO>;
