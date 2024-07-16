import { DeviceRepository } from "./devicesRepository";


export class DeviceService {
    static async deleteAllDevices () {
        const result = await DeviceRepository.deleteDevices();
        if(result) {
            return true
                } else {
            return false
            }
    }
    static async deleteDeviceById (deviceId: string) {
        const result = await DeviceRepository.deleteDeviceById(deviceId);
        if(result) {
            return true
                } else {
            return false
            }
    }
    static async findUserByDeviceId (deviceId: string) {
        const result = await DeviceRepository.findUserByDeviceId(deviceId);
        if(result) {
            return true
                } else {
            return false
            }
    }
}