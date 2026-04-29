import { Router } from "express";
import controller from "./review.controller.js";
import { authMiddleware, allowTo } from "../../middleware/auth.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as reviewValidation from "./review.validation.js";

const router = Router();

// =========================
// 📝 REVIEW ROUTES
// =========================

// Create review (authenticated user)
router.post(
  "/",
  authMiddleware,
  isValid(reviewValidation.createReviewSchema),
  controller.create
);

// Get all reviews for an experience (public)
router.get(
  "/experience/:experienceId",
  isValid(reviewValidation.experienceIdSchema, "params"),
  controller.getExperienceReviews
);

// Get review stats for an experience (public)
router.get(
  "/experience/:experienceId/stats",
  isValid(reviewValidation.experienceIdSchema, "params"),
  controller.getExperienceStats
);

// Get logged-in user's own reviews
router.get(
  "/my-reviews",
  authMiddleware,
  controller.getMyReviews
);

// Get all reviews (admin only)
router.get(
  "/",
  authMiddleware,
  allowTo("admin"),
  isValid(reviewValidation.reviewQuerySchema, "query"),
  controller.getAllReviews
);

// Update own review
router.patch(
  "/:reviewId",
  authMiddleware,
  isValid(reviewValidation.reviewIdSchema, "params"),
  isValid(reviewValidation.updateReviewBodySchema),
  controller.update
);

// Delete review (owner or admin)
router.delete(
  "/:reviewId",
  authMiddleware,
  isValid(reviewValidation.reviewIdSchema, "params"),
  controller.delete
);

export default router;

