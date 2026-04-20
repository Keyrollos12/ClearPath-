import { Router } from "express";
import      experienceController from "./experience.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { allowTo } from "../../middleware/auth.middleware.js";

const router = Router();
//  PUBLIC ROUTES

//  Get all experiences (search + filter + pagination)
router.get("/", experienceController.getAll);

//  Get one experience
router.get("/:id", experienceController.getOne);


//  ADMIN ROUTES

// Create experience
router.post(
  "/",
  authMiddleware,
  allowTo("admin"),
  experienceController.create
);

// Update experience
router.patch(
  "/:id",
  authMiddleware,
  allowTo("admin"),
  experienceController.update
);

//  Delete experience
router.delete(
  "/:id",
  authMiddleware,
  allowTo("admin"),
  experienceController.delete
);

export default router;