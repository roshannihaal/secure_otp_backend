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

export const secondsToMinutes = (seconds: number): number => {
  const minutes = Math.floor(seconds / 60);
  return minutes;
};

export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  // Masking Domain
  const [service, tld] = domain.split('.');
  const maskedDomain = `${''.padStart(service.length, '*')}.${tld}`;

  // Masking Local
  const unmaskedLocalLength = Math.ceil(local.length / 2);
  const maskedLocal = `${local.charAt(0)}${local
    .slice(unmaskedLocalLength)
    .padStart(local.length - 1, '*')}`;
  const maskedEmail = `${maskedLocal}@${maskedDomain}`;
  return maskedEmail;
};
