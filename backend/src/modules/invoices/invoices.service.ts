import { prisma } from '../../config/db';
import { InvoiceStatus, Prisma } from '../../generated/prisma';
import { pdfQueue } from '../../queues/pdf.queue';

export const generateInvoiceNumber = async (businessId: string) => {
    const business = await prisma.business.findUnique({
        where: { id: businessId },
        select: { invoicePrefix: true }
    });

    const count = await prisma.invoice.count({
        where: { businessId }
    });

    const number = String(count + 1).padStart(3, '0');
    return `${business?.invoicePrefix || 'INV'}-${number}`;
};

export const invoicesService = {
    async create(businessId: string, data: any) {
        const { items, ...invoiceData } = data;
        const number = await generateInvoiceNumber(businessId);

        const invoice = await prisma.invoice.create({
            data: {
                ...invoiceData,
                businessId,
                number,
                items: {
                    create: items.map((item: any) => ({
                        ...item,
                        amount: item.quantity * item.unitPrice,
                    })),
                },
            },
            include: { items: true, client: true },
        });

        // Queue PDF generation
        await pdfQueue.add('pdf-generation', { invoiceId: invoice.id });

        return invoice;
    },

    async list(businessId: string, filters: any = {}) {
        const { status, clientId, startDate, endDate } = filters;
        const where: Prisma.InvoiceWhereInput = { businessId };

        if (status) where.status = status;
        if (clientId) where.clientId = clientId;
        if (startDate || endDate) {
            where.createdAt = {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined,
            };
        }

        return prisma.invoice.findMany({
            where,
            include: { client: true },
            orderBy: { createdAt: 'desc' },
        });
    },

    async getById(id: string, businessId: string) {
        return prisma.invoice.findFirst({
            where: { id, businessId },
            include: { items: true, client: true, payments: true },
        });
    },

    async update(id: string, businessId: string, data: any) {
        const { items, ...invoiceData } = data;

        // If items are provided, we should probably replace them or update them.
        // For simplicity, let's replace them if they are in the update body.
        return prisma.$transaction(async (tx) => {
            if (items) {
                await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
            }

            return tx.invoice.update({
                where: { id, businessId },
                data: {
                    ...invoiceData,
                    items: items ? {
                        create: items.map((item: any) => ({
                            ...item,
                            amount: item.quantity * item.unitPrice,
                        })),
                    } : undefined,
                },
                include: { items: true, client: true },
            });
        });
    },

    async delete(id: string, businessId: string) {
        return prisma.invoice.delete({
            where: { id, businessId },
        });
    },

    async updateStatus(id: string, businessId: string, status: InvoiceStatus) {
        const data: any = { status };
        if (status === InvoiceStatus.SENT) data.sentAt = new Date();
        if (status === InvoiceStatus.PAID) data.paidAt = new Date();

        return prisma.invoice.update({
            where: { id, businessId },
            data,
        });
    },
};
