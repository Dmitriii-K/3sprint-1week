import express from "express";
import { SETTINGS } from "./settings";
import { deleteRouter } from "./deleteAllData";
import { blogRouter } from "./blogs/blogRouters";
import { postRouter } from "./posts/postsRouters";
import { authRouter } from "./auth/authRouter";
import { usersRouter } from "./users/usersRouter";
import { commentsRouters } from "./comments/routers";
import cookieParser from "cookie-parser";

export const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(SETTINGS.PATH.BLOGS, blogRouter);
app.use(SETTINGS.PATH.POSTS, postRouter);
app.use(SETTINGS.PATH.TESTING, deleteRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.USERS, usersRouter);
app.use(SETTINGS.PATH.COMMENTS, commentsRouters);