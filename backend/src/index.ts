import 'express-async-errors'
import app from './app'
import { env } from './config/env'

const server = Bun.serve({
  port: env.PORT,
  fetch: app.fetch
})

console.log(`🚀 Invoxa API running on port ${env.PORT}`)