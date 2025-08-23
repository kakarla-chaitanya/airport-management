import { NextFunction,Request,Response } from "express";
import InvalidRequestBodyError from "../Errors/invalid_request_body_error";

export default function checkEmptyBody(req:Request,res:Response,next:NextFunction){
    if (!req.body || Object.keys(req.body).length==0){
        throw new InvalidRequestBodyError("Empty request Body");
    }
    next();
}