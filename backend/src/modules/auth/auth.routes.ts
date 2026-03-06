import { Router } from 'express';
import { auth } from '../../lib/auth';
import { toNodeHandler } from 'better-auth/node';

const router = Router();

router.use(toNodeHandler(auth));

export default router;
