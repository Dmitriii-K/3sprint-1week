import { Request, Response } from "express";
import { postCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";

export const deletePostController = async (
  req: Request,
  res: Response<any>
) => {
  try {
    const id = new ObjectId(req.params.id);
    const deletePost = await postCollection.deleteOne({ _id: id });
    if (deletePost.deletedCount === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
  }
};