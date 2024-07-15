import { Request, Response } from "express";
import {
  PostDbType,
  PostViewModel,
  PaginatorPostViewModel,
  TypePostHalper,
} from "../input-output-types/posts-type";
import { postCollection } from "../db/mongo-db";
import { WithId } from "mongodb";
import { halper } from "../middlewares/middlewareForAll";

export const postsMap = (post: WithId<PostDbType>): PostViewModel => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};

export const getPostsController = async (
  req: Request<any, any, any, TypePostHalper>,
  res: Response<PaginatorPostViewModel>
) => {
  const queryParams = halper(req.query);
  try {
    const items: WithId<PostDbType>[] = (await postCollection
      .find({})
      .sort(queryParams.sortBy, queryParams.sortDirection)
      .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
      .limit(queryParams.pageSize)
      .toArray()) as any[];
    const totalCount = await postCollection.countDocuments({});
    const newPost = {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items: items.map(postsMap),
    };
    res.status(200).json(newPost);
    return;
  } catch (e) {
    console.log(e);
    return { error: "some error" };
  }
};