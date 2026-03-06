import { z } from 'zod';

export const invoiceItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().int().positive('Quantity must be at least 1'),
    unitPrice: z.number().nonnegative('Unit price must be positive'),
    taxPercent: z.number().min(0).max(100).optional(),
});

export const createInvoiceSchema = z.object({
    body: z.object({
        clientId: z.string().uuid('Invalid client ID'),
        dueDate: z.string().datetime(),
        currency: z.string().default('USD'),
        subtotal: z.number().nonnegative(),
        taxAmount: z.number().nonnegative().optional(),
        discount: z.number().nonnegative().optional(),
        total: z.number().nonnegative(),
        notes: z.string().optional(),
        terms: z.string().optional(),
        items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
    }),
});

export const updateInvoiceSchema = z.object({
    body: z.object({
        clientId: z.string().uuid().optional(),
        dueDate: z.string().datetime().optional(),
        currency: z.string().optional(),
        subtotal: z.number().nonnegative().optional(),
        taxAmount: z.number().nonnegative().optional(),
        discount: z.number().nonnegative().optional(),
        total: z.number().nonnegative().optional(),
        notes: z.string().optional(),
        terms: z.string().optional(),
        items: z.array(invoiceItemSchema).min(1).optional(),
    }),
});

export const listInvoicesSchema = z.object({
    query: z.object({
        status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
        clientId: z.string().uuid().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
    }),
});
