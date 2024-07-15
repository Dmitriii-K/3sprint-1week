import { Router } from "express";
import { getPostsController } from "./getPostsController";
import { createPostController } from "./createPostController";
import { findPostController } from "./findPostController";
import { updatePostController } from "./updatePostController";
import { deletePostController } from "./deletePostController";
import { createCommentByPostId } from "./createCommentByPostId";
import { getCommentByPostId } from "./getCommentByPostId";
import { commentsValidation } from "../middlewares/middlewareForAll";
import {
  postInputValidation,
  inputCheckErrorsMiddleware,
  authMiddleware,
  bearerAuth,
} from "../middlewares/middlewareForAll";

export const postRouter = Router();

postRouter.get("/", getPostsController);
postRouter.post(
  "/",
  authMiddleware,
  postInputValidation,
  inputCheckErrorsMiddleware,
  createPostController
);
postRouter.get("/:id", findPostController);
postRouter.put(
  "/:id",
  authMiddleware,
  postInputValidation,
  inputCheckErrorsMiddleware,
  updatePostController
);
postRouter.post("/:id/comments", bearerAuth, commentsValidation, inputCheckErrorsMiddleware, createCommentByPostId);
postRouter.get("/:id/comments", getCommentByPostId)
postRouter.delete("/:id", authMiddleware, deletePostController);
