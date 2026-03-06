import type { Request, Response } from 'express';
import * as businessService from './business.service';
import { createBusinessSchema, updateBusinessSchema } from './business.schema';

export const handleCreateBusiness = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = createBusinessSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: result.error.flatten().fieldErrors
        });
    }

    const business = await businessService.createBusiness(userId, result.data);
    res.status(201).json(business);
};

export const handleGetBusiness = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const business = await businessService.getBusinessById(id as string, userId);
    if (!business) {
        return res.status(404).json({ message: 'Business not found' });
    }

    res.json(business);
};

export const handleGetMyBusinesses = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const businesses = await businessService.getUserBusinesses(userId);
    res.json(businesses);
};

export const handleUpdateBusiness = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = updateBusinessSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: result.error.flatten().fieldErrors
        });
    }

    const business = await businessService.updateBusiness(id as string, userId, result.data);
    res.json(business);
};

export const handleDeleteBusiness = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    await businessService.deleteBusiness(id as string, userId);
    res.status(204).send();
};
