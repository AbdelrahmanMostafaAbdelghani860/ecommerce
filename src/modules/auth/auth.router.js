import { Router } from "express";
import * as authController from "./controller/auth.js";
import * as validators from "./auth.validation.js";
import isValid from "../../middleware/validation.middleware.js";
const router = Router();
router.post(
  "/sign-Up",
  isValid(validators.signUpValidation),
  authController.signUp
);
//sending confirmation email to the user
router.get("/confirmEmail/:activationCode", authController.confirmEmail);
// Resending confirmation Email
router.get(
  "/newconfirmEmail/:activationCode",
  isValid(validators.confimValidation),
  authController.newConfirmationEmail
);
// Login
router.post(
  "/login",
  isValid(validators.loginValidation),
  authController.login
);
// send forgetCode
router.patch(
  "/forgetCode",
  isValid(validators.forgetCode),
  authController.forgetCode
);
router.patch(
  "/resetPassword",
  isValid(validators.resetPassword),
  authController.resetPassword
);
export default router;
