import { Request, Response } from "express";
import { CommentViewModel } from "../input-output-types/comments-type";
import { CommentQueryRepository } from "./commentQueryRepositiry";

export const getComment = async (req: Request, res: Response<CommentViewModel>) => {
  try {
    const comment = await CommentQueryRepository.findCommentById(req.params.id);
    if(comment) {
      return res.status(200).json(comment)
    };
    return res.sendStatus(404);
    } catch (error) {
      console.log(error);
      return res.sendStatus(505);
    }
};