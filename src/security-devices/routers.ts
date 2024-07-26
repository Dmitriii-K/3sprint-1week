import { Router } from "express";
import { SessionsControllers } from "./sessionsControllers";
import { checkRefreshToken } from "../middlewares/middlewareForAll";

export const devicesRouters = Router();

devicesRouters.get("/devices",checkRefreshToken, SessionsControllers.getAllSessions);
devicesRouters.delete("/devices",checkRefreshToken, SessionsControllers.deleteAllSessionsExceptCurrentOne);
devicesRouters.delete("/devices/:id",checkRefreshToken, SessionsControllers.deleteSessionsById);