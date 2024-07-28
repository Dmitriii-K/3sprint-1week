import {sessionsCollection} from "../db/mongo-db";

export class SessionsRepository {
    static async deleteSessionById (deviceId: string) {
        const result = await sessionsCollection.deleteOne({device_id: deviceId});
        return result.deletedCount === 1

    }
    static async deleteAllSessionsExceptCurrentOne (userId: string, device_id: string) {
        const deleteAlldevices = await sessionsCollection.deleteMany({user_id: userId, device_id: {$ne: device_id}});
        return deleteAlldevices.deletedCount === 1
    }
    static async findUserByDeviceId (deviceId: string) {
        const user = await sessionsCollection.findOne({device_id: deviceId});
        if(user) {
            return user
        } else {
            return false
        }
    }
    static async findSessionByMiddleware (deviceId: string) {
        const user = await sessionsCollection.findOne({device_id: deviceId});
        if(user) {
            return user
        } else {
            return null
        }
    }
}