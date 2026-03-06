import type { Request, Response } from 'express';
import { invoicesService } from './invoices.service';
import { InvoiceStatus } from '../../generated/prisma';
import { pdfQueue } from '../../queues/pdf.queue';

export const invoicesController = {
    async create(req: Request, res: Response) {
        const businessId = req.businessId!;
        const invoice = await invoicesService.create(businessId, req.body);
        res.status(201).json(invoice);
    },

    async list(req: Request, res: Response) {
        const businessId = req.businessId!;
        const invoices = await invoicesService.list(businessId, req.query);
        res.json(invoices);
    },

    async getById(req: Request, res: Response) {
        const businessId = req.businessId!;
        const id = req.params.id as string;
        const invoice = await invoicesService.getById(id, businessId);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json(invoice);
    },

    async update(req: Request, res: Response) {
        const businessId = req.businessId!;
        const id = req.params.id as string;
        const invoice = await invoicesService.update(id, businessId, req.body);
        res.json(invoice);
    },

    async delete(req: Request, res: Response) {
        const businessId = req.businessId!;
        const id = req.params.id as string;
        await invoicesService.delete(id, businessId);
        res.status(204).send();
    },

    async markSent(req: Request, res: Response) {
        const businessId = req.businessId!;
        const id = req.params.id as string;
        const invoice = await invoicesService.updateStatus(id, businessId, InvoiceStatus.SENT);
        res.json(invoice);
    },

    async markPaid(req: Request, res: Response) {
        const businessId = req.businessId!;
        const id = req.params.id as string;
        const invoice = await invoicesService.updateStatus(id, businessId, InvoiceStatus.PAID);
        res.json(invoice);
    },

    async markCancelled(req: Request, res: Response) {
        const businessId = req.businessId!;
        const id = req.params.id as string;
        const invoice = await invoicesService.updateStatus(id, businessId, InvoiceStatus.CANCELLED);
        res.json(invoice);
    },

    async getPdfUrl(req: Request, res: Response) {
        const businessId = req.businessId!;
        const id = req.params.id as string;
        const invoice = await invoicesService.getById(id, businessId);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        if (!invoice.pdfUrl) {
            // Trigger generation if not exists
            await pdfQueue.add('pdf-generation', { invoiceId: id });
            return res.json({ message: 'PDF generation triggered. Please try again in 3-5 seconds.', url: null });
        }

        res.json({ url: invoice.pdfUrl });
    }
};
