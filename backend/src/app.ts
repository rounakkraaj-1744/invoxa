import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorMiddleware } from './middleware/error.middleware'

// Route imports
import invoiceRoutes from './modules/invoices/invoices.routes'
import clientRoutes from './modules/clients/clients.routes'
import paymentRoutes from './modules/payments/payments.routes'
import apiKeyRoutes from './modules/api-keys/api-keys.routes'
import analyticsRoutes from './modules/analytics/analytics.routes'
import businessRoutes from './modules/business/business.routes'
import webhookRoutes from './modules/webhooks/webhooks.routes'

import { auth } from './lib/auth'
import { toNodeHandler } from 'better-auth/node'

const app = express()

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))
app.use(morgan('dev'))

// Better Auth handler — MUST come before express.json() and helmet()
// so it can read the raw body and set its own headers
app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(helmet())
app.use(express.json())
app.use('/v1/invoices', invoiceRoutes)
app.use('/v1/clients', clientRoutes)
app.use('/v1/payments', paymentRoutes)
app.use('/v1/api-keys', apiKeyRoutes)
app.use('/v1/analytics', analyticsRoutes)
app.use('/v1/business', businessRoutes)
app.use('/webhooks', webhookRoutes)

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', runtime: 'bun' }))

// Central error handler (must be last)
app.use(errorMiddleware)

export default app