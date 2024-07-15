import { securityCollection } from "../db/mongo-db";



export class DeviceRepository {
    static async deleteDeviceById (deviceId: string) {
        const result = await securityCollection.deleteOne({deviceId: deviceId});
        if(result.deletedCount === 1) {
            return true
        } else {
            return false
        }
    }
    static async deleteDevices () {

    }
    static async findUserByDeviceId () {
        
    }
}