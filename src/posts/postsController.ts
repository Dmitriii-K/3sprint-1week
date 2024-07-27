import { Request, Response } from "express";
import {  } from "../input-output-types/posts-type";
import { CommentInputModel, CommentViewModel,CommentDBType, PaginatorCommentViewModelDB } from "../input-output-types/comments-type";
import {
    PostInputModel,
    PstId,
    PostDbType,
    PostViewModel,
    PaginatorPostViewModel,
    TypePostHalper,
} from "../input-output-types/posts-type";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { postCollection, commentCollection, blogCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";
import { WithId } from "mongodb";
import { halper, commentsPagination } from "../middlewares/middlewareForAll";
import { PostRepository } from "./postsRepository";
import { PostService } from "./postsService";
import { PostQueryRepository } from "./postsQueryRepository";

export class PostController {
    static createPost = async (
        req: Request<any, any, PostInputModel>,
        res: Response<any>
    ) => {
        try {
            const createResult = await PostService.createPost(req.body, req.body.blogId);
            if (!createResult) {
                res.sendStatus(404)
                return;
            };
            const newPost = await PostQueryRepository.findPostById(createResult);
            if(newPost)
                res.status(201).json(newPost);
        // const id = new ObjectId(req.body.blogId);
        // const findBlogNameForId = await PostRepository.findBlogNameForId(req.body.blogId);
        // const createDate = new Date().toISOString();
        // const newPost: PostDbType = {
        //     title: req.body.title,
        //     shortDescription: req.body.shortDescription,
        //     content: req.body.content,
        //     blogId: req.body.blogId,
        //     blogName: findBlogNameForId!.name,
        //     createdAt: createDate,
        // };
        // const newPostDB = await postCollection.insertOne(newPost);
        // if (newPostDB) {
        //     const mapPostDB = {
        //     title: req.body.title,
        //     shortDescription: req.body.shortDescription,
        //     content: req.body.content,
        //     blogId: req.body.blogId,
        //     blogName: findBlogNameForId!.name,
        //     createdAt: createDate,
        //     id: newPostDB.insertedId,
        //     };
        //     res.status(201).json(mapPostDB);
        // } else {
        //     res.sendStatus(500);
        // }
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    };
    static createCommentByPostId = async (req:Request<PstId,{}, CommentInputModel>, res:Response<CommentDBType>) => {
        try {
            const createResult = await PostService.createCommentByPost(req.params.id, req.body, req.user)
            if (!createResult) {
                res.sendStatus(404)
                return;
            };
            // const id = new ObjectId(req.params.id);
            // const commentForPost = await postCollection.findOne({ _id: id });
            // if (!commentForPost) {
            // res.sendStatus(404);
            // return;
            // };
            // const createDate = new Date().toISOString();
            // const newComment: CommentDBType = {
            //     postId: req.params.id,
            //     content:	req.body.content,
            //     createdAt:	createDate,
            //     commentatorInfo: { 
            //         userId:	req!.user!._id!.toString(),
            //         userLogin: req.user!.login,
            //     },
            // };
            const newComment = await PostQueryRepository.findCommentById(createResult);
            // if(newComment) {
            //     const mapComment: CommentViewModel = {
            //         id: newComment.insertedId.toString(),
            //         content: req.body.content,
            //         createdAt: createDate,
            //         commentatorInfo: { 
            //             userId:	req.user!._id!.toString(),
            //             userLogin: req.user!.login,
            //         },
            //     };
                if(newComment)
                    res.status(201).json(newComment);
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    };
    static getPosts = async (
        req: Request<any, any, any, TypePostHalper>,
        res: Response<PaginatorPostViewModel>
    ) => {
        try{
        const posts = await PostQueryRepository.getAllPosts(req.query)
        res.status(200).json(posts);
        return;
        // const queryParams = halper(req.query);
        // try {
        // const items: WithId<PostDbType>[] = (await postCollection
        //     .find({})
        //     .sort(queryParams.sortBy, queryParams.sortDirection)
        //     .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
        //     .limit(queryParams.pageSize)
        //     .toArray()) as any[];
        // const totalCount = await postCollection.countDocuments({});
        // const newPost = {
        //     pagesCount: Math.ceil(totalCount / queryParams.pageSize),
        //     page: queryParams.pageNumber,
        //     pageSize: queryParams.pageSize,
        //     totalCount,
        //     items: items.map(postsMap),
        // };
        // res.status(200).json(newPost);
        // return;
        }catch (e) {
        console.log(e);
        res.sendStatus(505);
    }
    };
    static getPostById = async (req: Request, res: Response) => {
        try {
            const postResult = await PostQueryRepository.findPostById(req.params.id)
            if(postResult) {
                res.status(200).json(postResult)
            } else {
                res.sendStatus(404)
            }
        // const id = new ObjectId(req.params.id);
        // const post = await postCollection.findOne({ _id: id });
        // if (post) {
        //     const findPost = postsMap(post);
        //     res.status(200).json(findPost);
        // } else {
        //     res.sendStatus(404);
        // }
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    };
    static getCommentByPost = async (req:Request<PstId, {},{},TypePostHalper>, res:Response<PaginatorCommentViewModelDB>) => {
        try {
            const comments = await PostQueryRepository.findCommentByPost(req.query, req.params.id)
            if(comments.items.length < 1) {
                res.sendStatus(404)
                return
            } else {
                res.status(200).json(comments);
                return;
                }
            // const id = req.params.id;
            // const queryParams = commentsPagination(req.query);
            // const items: WithId<CommentDBType>[] = await commentCollection
            // .find({ postId: id })
            // .sort(queryParams.sortBy, queryParams.sortDirection)
            //   .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            // .limit(queryParams.pageSize)
            // .toArray();
            // if (items.length < 1) {
            // res.sendStatus(404);
            // return;
            // }
            // const totalCount = await commentCollection.countDocuments({ postId: id });
            // const getComment: PaginatorCommentViewModelDB = {
            // pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            // page: queryParams.pageNumber,
            // pageSize: queryParams.pageSize,
            // totalCount,
            // items: items.map(mapComment),
            // };
            // res.status(200).json(getComment);
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    };
    static updatePost = async (
        req: Request<any, any, PostInputModel>,
        res: Response<PostViewModel | OutputErrorsType>
    ) => {
        try {
            const findPost = await PostRepository.findPostById(req.params.id)
            if(!findPost) {
                res.sendStatus(404)
                return
            }
            const updateResult = await PostService.updatePost(req.body, req.params.id)
            if(updateResult) {
                res.sendStatus(204);
            }
        // const id = new ObjectId(req.params.id);
        // const findPost = await postCollection.findOne({ _id: id });
        // if (!findPost) {
        //     res.sendStatus(404);
        // } else {
        //     const post = await postCollection.updateOne(
        //     { _id: id },
        //     {
        //         $set: {
        //         title: req.body.title,
        //         shortDescription: req.body.shortDescription,
        //         content: req.body.content,
        //         blogId: req.body.blogId,
        //         },
        //     }
        //     );
        //     res.sendStatus(204);
        // }
        // return;
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    };
    static deletePost = async (
        req: Request,
        res: Response<any>
    ) => {
        try {
            const deleteResult = await PostService.deletePost(req.params.id)
            if(deleteResult) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        // const id = new ObjectId(req.params.id);
        // const deletePost = await postCollection.deleteOne({ _id: id });
        // if (deletePost.deletedCount === 1) {
        //     res.sendStatus(204);
        // } else {
        //     res.sendStatus(404);
        // }
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    };
}