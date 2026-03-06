import { Worker } from 'bullmq';
import axios from 'axios';
import { env } from '../config/env';
import { prisma } from '../config/db';
import { logger } from '../lib/logger';

export const startWebhookDeliveryWorker = () => {
    console.log('Starting Webhook Delivery worker...');

    const worker = new Worker('webhook-delivery', async (job) => {
        const { webhookId, payload, attempt = 0 } = job.data;

        const webhook = await prisma.webhook.findUnique({
            where: { id: webhookId },
            include: { business: true }
        });

        if (!webhook) {
            logger.warn({ webhookId, jobId: job.id }, 'Webhook not found for delivery');
            return;
        }

        try {
            const response = await axios.post(webhook.url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Invoxa-Signature': await generateSignature(webhook.secret, JSON.stringify(payload)),
                    'X-Invoxa-Event': payload.event,
                    'X-Invoxa-Timestamp': payload.created_at,
                    'X-Invoxa-Id': payload.id,
                },
                timeout: 10000, // 10 second timeout
            });

            await prisma.webhook.create({
                data: {
                    webhookId,
                    payload,
                    status: 'success',
                    statusCode: response.status,
                    responseBody: response.data,
                    attempt,
                },
            });

            logger.info({ webhookId, attempt, status: 'success' }, 'Webhook delivered successfully');

        } catch (error: any) {
            const statusCode = error.response?.status || 500;
            const responseBody = error.response?.data || error.message;

            await prisma.webhookDelivery.create({
                data: {
                    webhookId,
                    payload,
                    status: 'failed',
                    statusCode,
                    responseBody,
                    attempt,
                },
            });

            logger.error({ webhookId, attempt, statusCode, error: responseBody }, 'Webhook delivery failed');

            // Retry logic: retry 3 times with exponential backoff
            if (attempt < 3) {
                const delay = Math.min(1000 * Math.pow(2, attempt), 60000); // 1s, 2s, 4s, ..., 60s
                await job.queue.add('webhook-delivery', job.data, {
                    delay,
                    jobId: job.id,
                });
            }
        }
    }, {
        connection: {
            host: new URL(env.REDIS_URL).hostname,
            port: Number(new URL(env.REDIS_URL).port),
            password: new URL(env.REDIS_URL).password,
        },
        concurrency: 5,
    });

    worker.on('completed', (job) => {
        logger.info({ jobId: job.id }, 'Webhook delivery job completed');
    });

    worker.on('failed', (job, err) => {
        logger.error({ jobId: job?.id, err }, 'Webhook delivery job failed');
    });

    return worker;
};

// Simple HMAC-SHA256 signature generator
async function generateSignature(secret: string, payload: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const data = encoder.encode(payload);

    const signature = await crypto.subtle.sign('HMAC', key, data);
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
