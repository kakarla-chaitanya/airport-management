import { Request,Response,NextFunction } from "express";
import InvalidRequestError from "../Errors/invalid_request_error";

export default async function checkDeviceId(req:Request,res:Response,next:NextFunction) {
    const deviceId = req.headers["x-device-id"];
    if (!deviceId || typeof deviceId!=="string" || deviceId.length==0){
        throw new InvalidRequestError("Missing device Id");
    }
    next();
}