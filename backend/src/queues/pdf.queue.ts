import { Queue } from 'bullmq';
import { env } from '../config/env';

export const pdfQueue = new Queue('pdf-generation', {
    connection: {
        host: new URL(env.REDIS_URL).hostname,
        port: Number(new URL(env.REDIS_URL).port),
        password: new URL(env.REDIS_URL).password,
    }
});
