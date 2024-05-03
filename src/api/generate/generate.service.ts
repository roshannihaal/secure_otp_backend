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
} from '../../utils';
import { GenerateAuthenticatorResponseDTO, GenerateEmailResponseDTO } from './generate.dto';
abstract class Generate {
  abstract generate(
    type: string,
  ): Promise<GenerateAuthenticatorResponseDTO | GenerateEmailResponseDTO>;
}

class GenerateImpl extends Generate {
  async generate(
    type: string,
  ): Promise<GenerateAuthenticatorResponseDTO | GenerateEmailResponseDTO> {
    const transactionId = this.generateTransactionId();
    const secret: GeneratedSecret = generateSecret(transactionId);
    if (type === constants.EMAIL) {
      const otp = await this.generateHotp(transactionId, secret);
      const response: GenerateEmailResponseDTO = {
        message: 'New OTP Generated',
        data: {
          otp,
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

  private async generateHotp(transactionId: string, secret: GeneratedSecret): Promise<string> {
    const data = AddEmailTransactionDTO.parse({
      type: constants.EMAIL,
      counter: constants.TOTP_COUNTER_INIT,
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
