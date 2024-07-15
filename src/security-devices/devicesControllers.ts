import { Request, Response } from "express";
import { DeviceService } from "./devicesService";


export class DevicesControllers {
    static deleteAllDevices = async (req: Request, res: Response) => {
        try {
            const result = await DeviceService.deleteAllDevices();
            if(result!) {
                res.sendStatus(204)
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    };

    static deleteDeviceById = async (req: Request, res: Response) => {
        try {
            const findDevice = await DeviceService.findUserByDeviceId();
            if (!findDevice) {
                res.sendStatus(404); // null
            } else {
                if () {
                  res.sendStatus(403); // false
                return; 
                }}

            const deleteDevice = await DeviceService.deleteDeviceById(req.cookies.deviceId);
            if(deleteDevice!) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    };

    static getAllDevices = async (req: Request, res: Response) => {
        try {
            
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    }
}