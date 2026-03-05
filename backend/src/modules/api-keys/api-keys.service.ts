import { prisma } from "../../config/db"
import { generateApiKey, hashApiKey, getKeyPrefix } from "../../lib/apiKey"
export const createApiKey = async (businessId: string, name: string) => {
    const rawKey = generateApiKey()
    const keyHash = hashApiKey(rawKey)
    const keyPrefix = getKeyPrefix(rawKey)

    const apiKey = await prisma.apiKey.create({
        data: {
            businessId,
            name,
            keyHash,
            keyPrefix,
        }
    })

    return { ...apiKey, rawKey }
}

export const getApiKeys = async (businessId: string) => {
    return await prisma.apiKey.findMany({
        where: { businessId },
        select: {
            id: true,
            name: true,
            keyPrefix: true,
            lastUsedAt: true,
            createdAt: true,
        }
    })
}

export const revokeApiKey = async (id: string, businessId: string) => {
    return await prisma.apiKey.delete({
        where: { id, businessId }
    })
}