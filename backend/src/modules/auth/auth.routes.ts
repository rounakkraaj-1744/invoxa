import { Router } from 'express';
import { auth } from '../../lib/auth';
import { toNodeHandler } from 'better-auth/node';

const router = Router();

router.use(async (req, res) => {
    try {
        return await toNodeHandler(auth)(req, res);
    } catch (error) {
        console.error('[BetterAuth Error]:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : String(error)
        });
    }
});

export default router;
