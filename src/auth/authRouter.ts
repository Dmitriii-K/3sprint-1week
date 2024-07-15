import { Router } from "express";
import { AuthController } from "./authController";
import { getUserInformation } from "./getController";
import { authCheckValidation, inputCheckErrorsMiddleware, registrationEmail, validationCode, userRegistrationValidation } from "../middlewares/middlewareForAll";
import { bearerAuth, checkRefreshToken } from "../middlewares/middlewareForAll";

export const authRouter = Router();

authRouter.post("/login", authCheckValidation, inputCheckErrorsMiddleware, AuthController.authLoginUser);
authRouter.post("/refresh-token", checkRefreshToken, AuthController.authRefreshToken);
authRouter.post("/registration", userRegistrationValidation, inputCheckErrorsMiddleware, AuthController.authRegistration);
authRouter.post("/registration-confirmation", validationCode, inputCheckErrorsMiddleware, AuthController.authRegistrationConfirmation);
authRouter.post("/registration-email-resending", registrationEmail, inputCheckErrorsMiddleware, AuthController.authRegistrationEmailResending);
authRouter.post("/logout", checkRefreshToken, AuthController.authLogout);
authRouter.get("/me", bearerAuth, getUserInformation);
