import { Request, Response, NextFunction } from 'express';
import { GenerateOtpDTO } from './generate.dto';
import { generateService } from './generate.service';
import { constants } from '../../utils';
import { z } from 'zod';
export const generateOtp = async (
  req: Request<unknown, unknown, GenerateOtpDTO>,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  try {
    if (body.type === constants.EMAIL) {
      // Required error
      if (!body.id) {
        res.status(422);
        throw new Error('id required for type email');
      }
      // Validate error
      if (!z.string().email().safeParse(body.id).success) {
        res.status(422);
        throw new Error('id must be a valid email for type email');
      }
    }
    const data = await generateService.generate(body.type, body.id);
    const resStatusCode = 200;
    res.status(resStatusCode).send(data);
  } catch (error) {
    next(error);
  }
};
