import { Request, Response } from "express";
import { UserInputModel, UserViewModel } from "../input-output-types/users-type";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { UserService } from "./userService";
import { UserQueryRepository } from "./userQueryRepository";
import { UserRepository } from "./userRepository";
import {
    PaginatorUserViewModel,
    TypeUserPagination,
} from "../input-output-types/users-type";

export class UserController {
    static createUser = async (
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
    static deleteUser = async (req: Request, res: Response) => {
        try {
        const deleteBlog = await UserRepository.deleteUser(req.params.id);
        if (deleteBlog) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    };
    static getUser = async (
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
}