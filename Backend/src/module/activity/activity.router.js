import { Router } from "express";
import ActivityController from "./activity.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { allowTo } from "../../middleware/auth.middleware.js";

import {
  createActivitySchema,
  updateActivitySchema,
  idSchema,
  activityQuerySchema,
} from "./activity.validation.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

/*
   Public Routes (أي حد)
*/
router.get(
  "/",
  isValid(activityQuerySchema),
  ActivityController.getAll
);

router.get(
  "/:id",
  isValid(idSchema),
  ActivityController.getOne
);

/*
   Admin Only Routes
*/

//  Create Activity
router.post(
  "/",
  authMiddleware,
  allowTo("admin"),
  isValid(createActivitySchema),
  ActivityController.create
);

//  Update Activity
router.patch(
  "/:id/update",
  authMiddleware,
  allowTo("admin"),
  isValid(updateActivitySchema),
  ActivityController.update
);


router.delete(
  "/:id/delete",
  authMiddleware,
  allowTo("admin"),
  isValid(idSchema),
  ActivityController.delete
);

export default router;