import { SessionsRepository } from "./sessionsRepository";


export class SessionsService {
    static async deleteAllSessionsExpextCurrentOne (data: string) {
        const result = await SessionsRepository.deleteSessions(data);
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