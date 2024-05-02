import {
  constants,
  readTransaction,
  AddEmailTransactionDTO,
  addTransaction,
  errors,
  generateQRCode,
  generateSecret,
  AddAuthenticatorTransactionDTO,
} from '../../utils';
import speakeasy, { GeneratedSecret } from 'speakeasy';
import { ResendAuthenticatorResponseDTO, ResendEmailResponseDTO } from './resend.dto';

abstract class Resend {
  abstract resend(
    type: string,
    transactionId: string,
  ): Promise<ResendAuthenticatorResponseDTO | ResendEmailResponseDTO>;
}

class ResendImpl extends Resend {
  async resend(
    type: string,
    transactionId: string,
  ): Promise<ResendAuthenticatorResponseDTO | ResendEmailResponseDTO> {
    if (type === constants.AUTHENTICATOR) {
      const qrcode = await this.resendTotp(transactionId);
      const data: ResendAuthenticatorResponseDTO = {
        message: 'New QR Code Generated',
        data: { qrcode, transactionId },
      };
      return data;
    } else if (type === constants.EMAIL) {
      const otp = await this.resendHotp(transactionId);
      const data: ResendEmailResponseDTO = {
        message: 'New OTP Generated',
        data: { otp, transactionId },
      };
      return data;
    }
    throw new Error(errors.INVALID_TYPE);
  }

  private async resendHotp(transactionId: string): Promise<string> {
    const res = await readTransaction(transactionId);
    if (!res || res.type !== constants.EMAIL) {
      throw new Error(errors.INVALID_TRANSACTION_ID);
    }
    const data = AddEmailTransactionDTO.parse(res);
    data.counter += 1;
    const otp = speakeasy.hotp({
      secret: data.base32,
      encoding: 'base32',
      counter: data.counter,
    });
    await addTransaction(transactionId, data);
    return otp;
  }

  private async resendTotp(transactionId: string): Promise<string> {
    const res = await readTransaction(transactionId);
    if (!res || res.type !== constants.AUTHENTICATOR) {
      throw new Error(errors.INVALID_TRANSACTION_ID);
    }
    const secret: GeneratedSecret = generateSecret(transactionId);
    const data = AddAuthenticatorTransactionDTO.parse({ type: constants.AUTHENTICATOR, ...secret });
    await addTransaction(transactionId, data);
    const qrcode = await generateQRCode(data.otpauth_url);
    return qrcode;
  }
}

export const resendService = new ResendImpl();
