import { Request, Response, NextFunction } from 'express';
import { GenerateOtpDTO } from './generate.dto';
import { addTransaction, constants } from '../../utils';
import { generateService } from './generate.service';
import { AddAuthenticatorTransactionDTO } from '../../utils/utils.dto';
export const generateOtp = async (
  req: Request<unknown, unknown, GenerateOtpDTO>,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  try {
    if (body.type === constants.AUTHENTICATOR) {
      const transactionId = generateService.generateTransactionId();
      const secret = generateService.generateSecret();
      const value = AddAuthenticatorTransactionDTO.parse({
        type: constants.AUTHENTICATOR,
        ...secret,
      });
      await addTransaction(transactionId, value);
      const qrcode = await generateService.generateQRCode(value.otpauth_url);
      const resStatusCode = 200;
      res.status(resStatusCode).send({ data: { transactionId, qrcode } });
    }
  } catch (error) {
    next(error);
  }
};
