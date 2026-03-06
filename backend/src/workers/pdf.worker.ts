import { Worker } from 'bullmq';
import { prisma } from '../config/db';
import handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import cloudinary from '../config/cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to format date
handlebars.registerHelper('formatDate', (date: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

export const startPdfWorker = () => {
    console.log('🚀 PDF Generation Worker started');

    const worker = new Worker('pdf-generation', async (job) => {
        const { invoiceId } = job.data;
        console.log(`📄 Generating PDF for invoice: ${invoiceId}`);

        try {
            // 1. Fetch data
            const invoice = await prisma.invoice.findUnique({
                where: { id: invoiceId },
                include: {
                    items: true,
                    client: true,
                    business: true
                }
            });

            if (!invoice) {
                throw new Error(`Invoice ${invoiceId} not found`);
            }

            // 2. Load template
            const templatePath = path.resolve(__dirname, '../templates/invoice.hbs');
            const templateSource = fs.readFileSync(templatePath, 'utf-8');
            const template = handlebars.compile(templateSource);

            // 3. Prepare data for template
            const html = template({
                invoice: {
                    ...invoice,
                    createdAt: new Date(invoice.createdAt).toLocaleDateString(),
                    dueDate: new Date(invoice.dueDate).toLocaleDateString(),
                },
                business: invoice.business,
                client: invoice.client
            });

            // 4. Generate PDF with Puppeteer
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: 'new' as any
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
            });

            await browser.close();

            // 5. Upload to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'invoices',
                        public_id: `invoice_${invoice.number}`,
                        resource_type: 'raw',
                        format: 'pdf',
                        access_mode: 'public'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(pdfBuffer);
            });

            const pdfUrl = (uploadResult as any).secure_url;

            // 6. Update database
            await prisma.invoice.update({
                where: { id: invoiceId },
                data: { pdfUrl }
            });

            console.log(`✅ PDF generated and uploaded: ${pdfUrl}`);
            return { pdfUrl };

        } catch (error) {
            console.error(`❌ PDF Generation failed for ${invoiceId}:`, error);
            throw error;
        }
    }, {
        connection: {
            host: new URL(env.REDIS_URL).hostname,
            port: Number(new URL(env.REDIS_URL).port),
            password: new URL(env.REDIS_URL).password,
        }
    });

    worker.on('failed', (job, err) => {
        console.error(`❌ Job failed: ${job?.id}`, err);
    });

    return worker;
};
