import {
  AddAuthenticatorTransactionDTO,
  AddEmailTransactionDTO,
  addTransaction,
  constants,
  errors,
  incrementTransactionFields,
  readTransaction,
} from '../../utils';
import speakeasy from 'speakeasy';
abstract class Verify {
  abstract verify(type: string, transactionId: string, otp: string): Promise<boolean>;
}

class VerifyImpl extends Verify {
  async verify(type: string, transactionId: string, otp: string): Promise<boolean> {
    if (type === constants.AUTHENTICATOR) {
      const verified = await this.verifyTotp(transactionId, otp);
      return verified;
    } else if (type === constants.EMAIL) {
      const verified = await this.verifyHotp(transactionId, otp);
      return verified;
    }
    throw new Error(errors.INVALID_TYPE);
  }

  private async verifyTotp(transactionId: string, otp: string): Promise<boolean> {
    const res = await readTransaction(transactionId);

    if (!res || res.type !== constants.AUTHENTICATOR) {
      throw new Error(errors.INVALID_TRANSACTION_ID);
    }
    const data = AddAuthenticatorTransactionDTO.parse(res);
    const verified = speakeasy.totp.verify({
      secret: data.base32,
      encoding: 'base32',
      token: otp,
    });
    return verified;
  }

  private async verifyHotp(transactionId: string, otp: string): Promise<boolean> {
    const res = await readTransaction(transactionId);

    if (!res || res.type !== constants.EMAIL) {
      throw new Error(errors.INVALID_TRANSACTION_ID);
    }
    if (res.verified === true) {
      throw new Error(errors.TRANSACTION_ALREADY_PROCESSED);
    }
    if (!res.limit) {
      throw new Error(errors.MAXIMUM_LIMIT_EXCEEDED);
    }

    const data = AddEmailTransactionDTO.parse(res);
    const verified = speakeasy.hotp.verify({
      secret: data.base32,
      encoding: 'base32',
      token: otp,
      counter: data.counter,
    });
    if (verified) {
      data.verified = true;
      await addTransaction(transactionId, data);
    } else {
      await incrementTransactionFields(transactionId, 'limit', -1);
    }
    return verified;
  }
}

export const verifyService = new VerifyImpl();
