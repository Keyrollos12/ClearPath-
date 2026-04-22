import AuthService from "./auth.service.js";

class AuthController {
  register = (req, res, next) => AuthService.register(req, res, next);
  verifyAccount = (req, res, next) => AuthService.verifyAccount(req, res, next);
  forgotPassword = (req, res, next) => AuthService.forgotPassword(req, res, next);
  resetPassword = (req, res, next) => AuthService.resetPassword(req, res, next);
  login = (req, res, next) => AuthService.login(req, res, next);
  loginWithGoogle = (req, res, next) => AuthService.loginWithGoogle(req, res, next);
  logout = (req, res, next) => AuthService.logout(req, res, next);
}

export default new AuthController();