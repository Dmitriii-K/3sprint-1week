import { Request, Response } from "express";
import { commentCollection } from "../db/mongo-db";
import { CommentViewModel, PaginatorCommentViewModelDB, CommentDBType } from "../input-output-types/comments-type";
import { PstId, TypePostHalper } from "../input-output-types/posts-type";
import { commentsPagination } from "../middlewares/middlewareForAll";
import { WithId } from "mongodb";

export const mapComment = (comment: WithId<CommentDBType>): CommentViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        createdAt: comment.createdAt,
        commentatorInfo: comment.commentatorInfo,
    };
};

export const getCommentByPostId = async (req:Request<PstId, {},{},TypePostHalper>, res:Response<PaginatorCommentViewModelDB>) => {
    try {
        const id = req.params.id;
        const queryParams = commentsPagination(req.query);
        const items: WithId<CommentDBType>[] = await commentCollection
          .find({ postId: id })
          .sort(queryParams.sortBy, queryParams.sortDirection)
          .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
          .limit(queryParams.pageSize)
          .toArray();
        if (items.length < 1) {
          res.sendStatus(404);
          return;
        }
        const totalCount = await commentCollection.countDocuments({ postId: id });
        const getComment: PaginatorCommentViewModelDB = {
          pagesCount: Math.ceil(totalCount / queryParams.pageSize),
          page: queryParams.pageNumber,
          pageSize: queryParams.pageSize,
          totalCount,
          items: items.map(mapComment),
        };
        res.status(200).json(getComment);
      } catch (error) {
        console.log(error);
      }
};