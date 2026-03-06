import { Router } from 'express';
import { invoicesController } from './invoices.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { businessMiddleware } from '../../middleware/business.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createInvoiceSchema, updateInvoiceSchema, listInvoicesSchema } from './invoices.schema';

const router = Router();

// Apply auth and business middleware to all invoice routes
router.use(authMiddleware, businessMiddleware);

router.post('/', validate(createInvoiceSchema), invoicesController.create);
router.get('/', validate(listInvoicesSchema), invoicesController.list);
router.get('/:id', invoicesController.getById);
router.put('/:id', validate(updateInvoiceSchema), invoicesController.update);
router.delete('/:id', invoicesController.delete);

// Invoice Actions
router.post('/:id/send', invoicesController.markSent);
router.post('/:id/paid', invoicesController.markPaid);
router.post('/:id/cancel', invoicesController.markCancelled);
router.get('/:id/pdf', invoicesController.getPdfUrl);

export default router;
