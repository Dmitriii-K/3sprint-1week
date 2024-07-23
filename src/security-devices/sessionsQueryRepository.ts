import { WithId } from "mongodb";
import {sessionsCollection} from "../db/mongo-db";
import { DeviceViewModel } from "../input-output-types/device-type";
import { SessionsType } from "../input-output-types/sessions-types";

export class GetAllSessions {
    static async findSessions (userId: string) {
        const currentTime = new Date();
        const sessions = await sessionsCollection.find({user_id: userId, exp: {$gte: currentTime}}).toArray();
        // const allSessions = sessions.map(GetAllSessions.mapSession)
        if(!sessions) {
            return null;
        }
        return GetAllSessions.mapSession(sessions)
    }
    static mapSession (session: WithId<SessionsType>): DeviceViewModel {
        return {
            ip: session.ip,
            title: session.device_name,
            lastActiveDate: session.iat.toISOString(),
            deviceId: session.device_id
        }
    }
}