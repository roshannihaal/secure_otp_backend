import {
  AddAuthenticatorTransactionDTO,
  AddEmailTransactionDTO,
  addTransaction,
  constants,
  readTransaction,
} from '../../utils';
import speakeasy from 'speakeasy';
import { VerifyOtpResponseDTO } from './verify.dto';
abstract class Verify {
  abstract verifyOTP(
    type: string,
    transactionId: string,
    otp: string,
  ): Promise<VerifyOtpResponseDTO>;
}

class VerifyImpl extends Verify {
  async verifyOTP(type: string, transactionId: string, otp: string): Promise<VerifyOtpResponseDTO> {
    try {
      const details = await readTransaction(transactionId);

      if (!details || details.type !== type) {
        const response: VerifyOtpResponseDTO = {
          message: 'Invalid transactionId',
          verified: false,
          statusCode: 400,
        };
        return response;
      }
      if (type === constants.AUTHENTICATOR) {
        const auDetails = AddAuthenticatorTransactionDTO.parse(details);
        const status = speakeasy.totp.verify({
          secret: auDetails.base32,
          encoding: 'base32',
          token: otp,
        });
        const message = status ? 'OTP verified' : 'Invalid otp';
        const statusCode = status ? 200 : 400;
        const response = {
          message,
          verified: status,
          statusCode,
        };
        return response;
      } else if (type === constants.EMAIL) {
        const eDetails = AddEmailTransactionDTO.parse(details);
        const status = speakeasy.hotp.verify({
          secret: eDetails.base32,
          encoding: 'base32',
          token: otp,
          counter: eDetails.counter,
        });
        eDetails.counter += 1;
        await addTransaction(transactionId, eDetails);
        const message = status ? 'OTP verified' : 'Invalid otp';
        const statusCode = status ? 200 : 400;
        const response = {
          message,
          verified: status,
          statusCode,
        };
        return response;
      } else {
        const message = 'Feature not available';
        const response = {
          message,
          verified: false,
          statusCode: 400,
        };
        return response;
      }
    } catch (error) {
      throw error;
    }
  }
}

export const verifyService = new VerifyImpl();
