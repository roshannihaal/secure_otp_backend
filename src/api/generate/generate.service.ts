import { randomUUID } from 'crypto';
import speakeasy, { GeneratedSecret } from 'speakeasy';
import {
  AddEmailTransactionDTO,
  constants,
  errors,
  generateSecret,
  addTransaction,
  AddAuthenticatorTransactionDTO,
  generateQRCode,
  sendEmail,
  maskEmail,
} from '../../utils';
import { GenerateAuthenticatorResponseDTO, GenerateEmailResponseDTO } from './generate.dto';
import { config } from '../../config';
abstract class Generate {
  abstract generate(
    type: string,
    id: string | undefined,
  ): Promise<GenerateAuthenticatorResponseDTO | GenerateEmailResponseDTO>;
}

class GenerateImpl extends Generate {
  otpCounterInit = config.OTP_COUNTER_INIT;
  otpMaxAttempts = config.OTP_MAX_ATTEMPTS;

  async generate(
    type: string,
    id: string | undefined,
  ): Promise<GenerateAuthenticatorResponseDTO | GenerateEmailResponseDTO> {
    const transactionId = this.generateTransactionId();
    const secret: GeneratedSecret = generateSecret(transactionId);
    if (type === constants.EMAIL && id) {
      const otp = await this.generateHotp(transactionId, secret, id);
      const maskedEmail = maskEmail(id);
      await sendEmail(id, otp);
      const response: GenerateEmailResponseDTO = {
        message: `OTP Sent to ${maskedEmail}`,
        data: {
          transactionId,
        },
      };
      return response;
    } else if (type === constants.AUTHENTICATOR) {
      const qrcode = await this.generateTotp(transactionId, secret);
      const response: GenerateAuthenticatorResponseDTO = {
        message: 'New QR Code Generated',
        data: {
          qrcode,
          transactionId,
        },
      };
      return response;
    }
    throw new Error(errors.INVALID_TYPE);
  }

  private async generateHotp(
    transactionId: string,
    secret: GeneratedSecret,
    id: string,
  ): Promise<string> {
    const data = AddEmailTransactionDTO.parse({
      type: constants.EMAIL,
      counter: this.otpCounterInit,
      id,
      limit: this.otpMaxAttempts,
      verified: false,
      ...secret,
    });
    await addTransaction(transactionId, data);
    const token = speakeasy.hotp({
      secret: data.base32,
      encoding: 'base32',
      counter: data.counter,
    });
    return token;
  }

  private async generateTotp(transactionId: string, secret: GeneratedSecret): Promise<string> {
    const data = AddAuthenticatorTransactionDTO.parse({
      type: constants.AUTHENTICATOR,
      ...secret,
    });
    await addTransaction(transactionId, data);
    const qrcode = await generateQRCode(data.otpauth_url);
    return qrcode;
  }

  private generateTransactionId(): string {
    const transactionId = randomUUID();
    return transactionId;
  }
}

export const generateService = new GenerateImpl();
