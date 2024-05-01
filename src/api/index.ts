import { Router } from 'express';
import { generateRouter } from './generate';
import { verifyRouter } from './verify';

const router = Router();

router.use('/generate', generateRouter);
router.use('/verify', verifyRouter);

export const apiRouter = router;
