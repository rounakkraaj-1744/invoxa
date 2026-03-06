import { prisma } from '../../config/db';
import type { CreateBusinessInput, UpdateBusinessInput } from './business.schema';

export const createBusiness = async (userId: string, data: CreateBusinessInput) => {
    return await prisma.business.create({
        data: {
            ...data,
            userId,
        },
    });
};

export const getBusinessById = async (id: string, userId: string) => {
    return await prisma.business.findFirst({
        where: {
            id,
            userId,
        },
    });
};

export const getUserBusinesses = async (userId: string) => {
    return await prisma.business.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const updateBusiness = async (id: string, userId: string, data: UpdateBusinessInput) => {
    return await prisma.business.update({
        where: {
            id,
            userId,
        },
        data,
    });
};

export const deleteBusiness = async (id: string, userId: string) => {
    return await prisma.business.delete({
        where: {
            id,
            userId,
        },
    });
};
