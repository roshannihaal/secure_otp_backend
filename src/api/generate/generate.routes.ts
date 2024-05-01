import { Router } from 'express';
import * as controller from './generate.controller';
import { validateRequest } from '../../middlewares';
import { GenerateOtpDTO } from './generate.dto';

const router = Router();

router.post('/otp', validateRequest({ body: GenerateOtpDTO }), controller.generateOtp);

export const generateRouter = router;
