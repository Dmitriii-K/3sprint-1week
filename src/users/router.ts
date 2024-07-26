import { Router } from "express";
import { UserController } from "./userController";
import {
  userInputValidation,
  inputCheckErrorsMiddleware,
} from "../middlewares/middlewareForAll";
import { authMiddleware } from "../middlewares/middlewareForAll";

export const usersRouter = Router();

usersRouter.get("/", authMiddleware, UserController.getUser);
usersRouter.post(
  "/",
  authMiddleware,
  userInputValidation,
  inputCheckErrorsMiddleware,
  UserController.createUser
);
usersRouter.delete("/:id", authMiddleware, UserController.deleteUser);