import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export const businessMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const businessId = req.headers['x-business-id'];
    const userId = req.user?.id;

    if (!businessId || typeof businessId !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid x-business-id header' });
    }

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify ownership
    const business = await prisma.business.findFirst({
        where: {
            id: businessId,
            userId: userId,
        },
    });

    if (!business) {
        return res.status(403).json({ error: 'Forbidden: You do not have access to this business' });
    }

    req.businessId = businessId;
    next();
};
