import {sessionsCollection} from "../db/mongo-db";



export class DeviceRepository {
    static async deleteDeviceById (deviceId: string) {
        const result = await sessionsCollection.deleteOne({device_id: deviceId});
        if(result.deletedCount === 1) {
            return true
        } else {
            return false
        }
    }
    static async deleteDevices () {
        const deleteAlldevices = await sessionsCollection.deleteMany();
        if(deleteAlldevices.deletedCount >= 1) {
            return true
        } else {
            return false
        }
    }
    static async findUserByDeviceId (deviceId: string) {
        const user = await sessionsCollection.findOne({device_id: deviceId});
        if(user) {
            return user
        } else {
            return false
        }
    }
}