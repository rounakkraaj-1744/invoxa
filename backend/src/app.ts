import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorMiddleware } from './middleware/error.middleware'

// Route imports
import authRoutes from './modules/auth/auth.routes'
import invoiceRoutes from './modules/invoices/invoices.routes'
import clientRoutes from './modules/clients/clients.routes'
import paymentRoutes from './modules/payments/payments.routes'
import apiKeyRoutes from './modules/api-keys/api-keys.routes'
import analyticsRoutes from './modules/analytics/analytics.routes'
import webhookRoutes from './modules/webhooks/webhooks.routes'

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/v1/invoices', invoiceRoutes)
app.use('/v1/clients', clientRoutes)
app.use('/v1/payments', paymentRoutes)
app.use('/v1/api-keys', apiKeyRoutes)
app.use('/v1/analytics', analyticsRoutes)
app.use('/webhooks', webhookRoutes)

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', runtime: 'bun' }))

// Central error handler (must be last)
app.use(errorMiddleware)

export default app