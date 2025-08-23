import { Document } from "mongoose";
import { Roles } from "../roles";

export default interface IUserSchema extends Document{
    _id:string,
    name:string,
    email:string,
    role:Roles,
    password:string,
    comparePassword:(password:string)=>Promise<boolean>,
}