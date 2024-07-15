import { Router } from "express";
import { DevicesControllers } from "./devicesControllers";
import { checkRefreshToken } from "../middlewares/middlewareForAll";


export const devicesRouters = Router();

devicesRouters.get("/devices",checkRefreshToken, DevicesControllers.getAllDevices);
devicesRouters.delete("/devices",checkRefreshToken, DevicesControllers.deleteAllDevices);
devicesRouters.delete("/devices/:id",checkRefreshToken, DevicesControllers.deleteDeviceById);