import { Router } from 'express';
import { generateRouter } from './generate';

const router = Router();

router.use('/generate', generateRouter);

export const apiRouter = router;
