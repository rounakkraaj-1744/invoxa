import { z } from 'zod';

export const createBusinessSchema = z.object({
    name: z.string().min(1, 'Business name is required').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    taxId: z.string().optional().nullable(),
    website: z.string().url('Invalid website URL').optional().nullable().or(z.literal('')),
    logoUrl: z.string().url('Invalid logo URL').optional().nullable().or(z.literal('')),
    currency: z.string().length(3).default('USD'),
    invoicePrefix: z.string().min(1).max(10).default('INV'),
});

export const updateBusinessSchema = createBusinessSchema.partial();

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
