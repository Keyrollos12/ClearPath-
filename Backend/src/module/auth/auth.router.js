import { Router } from "express";
import AuthController from "./auth.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
import * as authValidation from "./auth.validation.js"; 

const router = Router();

router.post("/register", isValid(authValidation.registerSchema), AuthController.register);
router.post("/login", isValid(authValidation.loginSchema), AuthController.login);
router.post("/google", isValid(authValidation.googleLoginSchema), AuthController.loginWithGoogle);
router.post("/verify", isValid(authValidation.verifySchema), AuthController.verifyAccount);

export default router;
