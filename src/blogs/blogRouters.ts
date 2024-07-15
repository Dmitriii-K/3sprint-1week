import { Router } from "express";
import { getBlogsController } from "./getBlogsController";
import { getPostForBlogController } from "./getPostForBlogController";
import { createBlogController } from "./createBlogController";
import { createPostForBlogController } from "./createPostForBlogController";
import { findBlogController } from "./findBlogController";
import { updateBlogController } from "./updateBlogController";
import { deleteBlogController } from "./deleteBlogController";
import {
  authMiddleware,
  blogInputValidation,
  blogPostValidation,
  inputCheckErrorsMiddleware,
} from "../middlewares/middlewareForAll";

export const blogRouter = Router();

blogRouter.get("/", getBlogsController);
blogRouter.get("/:id/posts", getPostForBlogController);
blogRouter.post(
  "/",
  authMiddleware,
  blogInputValidation,
  inputCheckErrorsMiddleware,
  createBlogController
);
blogRouter.post(
  "/:id/posts",
  authMiddleware,
  blogPostValidation,
  inputCheckErrorsMiddleware,
  createPostForBlogController
);
blogRouter.get("/:id", findBlogController);
blogRouter.put(
  "/:id",
  authMiddleware,
  blogInputValidation,
  inputCheckErrorsMiddleware,
  updateBlogController
);
blogRouter.delete("/:id", authMiddleware, deleteBlogController);
