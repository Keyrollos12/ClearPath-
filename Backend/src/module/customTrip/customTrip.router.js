import { Router } from "express";
import controller from "./customTrip.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();


// =========================
// 🔐 USER ROUTES
// =========================

// Create Custom Trip from Experience
router.post(
  "/",
  authMiddleware,
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
  controller.getOne
);

// SMART VIEW (Experience OR CustomTrip)
router.get(
  "/view/:experienceId",
  authMiddleware,
  controller.getFinalTrip
);

// =========================
//  MODIFY TRIP
// =========================

// Add activity to day
router.patch(
  "/:id/add-activity",
  authMiddleware,
  controller.addActivity
);

//Remove activity
router.patch(
  "/:id/remove-activity",
  authMiddleware,
  controller.removeActivity
);

//  Remove day
router.patch(
  "/:id/remove-day",
  authMiddleware,
  controller.removeDay
);

// Add extra activity
router.patch(
  "/:id/add-extra",
  authMiddleware,
  controller.addExtraActivity
);

// Remove extra activity
router.patch(
  "/:id/remove-extra",
  authMiddleware,
  controller.removeExtraActivity
);

export default router;