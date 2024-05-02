import { Router } from 'express';
import * as controller from './resend.controller';
import { validateRequest } from '../../middlewares';
import { ResendOtpDTO } from './resend.dto';
const router = Router();

router.post('/otp', validateRequest({ body: ResendOtpDTO }), controller.ResendOtp);

export const resendRouter = router;
