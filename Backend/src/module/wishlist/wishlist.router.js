import { Router } from 'express';
const router = Router();

import * as wishlistController from './wishlist.controller.js';
import * as wishlistValidation from './wishlist.validation.js';
import { isValid } from '../../middleware/validation.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

// Get user's wishlist
router.get('/', authMiddleware, wishlistController.getWishlist);

// Add to wishlist
router.post('/', authMiddleware, isValid(wishlistValidation.addToWishlistSchema), wishlistController.addToWishlist);

// Remove from wishlist
router.delete('/:experienceId', authMiddleware, isValid(wishlistValidation.experienceIdSchema, 'params'), wishlistController.removeFromWishlist);

export default router;