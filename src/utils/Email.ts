import nodemailer from 'nodemailer';
import { config } from '../config';
import { secondsToMinutes } from './Common';
import { template } from '../templates';

const appName = config.APP_NAME;
const otpExpTime = config.OTP_EXP_TIME;
const EMAIL = {
  host: config.EMAIL_HOST,
  service: config.EMAIL_SERVICE,
  port: config.EMAIL_PORT,
  secure: config.EMAIL_SECURE,
  user: config.EMAIL_AUTH_USER,
  password: config.EMAIL_AUTH_PASSWORD,
};

const transporter = nodemailer.createTransport({
  host: EMAIL.host,
  service: EMAIL.service,
  port: EMAIL.port,
  secure: EMAIL.secure,
  auth: {
    user: EMAIL.user,
    pass: EMAIL.password,
  },
});

export const sendEmail = async (to: string, otp: string): Promise<void> => {
  try {
    const html = readAndAttachVariables(otp);
    await shipMail(to, html);
  } catch (error) {
    throw error;
  }
};

const readAndAttachVariables = (otp: string): string => {
  try {
    let html = template;
    const otpExpMintues = secondsToMinutes(otpExpTime).toString();
    html = html.replace(/{{OTP}}/, otp);
    html = html.replace(/{{TIME}}/, otpExpMintues);
    return html;
  } catch (error) {
    throw error;
  }
};

const shipMail = async (to: string, html: string): Promise<void> => {
  try {
    const mailOptions = {
      from: EMAIL.user,
      to,
      subject: appName,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
