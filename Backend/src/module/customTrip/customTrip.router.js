import { Router } from "express";
import controller from "./customTrip.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as customTripValidation from "./customTrip.validation.js";

const router = Router();


// =========================
// 🔐 USER ROUTES
// =========================

// Create Custom Trip from Experience
router.post(
  "/",
  authMiddleware,
  isValid(customTripValidation.createCustomTripSchema),
  controller.create
);

// Get all user trips
router.get(
  "/",
  authMiddleware,
  controller.getUserTrips
);

// Get one trip
router.get(
  "/:id",
  authMiddleware,
  isValid(customTripValidation.idSchema, 'params'),
  controller.getOne
);

// SMART VIEW (Experience OR CustomTrip)
router.get(
  "/view/:experienceId",
  authMiddleware,
  isValid(customTripValidation.experienceIdSchema, 'params'),
  controller.getFinalTrip
);

// =========================
//  MODIFY TRIP
// =========================

// Add activity to day
router.patch(
  "/:id/add-activity",
  authMiddleware,
  isValid(customTripValidation.idSchema, 'params'),
  isValid(customTripValidation.addActivitySchema),
  controller.addActivity
);

//Remove activity
router.patch(
  "/:id/remove-activity",
  authMiddleware,
  isValid(customTripValidation.idSchema, 'params'),
  isValid(customTripValidation.removeActivitySchema),
  controller.removeActivity
);

//  Remove day
router.patch(
  "/:id/remove-day",
  authMiddleware,
  isValid(customTripValidation.idSchema, 'params'),
  isValid(customTripValidation.removeDaySchema),
  controller.removeDay
);

// Add extra activity
router.patch(
  "/:id/add-extra",
  authMiddleware,
  isValid(customTripValidation.idSchema, 'params'),
  isValid(customTripValidation.addExtraSchema),
  controller.addExtraActivity
);

// Remove extra activity
router.patch(
  "/:id/remove-extra",
  authMiddleware,
  isValid(customTripValidation.idSchema, 'params'),
  isValid(customTripValidation.removeExtraSchema),
  controller.removeExtraActivity
);

export default router;