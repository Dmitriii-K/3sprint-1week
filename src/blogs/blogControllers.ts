import { Request, Response } from "express";
import {BlogInputModel, BlogDbType, BlogViewModel, PaginatorBlogViewModel, TypePostForBlogHalper} from "../input-output-types/blogs-type";
import { BlogPostInputModel, BlgId } from "../input-output-types/eny-type";
import { PostDbType, PaginatorPostViewModel } from "../input-output-types/posts-type";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { postCollection, blogCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";
import { TypeBlogHalper } from "../input-output-types/blogs-type";
import { WithId } from "mongodb";
import { halper } from "../middlewares/middlewareForAll";

export class BlogController {
    static createBlog = async (
        req: Request<any, any, BlogInputModel>,
        res: Response<any>
    ) => {
        try {
        const createDate = new Date().toISOString();
        const newBlog: BlogDbType = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: createDate,
            isMembership: false,
        };
        const newBlogBD = await blogCollection.insertOne(newBlog)!;
        if (newBlogBD) {
            const mapNewBlog = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: createDate,
            isMembership: false,
            id: newBlogBD.insertedId,
            };
            res.status(201).json(mapNewBlog);
        } else {
            res.sendStatus(500);
        }
        } catch (error) {
        console.log(error);
        }
    };
    static createPostForBlog = async (
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
    static getAllBlogs = async (
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
    static getBlogById = async (req: Request, res: Response) => {
        try {
        const id = new ObjectId(req.params.id);
        const blog = await blogCollection.findOne({ _id: id });
        if (blog) {
            const findBlog = blogsMap(blog);
            res.status(200).json(findBlog);
        } else {
            res.sendStatus(404);
        }
        } catch (error) {
        console.log(error);
        }
    };
    static getPostForBlog = async (
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
            items: items.map(PostQueryRepository.mapPost),
        };
        res.status(200).json(newPost);
        } catch (error) {
        console.log(error);
        }
    };
    static updateBlog = async (
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
    static deleteBlog = async (
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
}