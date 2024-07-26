import { Request, Response } from "express";
import {ComId} from "../input-output-types/eny-type";
import { CommentInputModel, CommentViewModel } from "../input-output-types/comments-type";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { CommetRepository } from "./commentRepository";
import { CommentQueryRepository } from "./commentQueryRepositiry";
import { CommentService } from "./commentService";

export class CommentsController {
    static getComment = async (req: Request, res: Response<CommentViewModel>) => {
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
    static updateComment = async (req:Request< ComId, {}, CommentInputModel>, res:Response<CommentViewModel | OutputErrorsType>) => {
        try {
            const findUser = await CommentService.findUserByComment(req.params.id)
            if (!findUser) {
              res.sendStatus(404); // null
            } else {
            if (req.user._id.toString() !== findUser.commentatorInfo.userId.toString()) {
                res.sendStatus(403);
                return; 
            }
            const succsesUpdate = await CommentService.updateComment(req.params.id, req.body.content);
            if(succsesUpdate === true) {
                res.sendStatus(204);
            }
            }
            return;
        } catch (error) {
            console.log(error);
            res.sendStatus(505)
        }
    };
    static deleteComment = async (req: Request, res: Response) => {
        try {
        const user = await CommentService.findUserByComment(req.params.id)
            if (!user) {
                res.sendStatus(404); // null
            } else {
                if (req.user._id.toString() !== user.commentatorInfo.userId.toString()) {
                res.sendStatus(403);
                return; 
                }
                const deleteComment = await CommentService.deleteComment(req.params.id);
                if(deleteComment) {
                  res.sendStatus(204); // true
                }
            }
            return;
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    }
}