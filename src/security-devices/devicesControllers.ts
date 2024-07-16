import { Request, Response } from "express";
import { DeviceService } from "./devicesService";
import { GetAllDevices } from "./devicesQueryRepository";
import { DeviceViewModel } from "../input-output-types/device-type";


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
            const findDevice = await DeviceService.findUserByDeviceId(req.cookies.deviceId);
            if (!findDevice) {
                res.sendStatus(404); 
            } else {
                if (req.cookies.deviceId.toString() !== findDevice.) {
                res.sendStatus(403); 
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

    static getAllDevices = async (req: Request, res: Response<DeviceViewModel>) => {
        try {
            const devices = await GetAllDevices.findDevices();
            if(devices) {
                res.sendStatus(200)
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    }
}