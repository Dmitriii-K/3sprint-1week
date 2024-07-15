import { Request, Response } from "express";
import {
  BlogInputModel,
  BlogViewModel,
} from "../input-output-types/blogs-type";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { blogCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";

export const updateBlogController = async (
  req: Request<any, any, BlogInputModel>,
  res: Response<BlogViewModel | OutputErrorsType>
) => {
  try {
    const id = new ObjectId(req.params.id);
    const findBlog = await blogCollection.findOne({ _id: id });
    if (!findBlog) {
      res.sendStatus(404);
    } else {
      const blog = await blogCollection.updateOne(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
          },
        }
      );
      res.sendStatus(204);
    }
    return;
  } catch (error) {
    console.log(error);
  }
};
