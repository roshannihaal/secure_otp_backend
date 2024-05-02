import { Request, Response, NextFunction } from 'express';
import { GenerateOtpDTO } from './generate.dto';
import { AddEmailTransactionDTO, addTransaction, constants } from '../../utils';
import { generateService } from './generate.service';
import { AddAuthenticatorTransactionDTO } from '../../utils';
export const generateOtp = async (
  req: Request<unknown, unknown, GenerateOtpDTO>,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  try {
    const transactionId = generateService.generateTransactionId();
    const secret = generateService.generateSecret(transactionId);
    if (body.type === constants.AUTHENTICATOR) {
      const value = AddAuthenticatorTransactionDTO.parse({
        type: constants.AUTHENTICATOR,
        ...secret,
      });
      await addTransaction(transactionId, value);
      const qrcode = await generateService.generateQRCode(value.otpauth_url);
      const resStatusCode = 200;
      res.status(resStatusCode).send({ data: { transactionId, qrcode } });
    } else if (body.type === constants.EMAIL) {
      const value = AddEmailTransactionDTO.parse({ type: constants.EMAIL, ...secret, counter: 0 });
      await addTransaction(transactionId, value);
      const otp = generateService.generateHOTP(secret.base32);
      const resStatusCode = 200;
      res.status(resStatusCode).send({ data: { transactionId, otp } });
    }
  } catch (error) {
    next(error);
  }
};
