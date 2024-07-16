import { devicesCollection} from "../db/mongo-db";



export class DeviceRepository {
    static async deleteDeviceById (deviceId: string) {
        const result = await devicesCollection.deleteOne({deviceId: deviceId});
        if(result.deletedCount === 1) {
            return true
        } else {
            return false
        }
    }
    static async deleteDevices () {
        const deleteAlldevices = await devicesCollection.deleteMany();
        if(deleteAlldevices.deletedCount >= 1) {
            return true
        } else {
            return false
        }
    }
    static async findUserByDeviceId (deviceId: string) {
        const user = await 
    }
}