import 'express-async-errors'
import app from './app'
import { env } from './config/env'

app.listen(env.PORT, () => {
    console.log(`🚀 Invoxa API running on port ${env.PORT}`)
})