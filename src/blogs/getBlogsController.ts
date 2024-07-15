import { Request, Response } from "express";
import {
  BlogViewModel,
  BlogDbType,
  PaginatorBlogViewModel,
} from "../input-output-types/blogs-type";
import { TypeBlogHalper } from "../input-output-types/blogs-type";
import { blogCollection } from "../db/mongo-db";
import { WithId } from "mongodb";
import { halper } from "../middlewares/middlewareForAll";

export const blogsMap = (blog: WithId<BlogDbType>): BlogViewModel => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};

export const getBlogsController = async (
  req: Request<any, any, any, TypeBlogHalper>,
  res: Response<PaginatorBlogViewModel>
) => {
  const queryParams = halper(req.query);
  const search = req.query.searchNameTerm
    ? { name: { $regex: req.query.searchNameTerm, $options: "i" } }
    : {};
  try {
    const items: WithId<BlogDbType>[] = await blogCollection
      .find(search)
      .sort(queryParams.sortBy, queryParams.sortDirection)
      .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
      .limit(queryParams.pageSize)
      .toArray();
    const totalCount = await blogCollection.countDocuments(search);
    const newBlog = {
      pagesCount: Math.ceil(totalCount / queryParams.pageSize),
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalCount,
      items: items.map(blogsMap),
    };
    res.status(200).json(newBlog);
    return;
  } catch (e) {
    console.log(e);
    return { error: "some error" };
  }
};