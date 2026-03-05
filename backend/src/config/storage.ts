import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env';

export const s3 = new S3Client({
    region: 'auto',
    endpoint: env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
        accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY,
        secretAccessKey: env.CLOUDFLARE_R2_SECRET_KEY,
    },
});
