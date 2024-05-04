import {
  constants,
  readTransaction,
  AddEmailTransactionDTO,
  addTransaction,
  errors,
  generateQRCode,
  generateSecret,
  AddAuthenticatorTransactionDTO,
  sendEmail,
  maskEmail,
  incrementTransactionCounter,
} from '../../utils';
import speakeasy, { GeneratedSecret } from 'speakeasy';
import {
  ResendAuthenticatorResponseDTO,
  ResendEmailResponseDTO,
  ResendHotpResponse,
} from './resend.dto';
import { config } from '../../config';

abstract class Resend {
  abstract resend(
    type: string,
    transactionId: string,
  ): Promise<ResendAuthenticatorResponseDTO | ResendEmailResponseDTO>;
}

class ResendImpl extends Resend {
  otpCounterIncrement = config.OTP_COUNTER_INCREMENT;

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
      const { otp, id } = await this.resendHotp(transactionId);
      await sendEmail(id, otp);
      const maskedEmail = maskEmail(id);
      const data: ResendEmailResponseDTO = {
        message: `OTP Sent to ${maskedEmail}`,
        data: { transactionId },
      };
      return data;
    }
    throw new Error(errors.INVALID_TYPE);
  }

  private async resendHotp(transactionId: string): Promise<ResendHotpResponse> {
    const res = await readTransaction(transactionId);
    if (!res || res.type !== constants.EMAIL) {
      throw new Error(errors.INVALID_TRANSACTION_ID);
    }
    const data = AddEmailTransactionDTO.parse(res);
    data.counter += this.otpCounterIncrement;
    const otp = speakeasy.hotp({
      secret: data.base32,
      encoding: 'base32',
      counter: data.counter,
    });
    await incrementTransactionCounter(transactionId);
    const response: ResendHotpResponse = {
      otp,
      id: data.id,
    };
    return response;
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
