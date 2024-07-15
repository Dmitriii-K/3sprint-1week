import { Request, Response } from "express";
import {
  PaginatorUserViewModel,
  TypeUserPagination,
} from "../input-output-types/users-type";
import { UserQueryRepository } from "./userQueryRepository";

export const getUserController = async (
  req: Request<{}, {}, {}, TypeUserPagination>,
  res: Response<PaginatorUserViewModel>
) => {
  try {
  const users = await UserQueryRepository.findUsers(req.query)
    res.status(200).json(users!);
    return;
  } catch (e) {
    console.log(e);
    return res.sendStatus(505);
  }
};