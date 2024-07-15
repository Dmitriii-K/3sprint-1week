import { Request, Response } from "express";
import { UserInputModel, UserViewModel } from "../input-output-types/users-type";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { UserService } from "./userService";
import { UserQueryRepository } from "./userQueryRepository";

export const createUserController = async (
  req: Request<any, any, UserInputModel>,
  res: Response<UserViewModel | OutputErrorsType>,
) => {
  try {
    const createResult = await UserService.createUser(req.body);
    if (!createResult) {
      res.status(400).json({ errorsMessages: [{ message: 'email and login should be unique', field: 'email and login',}]
        });
        return;
    };
  const newUserDB = await UserQueryRepository.findUserById(createResult);
  res.status(201).json(newUserDB!);
  } catch (error) {
    console.log(error);
    res.sendStatus(505);
  }
};