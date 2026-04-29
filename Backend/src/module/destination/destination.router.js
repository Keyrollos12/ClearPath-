import { Router } from 'express';
const router = Router();
import * as destController from './destination.controller.js';
import * as destValidation from './destination.validation.js';
import { isValid } from '../../middleware/validation.middleware.js';
import { authMiddleware, allowTo } from '../../middleware/auth.middleware.js';

// --- مسارات عامة (للـ Tourists) ---
router.get('/', destController.getDestinations);
router.get('/:destinationId', isValid(destValidation.destinationIdSchema, 'params'), destController.getOneDestination);

// --- مسارات الأدمن ---
router.post('/', 
    authMiddleware, 
    allowTo('admin'),
    isValid(destValidation.createDestinationSchema), 
    destController.addDestination
);

router.patch('/:destinationId', 
    authMiddleware,
    allowTo('admin'),
    isValid(destValidation.destinationIdSchema, 'params'), 
    isValid(destValidation.updateDestinationSchema), 
    destController.updateDestination
);

router.delete('/:destinationId', 
    authMiddleware,
    allowTo('admin'),
    isValid(destValidation.destinationIdSchema, 'params'), 
    destController.removeDestination
);

export default router;
