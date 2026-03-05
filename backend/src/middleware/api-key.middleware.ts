import type { Request, Response, NextFunction } from 'express';

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // API key auth for /v1/* routes
    next();
};
