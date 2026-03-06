import type { Request, Response, NextFunction } from 'express';

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
    next();
};
