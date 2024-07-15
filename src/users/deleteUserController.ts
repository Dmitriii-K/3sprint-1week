import { Request, Response } from "express";
import { UserRepository } from "./userRepository";

export const deleteUserController = async (req: Request, res: Response) => {
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