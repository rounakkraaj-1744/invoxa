import { startPdfWorker } from './pdf.worker';
import { startEmailWorker } from './email.worker';
import { startRecurringWorker } from './recurring.worker';
import { startWebhookDeliveryWorker } from './webhook-delivery.worker';

export const startAllWorkers = () => {
    startPdfWorker();
    startEmailWorker();
    startRecurringWorker();
    startWebhookDeliveryWorker();
};

if (require.main === module) {
    startAllWorkers();
}
