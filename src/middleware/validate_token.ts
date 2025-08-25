import { Request,Response,NextFunction } from "express";
import AuthenticationError from "../Errors/authentication_error";
import GlobalError from "../Errors/global_error";
import jwt from "jsonwebtoken";
import User from "../models/user/user_model";
import DataConsistencyError from "../Errors/data_consistency_error";
import { verify } from "crypto";
import { verifySession } from "../utils/session_management";
import SessionValidationError from "../Errors/session_validation_error";

export default async function validateToken(req:Request,res:Response,next:NextFunction){
    try{
        const token=req.cookies.token;
        if(!token){
            throw new AuthenticationError("Missing Token");
        }

        const secretKey=process.env.JWT_SECRET as string;
        if (!secretKey){
            throw new GlobalError("Missing jwt secret key")
        }

        const decoded=jwt.verify(token,secretKey);
        if (
            typeof decoded==="string" ||
            !("id" in decoded) ||
            !("deviceId" in decoded)||
            !("jti" in decoded) ||
            typeof decoded.id!=="string"||
            typeof decoded.jti!=="string"||
            typeof decoded.deviceId!=="string"
        ){
            throw new AuthenticationError("Invalid Token Payload");
        }

        if (decoded.deviceId!==req.headers["x-device-id"]){
            throw new DataConsistencyError("Invalid device-id");
        }

        const validSession=await verifySession(decoded.id,decoded.jti);
        if (!validSession){
            throw new SessionValidationError("Session Expired");
        }
        
        const user=await User.findOne({_id:decoded.id});
        if (!user){
            throw new DataConsistencyError("This user no longer exists in DB");
        }

        req.user={
            _id:decoded.id,
            jti:decoded.jti,
            name:user.name,
            email:user.email,
            role:user.role,
        }

        next();
    }catch(err:any){
        if (err.name === 'TokenExpiredError') {
          throw new AuthenticationError("Token Expired");
        }
      
        if (err.name === 'JsonWebTokenError') {
          throw new AuthenticationError("Invalid Token",err.message);
        }
        throw err;
    }
}