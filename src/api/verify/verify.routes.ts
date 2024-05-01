import { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { VerifyOtpDTO } from './verify.dto';
import * as controller from './verify.controller';

const router = Router();

router.post('/otp', validateRequest({ body: VerifyOtpDTO }), controller.verifyOTP);

export const verifyRouter = router;
