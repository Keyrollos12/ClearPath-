import { Router } from "express";
import AuthService from "src/module/auth/auth.service.js";
import { isValid } from "src/middleware/validation.middleware.js";
import { authMiddleware } from "src/middleware/auth.middleware.js";
import * as authValidation from "src/module/auth/auth.validation.js";

const router = Router();

router.post("/register", isValid(authValidation.registerSchema), AuthService.register);
router.post("/login", isValid(authValidation.loginSchema), AuthService.login);
router.post("/google", isValid(authValidation.googleLoginSchema), AuthService.loginWithGoogle);
router.post("/verify", isValid(authValidation.verifySchema), AuthService.verifyAccount);

export default router;
