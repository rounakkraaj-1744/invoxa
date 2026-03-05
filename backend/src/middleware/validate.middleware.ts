import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate = (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (e: any) {
        return res.status(400).send(e.errors);
    }
};
