import { Request, Response } from "express";
import { SessionsService } from "./sessionsService";
import { GetAllSessions } from "./sessionsQueryRepository";
import { DeviceViewModel } from "../input-output-types/device-type";


export class SessionsControllers {
    static deleteAllSessionsExpextCurrentOne = async (req: Request, res: Response) => {
        try {
            const {userId, device_id} = req.cookies.refreshToken;
            const result = await SessionsService.deleteAllSessionsExpextCurrentOne(userId, device_id);
            if(result!) {
                res.sendStatus(204)
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    };

    static deleteSessionsById = async (req: Request, res: Response) => {
        try {
            const findSession = await SessionsService.findUserByDeviceId(req.cookies.refreshToken.deviceId);
            if (!findSession) {
                res.sendStatus(404); 
            } else {
                if (req.user._id.toString() !== findSession.user_id) {
                res.sendStatus(403); 
                return; 
                }}

            const deleteDevice = await SessionsService.deleteSessionById(req.cookies.refreshToken.deviceId);
            if(deleteDevice!) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    };

    static getAllSessions = async (req: Request, res: Response<DeviceViewModel>) => {
        try {
            const sessions = await GetAllSessions.findSessions(req.user._id);
            if(sessions) {
                res.sendStatus(200)
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    }
}