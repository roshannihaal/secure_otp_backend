import { Request, Response, NextFunction } from 'express';
import { GenerateOtpDTO } from './generate.dto';
export const generateOtp = async (
  req: Request<unknown, unknown, GenerateOtpDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const resStatusCode = 200;
    res.status(resStatusCode).send({ message: 'OTP Generated', data: {} });
  } catch (error) {
    next(error);
  }
};
