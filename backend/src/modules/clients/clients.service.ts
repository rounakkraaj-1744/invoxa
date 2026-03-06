import { prisma } from '../../config/db';
import type { CreateClientInput, UpdateClientInput } from './clients.schema';

export const createClient = async (businessId: string, data: CreateClientInput) => {
    return await prisma.client.create({
        data: {
            ...data,
            businessId,
        },
    });
};

export const getClients = async (businessId: string, search?: string) => {
    return await prisma.client.findMany({
        where: {
            businessId,
            ...(search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { company: { contains: search, mode: 'insensitive' } },
                ],
            } : {}),
        },
        orderBy: {
            name: 'asc',
        },
    });
};

export const getClientById = async (id: string, businessId: string) => {
    return await prisma.client.findFirst({
        where: {
            id,
            businessId,
        },
    });
};

export const updateClient = async (id: string, businessId: string, data: UpdateClientInput) => {
    return await prisma.client.update({
        where: {
            id,
            businessId,
        },
        data,
    });
};

export const deleteClient = async (id: string, businessId: string) => {
    return await prisma.client.delete({
        where: {
            id,
            businessId,
        },
    });
};
