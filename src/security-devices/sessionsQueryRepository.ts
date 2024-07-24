import { WithId } from "mongodb";
import {sessionsCollection} from "../db/mongo-db";
import { DeviceViewModel } from "../input-output-types/device-type";
import { SessionsType } from "../input-output-types/sessions-types";

export class GetAllSessions {
    static async findSessions (userId: string): Promise<DeviceViewModel[] | null> {
            const currentTime = new Date().toISOString();
        const sessions = await sessionsCollection.find({user_id: userId.toString(), exp: {$gte: currentTime}}).toArray();
        // const allSessions = sessions.map(GetAllSessions.mapSession)
        if(!sessions) {
            return null;
        }
        return sessions.map(GetAllSessions.mapSession)
    }
    static mapSession (session: WithId<SessionsType>): DeviceViewModel {
        return {
            ip: session.ip,
            title: session.device_name,
            lastActiveDate: session.iat,
            deviceId: session.device_id
        }
    }
}