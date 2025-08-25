import {v5 as uuidv5} from "uuid";
import DataConsistencyError from "../Errors/data_consistency_error";
import EntityNotFoundError from "../Errors/entity_not_found_error";
import User from "../models/user/user_model";
import { Roles } from "../models/roles";
import { logoutSession } from "../utils/session_management";

export async function register(name:string,role:Roles,email:string,password:string) {
    const existingUser=await User.findOne({email});
    if (existingUser){
        throw new DataConsistencyError("Already Existing Email");
    }
    let _id=uuidv5(email,uuidv5.URL);
    const user=await User.create({
        _id,
        name,
        role,
        email,
        password,
    })
    return {name:user.name,email:user.email,role:user.role};
}

export async function login(email:string,password:string) {
    const user=await User.findOne({email});
    if (!user){
        throw new EntityNotFoundError("User not found with this email");
    }
    if (! await user.comparePassword(password)){
        throw new DataConsistencyError("Password didn't match");
    }
    return user;
}

export async function logout(id:string,deviceId:string) {
    await logoutSession(id,deviceId);
}