import { Router } from "express";
import      experienceController from "./experience.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { allowTo } from "../../middleware/auth.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as experienceValidation from "./experience.validation.js";

const router = Router();
//  PUBLIC ROUTES

//  Get all experiences (search + filter + pagination)
router.get("/", isValid(experienceValidation.experienceQuerySchema), experienceController.getAll);

//  Get one experience
router.get("/:id", isValid(experienceValidation.idSchema, 'params'), experienceController.getOne);


//  ADMIN ROUTES

// Create experience
router.post(
  "/",
  authMiddleware,
  allowTo("admin"),
  isValid(experienceValidation.createExperienceSchema),
  experienceController.create
);

// Update experience
router.patch(
  "/:id",
  authMiddleware,
  allowTo("admin"),
  isValid(experienceValidation.updateExperienceSchema),
  isValid(experienceValidation.idSchema, 'params'),
  experienceController.update
);

//  Delete experience
router.delete(
  "/:id",
  authMiddleware,
  allowTo("admin"),
  isValid(experienceValidation.idSchema, 'params'),
  experienceController.delete
);

export default router;