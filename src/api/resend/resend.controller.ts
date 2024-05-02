import { Request, Response, NextFunction } from 'express';
import { ResendOtpDTO } from './resend.dto';
import { resendService } from './resend.service';

export const ResendOtp = async (
  req: Request<unknown, unknown, ResendOtpDTO>,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  try {
    const data = await resendService.resend(body.type, body.transactionId);
    const resStatusCode = 200;
    res.status(resStatusCode).send(data);
  } catch (error) {
    next(error);
  }
};
