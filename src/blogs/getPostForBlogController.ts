import { Request, Response } from "express";
import {
  PostDbType,
  PaginatorPostViewModel,
} from "../input-output-types/posts-type";
import { BlgId } from "../input-output-types/eny-type";
import { TypePostForBlogHalper } from "../input-output-types/blogs-type";
import { postCollection } from "../db/mongo-db";
import { WithId } from "mongodb";
import { postsMap } from "../posts/getPostsController";
import { halper } from "../middlewares/middlewareForAll";

export const getPostForBlogController = async (
  req: Request<BlgId, any, any, TypePostForBlogHalper>,
  res: Response<PaginatorPostViewModel>
) => {
  try {
    const id = req.params.id;
    const queryParams = halper(req.query);
    const items: WithId<PostDbType>[] = await postCollection
      .find({ blogId: id })
      .sort(queryParams.sortBy, queryParams.sortDirection)
      .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
      .limit(queryParams.pageSize)
      .toArray();
    if (items.length < 1) {
      res.sendStatus(404);
      return;
    }
    const totalCount = await postCollection.countDocuments({ blogId: id });
    const newPost = {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items: items.map(postsMap),
    };
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
  }
};