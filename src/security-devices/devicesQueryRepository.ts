import { devicesCollection} from "../db/mongo-db";



export class GetAllDevices {
    static async findDevices () {
        const devices = await devicesCollection.find([{}]);
        if(devices) return true;
            return null;
    }
}