import { randomUUID } from 'crypto';
import speakeasy, { GeneratedSecret } from 'speakeasy';
import QRCode from 'qrcode';
import { config } from '../../config';
import { constants } from '../../utils';
abstract class Generate {
  abstract generateTransactionId(): string;
  abstract generateSecret(name: string): GeneratedSecret;
}

class GenerateImpl extends Generate {
  appName = config.APP_NAME;
  generateTransactionId(): string {
    const transactionId = randomUUID();
    return transactionId;
  }

  generateSecret(transactionId: string): GeneratedSecret {
    const name = `${transactionId}@${this.appName}`;
    const secret: GeneratedSecret = speakeasy.generateSecret({ name });
    return secret;
  }

  async generateQRCode(url: string) {
    const qrcode = await QRCode.toDataURL(url);
    return qrcode;
  }

  generateHOTP(secret: string) {
    var token = speakeasy.hotp({
      secret: secret,
      encoding: 'base32',
      counter: 0,
    });
    return token;
  }
}

export const generateService = new GenerateImpl();
