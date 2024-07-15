import { Request, Response } from "express";
import { postCollection, commentCollection } from "../db/mongo-db";
import { CommentInputModel, CommentViewModel,CommentDBType } from "../input-output-types/comments-type";
import { PstId } from "../input-output-types/posts-type";
import { ObjectId } from "mongodb";

export const createCommentByPostId = async (req:Request<PstId,{}, CommentInputModel>, res:Response<CommentDBType>) => {
    try {
        const id = new ObjectId(req.params.id);
        const commentForPost = await postCollection.findOne({ _id: id });
        if (!commentForPost) {
        res.sendStatus(404);
        return;
        };
        const createDate = new Date().toISOString();
        const newComment: CommentDBType = {
            postId: req.params.id,
            content:	req.body.content,
            createdAt:	createDate,
            commentatorInfo: { 
                userId:	req!.user!._id!.toString(),
                userLogin: req.user!.login,
            },
        };
        const newCommentDB = await commentCollection.insertOne(newComment);
        if(newCommentDB) {
            const mapComment: CommentViewModel = {
                id: newCommentDB.insertedId.toString(),
                content: req.body.content,
                createdAt: createDate,
                commentatorInfo: { 
                    userId:	req.user!._id!.toString(),
                    userLogin: req.user!.login,
                },
            };
            res.status(201).json(mapComment);
        } else {
            res.sendStatus(500);
        }
    } catch (error) {
        console.log(error);
    }
};