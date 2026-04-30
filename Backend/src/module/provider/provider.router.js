import { Router } from "express";
import * as providerController from "./provider.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { authMiddleware, allowTo } from "../../middleware/auth.middleware.js";
import * as providerValidation from "./provider.validation.js";

const router = Router();

// Public routes
router.get(
  "/",
  authMiddleware,
  allowTo("admin"),
  isValid(providerValidation.providerQuerySchema),
  providerController.getAllProviders
);
router.get("/:id", authMiddleware, allowTo("admin"), isValid(providerValidation.idSchema, 'params'), providerController.getProvider);

// Admin only routes
router.post("/", authMiddleware, allowTo("admin"), isValid(providerValidation.createProviderSchema), providerController.createProvider);
router.patch("/:id", authMiddleware, allowTo("admin"), isValid(providerValidation.updateProviderSchema), isValid(providerValidation.idSchema, 'params'), providerController.updateProvider);
router.delete("/:id", authMiddleware, allowTo("admin"), isValid(providerValidation.idSchema, 'params'), providerController.deleteProvider);

export default router;