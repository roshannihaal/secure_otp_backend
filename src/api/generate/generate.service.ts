import { randomUUID } from 'crypto';
import speakeasy, { GeneratedSecret } from 'speakeasy';
import QRCode from 'qrcode';
import { config } from '../../config';
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

  generateSecret(): GeneratedSecret {
    const secret: GeneratedSecret = speakeasy.generateSecret({ name: this.appName });
    return secret;
  }

  async generateQRCode(url: string) {
    const qrcode = await QRCode.toDataURL(url);
    return qrcode;
  }
}

export const generateService = new GenerateImpl();
