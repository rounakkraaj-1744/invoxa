import type { Request, Response } from 'express';
import * as clientsService from './clients.service';
import { createClientSchema, updateClientSchema, clientQuerySchema } from './clients.schema';

export const handleCreateClient = async (req: Request, res: Response) => {
    const businessId = req.businessId;
    if (!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
    }

    const result = createClientSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: result.error.flatten().fieldErrors,
        });
    }

    const client = await clientsService.createClient(businessId, result.data);
    res.status(201).json(client);
};

export const handleGetClients = async (req: Request, res: Response) => {
    const businessId = req.businessId;
    if (!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
    }

    const query = clientQuerySchema.safeParse(req.query);
    const search = query.success ? query.data.search : undefined;

    const clients = await clientsService.getClients(businessId, search);
    res.json(clients);
};

export const handleGetClient = async (req: Request, res: Response) => {
    const businessId = req.businessId;
    const { id } = req.params;

    if (!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
    }

    const client = await clientsService.getClientById(id as string, businessId);
    if (!client) {
        return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
};

export const handleUpdateClient = async (req: Request, res: Response) => {
    const businessId = req.businessId;
    const { id } = req.params;

    if (!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
    }

    const result = updateClientSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: result.error.flatten().fieldErrors,
        });
    }

    const client = await clientsService.updateClient(id as string, businessId, result.data);
    res.json(client);
};

export const handleDeleteClient = async (req: Request, res: Response) => {
    const businessId = req.businessId;
    const { id } = req.params;

    if (!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
    }

    await clientsService.deleteClient(id as string, businessId);
    res.status(204).send();
};
