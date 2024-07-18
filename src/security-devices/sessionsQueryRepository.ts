import {sessionsCollection} from "../db/mongo-db";



export class GetAllSessions {
    static async findSessions (userId: string) {
        const currentTime = new Date();
        const sessions = await sessionsCollection.find({user_id: userId, exp: {$gte: currentTime}}).toArray();
        if(sessions) return sessions;
            return null;
    }
}