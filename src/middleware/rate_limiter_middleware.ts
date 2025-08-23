import { Request,Response,NextFunction } from "express";
import { extractIp } from "../utils/extract_ip";
import isRateLimited from "../utils/rate_limiter";
import RateLimiterError from "../Errors/rate_limiter_error";

export default async function rateLimiterMiddleware(req:Request,res:Response,next:NextFunction) {
    try{
        const ip=extractIp(req);
        if (await isRateLimited(ip)){
            throw new RateLimiterError("Rate Limit Exceeded");     
        }
        next();
    }catch(err){
        throw err;
    }
}