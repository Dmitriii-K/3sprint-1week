import { Request, Response } from "express";
import {
  PostInputModel,
  PostViewModel,
} from "../input-output-types/posts-type";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { postCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";

export const updatePostController = async (
  req: Request<any, any, PostInputModel>,
  res: Response<PostViewModel | OutputErrorsType>
) => {
  try {
    const id = new ObjectId(req.params.id);
    const findPost = await postCollection.findOne({ _id: id });
    if (!findPost) {
      res.sendStatus(404);
    } else {
      const post = await postCollection.updateOne(
        { _id: id },
        {
          $set: {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
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