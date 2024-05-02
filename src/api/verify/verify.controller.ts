import { Request, Response, NextFunction } from 'express';
import { VerifyOtpDTO } from './verify.dto';
import { constants } from '../../utils';
import { verifyService } from './verify.service';

export const verifyOTP = async (
  req: Request<unknown, unknown, VerifyOtpDTO>,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  try {
    if (body.type === constants.AUTHENTICATOR) {
      const verifyResult = await verifyService.verifyOTP(
        constants.AUTHENTICATOR,
        body.transactionId,
        body.otp,
      );
      if (!verifyResult.verified) {
        res.status(verifyResult.statusCode);
        throw new Error(verifyResult.message);
      }
      const resStatusCode = 200;
      res
        .status(resStatusCode)
        .send({ message: verifyResult.message, data: { verified: verifyResult.verified } });
    } else if (body.type === constants.EMAIL) {
      const verifyResult = await verifyService.verifyOTP(
        constants.EMAIL,
        body.transactionId,
        body.otp,
      );
      if (!verifyResult.verified) {
        res.status(verifyResult.statusCode);
        throw new Error(verifyResult.message);
      }
      const resStatusCode = 200;
      res
        .status(resStatusCode)
        .send({ message: verifyResult.message, data: { verified: verifyResult.verified } });
    }
  } catch (error) {
    next(error);
  }
};
