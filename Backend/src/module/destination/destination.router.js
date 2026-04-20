import { Router } from 'express';
const router = Router();
import * as destController from './destination.controller.js';
import * as destValidation from './destination.validation.js';
import { validation } from '../../../middleware/validation.js';
import { auth } from '../../../middleware/auth.middleware.js';

// --- مسارات عامة (للـ Tourists) ---
router.get('/', destController.getDestinations);
router.get('/:destinationId', validation(destValidation.getByIdSchema), destController.getOneDestination);
router.post('/', 
    auth(['Admin']), 
    validation(destValidation.destinationSchema), 
    destController.addDestination
);

router.patch('/:destinationId', 
    auth(['Admin']), 
    validation(destValidation.getByIdSchema), 
    validation(destValidation.destinationSchema), 
    destController.updateDestination
);

router.delete('/:destinationId', 
    auth(['Admin']), 
    validation(destValidation.getByIdSchema), 
    destController.removeDestination
);

export default router;