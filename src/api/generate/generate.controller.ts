import { Request, Response, NextFunction } from 'express';
import { GenerateOtpDTO } from './generate.dto';
import { constants } from '../../utils';
import { generateService } from './generate.service';
export const generateOtp = async (
  req: Request<unknown, unknown, GenerateOtpDTO>,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  try {
    let secret, qrcode;
    switch (body.type) {
      case constants.EMAIL:
        break;
      case constants.AUTHENTICATOR:
        secret = generateService.generateSecret(body.id);
        if (secret.otpauth_url) {
          qrcode = await generateService.generateQRCode(secret.otpauth_url);
        }
        break;
    }
    const resStatusCode = 200;
    res.status(resStatusCode).send({ data: { qrcode } });
  } catch (error) {
    next(error);
  }
};
