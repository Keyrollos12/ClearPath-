import { Router } from 'express';
const router = Router();

import * as userController from './user.controller.js';
import * as userValidation from './user.validation.js';
import { isValid } from '../../middleware/validation.middleware.js';

import { authMiddleware, allowTo } from '../../middleware/auth.middleware.js';


// ======================
// USER ROUTES
// ======================

// Get logged-in user profile
router.get(
  '/profile',
  authMiddleware,
  userController.getProfile
);

// Update profile
router.patch(
  '/update-profile',
  authMiddleware,
  isValid(userValidation.updateProfileSchema),
  userController.updateProfile
);

// Change password
router.patch(
  '/change-password',
  authMiddleware,
  isValid(userValidation.changePasswordSchema),
  userController.changePassword
);

// Delete own account
router.delete(
  '/delete-account',
  authMiddleware,
  userController.deleteMe
);


// ======================
// ADMIN ROUTES
// ======================

// Get all users (Admin only)
router.get(
  '/admin/all',
  authMiddleware,
  allowTo('Admin'),
  userController.getAllUsers
);

// Delete user by admin
router.delete(
  '/admin/delete/:userId',
  authMiddleware,
  allowTo('Admin'),
  isValid(userValidation.userIdSchema),
  userController.adminDeleteUser
);


export default router;