import { Request, Response } from "express";
import { blogCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";
import { blogsMap } from "./getBlogsController";

export const findBlogController = async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const blog = await blogCollection.findOne({ _id: id });
    if (blog) {
      const findBlog = blogsMap(blog);
      res.status(200).json(findBlog);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
  }
};