import { Request, Response } from "express";
import { PostInputModel, PostDbType } from "../input-output-types/posts-type";
import { postCollection, blogCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";

export const createPostController = async (
  req: Request<any, any, PostInputModel>,
  res: Response<any>
) => {
  try {
    const id = new ObjectId(req.body.blogId);
    const findBlogNameForId = await blogCollection.findOne({ _id: id });
    const createDate = new Date().toISOString();
    const newPost: PostDbType = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
      blogName: findBlogNameForId!.name,
      createdAt: createDate,
    };
    const newPostDB = await postCollection.insertOne(newPost);
    if (newPostDB) {
      const mapPostDB = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: findBlogNameForId!.name,
        createdAt: createDate,
        id: newPostDB.insertedId,
      };
      res.status(201).json(mapPostDB);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.log(error);
  }
};