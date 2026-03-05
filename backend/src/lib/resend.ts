import { Resend } from 'resend';
import { env } from '../config/env';
import { emailQueue } from '../queues/email.queue';

export const resend = new Resend(env.RESEND_API_KEY);

export interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
    text?: string;
}

export const sendEmail = async (options: SendEmailOptions) => {
    return await emailQueue.add('send-email', {
        ...options,
        from: options.from || 'Invoxa <notifications@resend.dev>', // Default from
    });
};
