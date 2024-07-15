import { DeviceRepository } from "./devicesRepository";


export class DeviceService {
    static async deleteAllDevices () {
        const result = await DeviceRepository.deleteDevices();
    }
    static async deleteDeviceById (deviceId: string) {
        const result = await DeviceRepository.deleteDeviceById(deviceId);
    }
    static async findUserByDeviceId () {
        
    }
}