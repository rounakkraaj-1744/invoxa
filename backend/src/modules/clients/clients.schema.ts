import { z } from 'zod';

export const createClientSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    taxId: z.string().optional().nullable(),
});

export const updateClientSchema = createClientSchema.partial();

export const clientQuerySchema = z.object({
    search: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ClientQueryInput = z.infer<typeof clientQuerySchema>;
