import { Router } from 'express';
import * as clientsController from './clients.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { businessMiddleware } from '../../middleware/business.middleware';

const router = Router();

// All client routes require authentication and business scoping
router.use(authMiddleware, businessMiddleware);

router.post('/', clientsController.handleCreateClient);
router.get('/', clientsController.handleGetClients);
router.get('/:id', clientsController.handleGetClient);
router.put('/:id', clientsController.handleUpdateClient);
router.delete('/:id', clientsController.handleDeleteClient);

export default router;
