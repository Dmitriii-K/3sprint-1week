import { Request, Response } from "express";
import { BlogPostInputModel } from "../input-output-types/eny-type";
import { PostDbType } from "../input-output-types/posts-type";
import { postCollection, blogCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";

export const createPostForBlogController = async (
  req: Request<any, any, BlogPostInputModel>,
  res: Response<any>
) => {
  try {
    const id = new ObjectId(req.params.id);
    const nameBlogForPost = await blogCollection.findOne({ _id: id });
    if (!nameBlogForPost) {
      res.sendStatus(404);
      return;
    }
    const createDate = new Date().toISOString();
    const newPost: PostDbType = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.params.id,
      blogName: nameBlogForPost!.name,
      createdAt: createDate,
    };
    const postForBlog = await postCollection.insertOne(newPost);
    if (postForBlog) {
      const mapPost = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.params.id,
        blogName: nameBlogForPost!.name,
        createdAt: createDate,
        id: postForBlog.insertedId,
      };
      res.status(201).json(mapPost);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.log(error);
  }
};