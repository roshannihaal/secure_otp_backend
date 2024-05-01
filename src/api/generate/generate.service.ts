import { randomUUID } from 'crypto';
import speakeasy, { GeneratedSecret } from 'speakeasy';
import QRCode from 'qrcode';
abstract class Generate {
  abstract generateTransactionId(): string;
  abstract generateSecret(name: string): GeneratedSecret;
}

class GenerateImpl extends Generate {
  generateTransactionId(): string {
    const transactionId = randomUUID();
    return transactionId;
  }

  generateSecret(name: string): GeneratedSecret {
    const secret: GeneratedSecret = speakeasy.generateSecret({ name });
    return secret;
  }

  async generateQRCode(url: string) {
    const qrcode = await QRCode.toDataURL(url);
    return qrcode;
  }
}

export const generateService = new GenerateImpl();
