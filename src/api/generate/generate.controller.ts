import { Request, Response, NextFunction } from 'express';
import { GenerateOtpDTO } from './generate.dto';
import { generateService } from './generate.service';
export const generateOtp = async (
  req: Request<unknown, unknown, GenerateOtpDTO>,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  try {
    const data = await generateService.generate(body.type);
    const resStatusCode = 200;
    res.status(resStatusCode).send(data);
  } catch (error) {
    next(error);
  }
};
