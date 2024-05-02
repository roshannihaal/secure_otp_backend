import { Router } from 'express';
import { generateRouter } from './generate';
import { verifyRouter } from './verify';
import { resendRouter } from './resend';

const router = Router();

router.use('/generate', generateRouter);
router.use('/verify', verifyRouter);
router.use('/resend', resendRouter);

export const apiRouter = router;
