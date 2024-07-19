import {sessionsCollection} from "../db/mongo-db";
import { DeviceViewModel } from "../input-output-types/device-type";
import { SessionsType } from "../input-output-types/sessions-types";

export class GetAllSessions {
    static async findSessions (userId: string) {
        const currentTime = new Date();
        const sessions: SessionsType[] = await sessionsCollection.find({user_id: userId, exp: {$gte: currentTime}}).toArray();
        const allSessions = sessions.map(GetAllSessions.mapSession)
        if(allSessions) return allSessions;
            return null;
    }
    static mapSession (session: SessionsType): DeviceViewModel {
        return {
            ip: session.ip,
            title: session.device_name,
            lastActiveDate: session.iat,
            deviceId: session.device_id
        }
    }
}