import { Request, Response } from "express";
import { MeViewModel } from "../input-output-types/auth-type";

export const getUserInformation = async (req: Request, res: Response<MeViewModel>) => {
    try {
        const {login, email, _id} = req.user
        const result = {login, email, userId: _id.toString()}
        res.status(200).json(result!); 
        return;
    } catch (error) {
        console.log(error);
    }
};