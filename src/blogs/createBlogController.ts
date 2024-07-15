import { Request, Response } from "express";
import {
  BlogInputModel,
  BlogDbType,
} from "../input-output-types/blogs-type";
import { blogCollection } from "../db/mongo-db";

export const createBlogController = async (
  req: Request<any, any, BlogInputModel>,
  res: Response<any>
) => {
  try {
    const createDate = new Date().toISOString();
    const newBlog: BlogDbType = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
      createdAt: createDate,
      isMembership: false,
    };
    const newBlogBD = await blogCollection.insertOne(newBlog)!;
    if (newBlogBD) {
      const mapNewBlog = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
        createdAt: createDate,
        isMembership: false,
        id: newBlogBD.insertedId,
      };
      res.status(201).json(mapNewBlog);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.log(error);
  }
};
