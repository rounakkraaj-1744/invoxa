// middleware/api-key.middleware.ts
import type { Request, Response, NextFunction } from 'express'
import { hashApiKey } from '../lib/apiKey'
import { prisma } from '../config/db'
import { redis } from '../config/redis'

export const apiKeyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing API key' })
    }

    const rawKey = authHeader.split(' ')[1]
    if (!rawKey) {
        return res.status(401).json({ error: 'Invalid API key format' })
    }
    const keyHash = hashApiKey(rawKey)

    // Check Redis cache first (avoid DB hit on every request)
    const cached = await redis.get(`apikey:${keyHash}`)

    if (cached) {
        req.businessId = cached  // attach to request
        return next()
    }

    // Cache miss — check DB
    const apiKey = await prisma.apiKey.findUnique({
        where: { keyHash }
    })

    if (!apiKey) {
        return res.status(401).json({ error: 'Invalid API key' })
    }

    // Cache for 5 minutes
    await redis.set(`apikey:${keyHash}`, apiKey.businessId, 'EX', 300)

    // Update last used (fire and forget, don't await)
    prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() }
    }).catch(() => { })

    req.businessId = apiKey.businessId
    next()
}