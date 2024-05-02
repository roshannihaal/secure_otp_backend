import QRCode from 'qrcode';
import { config } from '../config';
import speakeasy, { GeneratedSecret } from 'speakeasy';
const appName = config.APP_NAME;

export const generateQRCode = async (url: string): Promise<string> => {
  const qrcode = await QRCode.toDataURL(url);
  return qrcode;
};

export const generateSecret = (transactionId: string): GeneratedSecret => {
  const name = `${transactionId}@${appName}`;
  const secret: GeneratedSecret = speakeasy.generateSecret({ name });
  return secret;
};
