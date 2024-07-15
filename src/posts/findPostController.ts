import { Request, Response } from "express";
import { postCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";
import { postsMap } from "./getPostsController";

export const findPostController = async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const post = await postCollection.findOne({ _id: id });
    if (post) {
      const findPost = postsMap(post);
      res.status(200).json(findPost);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
  }
};