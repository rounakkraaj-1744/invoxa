import { Worker } from 'bullmq';
import { env } from '../config/env';
import { resend } from '../lib/resend';
import { logger } from '../lib/logger';

export const startEmailWorker = () => {
    console.log('Starting Email worker...');

    const worker = new Worker('email-delivery', async (job) => {
        const { to, subject, html, from, text } = job.data;

        try {
            const { data, error } = await resend.emails.send({
                from: from || 'Invoxa <onboarding@resend.dev>',
                to,
                subject,
                html,
                text,
            });

            if (error) {
                logger.error({ error, jobId: job.id }, 'Failed to send email via Resend');
                throw error;
            }

            return data;
        } catch (err) {
            logger.error({ err, jobId: job.id }, 'Email worker error');
            throw err;
        }
    }, {
        connection: {
            host: new URL(env.REDIS_URL).hostname,
            port: Number(new URL(env.REDIS_URL).port),
            password: new URL(env.REDIS_URL).password,
        }
    });

    worker.on('completed', (job) => {
        logger.info({ jobId: job.id }, 'Email sent successfully');
    });

    worker.on('failed', (job, err) => {
        logger.error({ jobId: job?.id, err }, 'Email job failed');
    });

    return worker;
};
