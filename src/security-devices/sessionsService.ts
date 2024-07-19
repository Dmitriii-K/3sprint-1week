import { SessionsRepository } from "./sessionsRepository";


export class SessionsService {
    static async deleteAllSessionsExpextCurrentOne (userId: string, device_id: string) {
        const result = await SessionsRepository.deleteSessions(userId, device_id);
        if(result) {
            return true
                } else {
            return false
            }
    }
    static async deleteSessionById (deviceId: string) {
        const result = await SessionsRepository.deleteSessionById(deviceId);
        if(result) {
            return true
                } else {
            return false
            }
    }
    static async findUserByDeviceId (deviceId: string) {
        const result = await SessionsRepository.findUserByDeviceId(deviceId);
        if(result) {
            return result
                } else {
            return false
            }
    }
}