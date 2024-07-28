import { Request, Response } from "express";
import {BlogInputModel, BlogViewModel, PaginatorBlogViewModel, TypePostForBlogHalper} from "../input-output-types/blogs-type";
import { BlogPostInputModel, BlgId } from "../input-output-types/eny-type";
import { PaginatorPostViewModel, PostViewModel } from "../input-output-types/posts-type";
import { TypeBlogHalper } from "../input-output-types/blogs-type";
import { BlogSessions } from "./blogSessions";
import { BlogQueryRepository } from "./blogQueryRepository";

export class BlogController {
    static createBlog = async (
        req: Request<{}, {}, BlogInputModel>,
        res: Response<BlogViewModel>
    ) => {
        try {
            const createResult = await BlogSessions.createBlog(req.body)
            if (!createResult) {
                res.sendStatus(404)
                return;
                };
            const newBlog = await BlogQueryRepository.getBlogById(createResult)
            if(newBlog) {
                res.status(201).json(newBlog);
            } else {
                res.sendStatus(500)
            }
                
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    };
    static createPostForBlog = async (
        req: Request<BlgId, {}, BlogPostInputModel>,
        res: Response<PostViewModel>
    ) => {
        try {
            const findBlog = await BlogSessions.findBlogById(req.params.id)
            if (!findBlog) {
                res.sendStatus(404);
                return;
            }
            const createResult = await BlogSessions.createPostForBlog(req.params.id, req.body, findBlog.name)
            const newPostForBlog = await BlogQueryRepository.getPostForBlogById(createResult)
            if(newPostForBlog) {
                res.status(201).json(newPostForBlog)
            } else {
                res.sendStatus(500)
            }
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    };
    static getAllBlogs = async (
        req: Request<{}, {}, {}, TypeBlogHalper>,
        res: Response<PaginatorBlogViewModel>
    ) => {
        try {
            const blogs = await BlogQueryRepository.getAllBlogs(req.query)
            res.status(200).json(blogs);
            return;
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    };
    static getBlogById = async (req: Request, res: Response) => {
        try {
            const blogResult = await BlogQueryRepository.getBlogById(req.params.id)
            if(blogResult) {
                res.status(200).json(blogResult)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    };
    static getPostForBlog = async (
        req: Request<BlgId, {}, {}, TypePostForBlogHalper>,
        res: Response<PaginatorPostViewModel>
    ) => {
        try {
            const posts = await BlogQueryRepository.getPostFofBlog(req.query, req.params.id)
            if(!posts.items) {
                res.sendStatus(404)
                return
            } else {
                res.status(200).json(posts);
                }
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    };
    static updateBlog = async (
        req: Request<BlgId, {}, BlogInputModel>,
        res: Response
    ) => {
        try {
            const findBlog = await BlogSessions.findBlogById(req.params.id)
            if(!findBlog) {
                res.sendStatus(404)
                return
            }
            const updateBlogResult = await BlogSessions.updateBlog(req.params.id, req.body)
            if(updateBlogResult) {
                res.sendStatus(204)
            }
        return;
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    };
    static deleteBlog = async (
        req: Request,
        res: Response
    ) => {
        try {
            const deleteResult = await BlogSessions.deleteBlog(req.params.id)
            if(deleteResult) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    };
}