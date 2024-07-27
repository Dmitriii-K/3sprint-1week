import { Router } from "express";
import { PostController } from "./postsController";
import { commentsValidation } from "../middlewares/middlewareForAll";
import {
  postInputValidation,
  inputCheckErrorsMiddleware,
  authMiddleware,
  bearerAuth,
} from "../middlewares/middlewareForAll";

export const postRouter = Router();

postRouter.get("/", PostController.getPosts);
postRouter.post(
  "/",
  authMiddleware,
  postInputValidation,
  inputCheckErrorsMiddleware,
  PostController.createPost
);
postRouter.get("/:id", PostController.getPostById);
postRouter.put(
  "/:id",
  authMiddleware,
  postInputValidation,
  inputCheckErrorsMiddleware,
  PostController.updatePost
);
postRouter.post("/:id/comments", bearerAuth, commentsValidation, inputCheckErrorsMiddleware, PostController.createCommentByPostId);
postRouter.get("/:id/comments", PostController.getCommentByPost)
postRouter.delete("/:id", authMiddleware, PostController.deletePost);
