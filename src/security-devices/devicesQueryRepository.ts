import {sessionsCollection} from "../db/mongo-db";



export class GetAllDevices {
    static async findDevices () {
        const devices = await sessionsCollection.find([{}]);
        if(devices) return true;
            return null;
    }
}