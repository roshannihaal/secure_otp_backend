import { constants, readTransaction } from '../../utils';
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
      const transactionDetails = await readTransaction(transactionId);

      if (!transactionDetails) {
        const response: VerifyOtpResponseDTO = {
          message: 'Invalid transactionId',
          verified: false,
          statusCode: 400,
        };
        return response;
      }
      if (type === constants.AUTHENTICATOR) {
        const status = speakeasy.totp.verify({
          secret: transactionDetails.base32,
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
