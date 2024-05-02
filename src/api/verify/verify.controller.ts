import { Request, Response, NextFunction } from 'express';
import { VerifyOtpDTO } from './verify.dto';
import { errors } from '../../utils';
import { verifyService } from './verify.service';

export const verifyOTP = async (
  req: Request<unknown, unknown, VerifyOtpDTO>,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  try {
    const verified = await verifyService.verify(body.type, body.transactionId, body.otp);
    if (!verified) {
      throw new Error(errors.INVALID_OTP);
    }
    const resStatusCode = 200;
    res
      .status(resStatusCode)
      .send({ message: 'OTP Verified', data: { transactionId: body.transactionId } });
  } catch (error) {
    next(error);
  }
};
