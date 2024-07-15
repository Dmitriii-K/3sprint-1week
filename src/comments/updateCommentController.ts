import { Request, Response } from "express";
import {ComId} from "../input-output-types/eny-type";
import { CommentInputModel, CommentViewModel } from "../input-output-types/comments-type";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { CommetRepository } from "./commentRepository";

export const updateComment = async (req:Request< ComId, {}, CommentInputModel>, res:Response<CommentViewModel | OutputErrorsType>) => {
    try {
        const findComment = await CommetRepository.findUserByComment(req.params.id)
        if (!findComment) {
          res.sendStatus(404); // null
        } else {
          if (req.user._id.toString() !== findComment.commentatorInfo.userId.toString()) {
            res.sendStatus(403); // false
            return; 
          }
          const succsesUpdate = await CommetRepository.updateComment(req.params.id, req.body.content);
          if(succsesUpdate) {
            res.sendStatus(204); // true
          }
        }
        return;
      } catch (error) {
        console.log(error);
        res.sendStatus(505)
      }
};