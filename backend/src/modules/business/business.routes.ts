import { Router } from 'express';
import * as businessController from './business.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Apply authMiddleware to all business routes
router.use(authMiddleware);

router.post('/', businessController.handleCreateBusiness);
router.get('/', businessController.handleGetMyBusinesses);
router.get('/:id', businessController.handleGetBusiness);
router.put('/:id', businessController.handleUpdateBusiness);
router.delete('/:id', businessController.handleDeleteBusiness);

export default router;
