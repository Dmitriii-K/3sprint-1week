import { securityCollection } from "../db/mongo-db";



export class GetAllDevices {
    static async findDevices () {
        const devices = await securityCollection.find([{}]);
        if(devices) return true;
            return null;
    }
}