import { Router } from "express";
import { getUserController } from "./getUserController";
import { createUserController } from "./createUserController";
import { deleteUserController } from "./deleteUserController";
import {
  userInputValidation,
  inputCheckErrorsMiddleware,
} from "../middlewares/middlewareForAll";
import { authMiddleware } from "../middlewares/middlewareForAll";

export const usersRouter = Router();

usersRouter.get("/", authMiddleware, getUserController);
usersRouter.post(
  "/",
  authMiddleware,
  userInputValidation,
  inputCheckErrorsMiddleware,
  createUserController
);
usersRouter.delete("/:id", authMiddleware, deleteUserController);