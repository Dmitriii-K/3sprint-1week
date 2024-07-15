import { Request, Response } from "express";
import { CommetRepository } from "./commentRepository";

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const findComment = await CommetRepository.findUserByComment(req.params.id)
        if (!findComment) {
          res.sendStatus(404); // null
        } else {
          if (req.user._id.toString() !== findComment.commentatorInfo.userId.toString()) {
            res.sendStatus(403); // false
            return; 
          }
          const deleteComment = await CommetRepository.deleteComment(req.params.id);
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


