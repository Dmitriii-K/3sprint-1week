import { Request, Response } from "express";
import { SessionsService } from "./sessionsService";
import { SessionsQueryRepository } from "./sessionsQueryRepository";
import { DeviceViewModel } from "../input-output-types/device-type";

export class SessionsControllers {
    static deleteAllSessionsExceptCurrentOne = async (req: Request, res: Response) => {
        try {
            const userId = req.user._id.toString();
            const device_id = req.deviceId;

            const result = await SessionsService.deleteAllSessionsExceptCurrentOne(userId, device_id);
            if(result!) {
                res.sendStatus(204)
                return
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    };

    static deleteSessionsById = async (req: Request, res: Response) => {
        try {
            const findSession = await SessionsService.findUserByDeviceId(req.params.id);
            if (!findSession) {
                res.sendStatus(404); 
                return
            } else {
                if (req.user._id.toString() !== findSession.user_id) {
                res.sendStatus(403); 
                return; 
                }}

            const deleteDevice = await SessionsService.deleteSessionById(req.params.id);
            if(deleteDevice!) {
                res.sendStatus(204)
                return
            } else {
                res.sendStatus(404)
                return
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    };

    static getAllSessions = async (req: Request, res: Response<DeviceViewModel[]>) => {
        try {
            const sessions = await SessionsQueryRepository.findSessions(req.user._id);
            if(sessions) {
                res.status(200).json(sessions)
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    }
}