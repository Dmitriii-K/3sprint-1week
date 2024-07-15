import { Request, Response } from "express";
import { blogCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";

export const deleteBlogController = async (
  req: Request,
  res: Response<any>
) => {
  try {
    const id = new ObjectId(req.params.id);
    const deleteBlog = await blogCollection.deleteOne({ _id: id });
    if (deleteBlog.deletedCount === 1) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
  }
};