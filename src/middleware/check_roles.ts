import { Request,Response,NextFunction } from "express";
import { Roles } from "../models/roles";
import AuthenticationError from "../Errors/authentication_error";
import AuthorizationError from "../Errors/authorization_error";

export function checkRoles(roles:Roles[]){
    return (req:Request,res:Response,next:NextFunction)=>{
        try{
            if (!req.user){
                throw new AuthenticationError("Invalid User");
            }
            if (!roles.includes(req.user.role)){
                throw new AuthorizationError("you are not authorized for this activity");
            }
            next();
        }catch(err){
            throw err;
        }
    };
}