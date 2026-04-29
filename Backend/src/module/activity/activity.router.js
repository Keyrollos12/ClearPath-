import { Router } from "express";
import ActivityController from "./activity.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { allowTo, authMiddleware } from "../../middleware/auth.middleware.js";

import {
  createActivitySchema,
  updateActivitySchema,
  idSchema,
  activityQuerySchema,
} from "./activity.validation.js";

const router = Router();

/*
   Public Routes
*/
router.get("/", isValid(activityQuerySchema), ActivityController.getAll);

router.get("/:id", isValid(idSchema), ActivityController.getOne);

/*
   Admin Only
*/
router.post(
  "/",
  authMiddleware,
  allowTo("admin"),
  isValid(createActivitySchema),
  ActivityController.create
);

router.patch(
  "/:id",
  authMiddleware,
  allowTo("admin"),
  isValid(updateActivitySchema),
  ActivityController.update
);

router.delete(
  "/:id",
  authMiddleware,
  allowTo("admin"),
  isValid(idSchema),
  ActivityController.delete
);

export default router;