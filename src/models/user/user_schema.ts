import { Schema } from "mongoose";
import IUserSchema from "./i_user_schema";
import { Roles } from "../roles";
import { v4 as uuidv4 } from "uuid";
import bcrypt from 'bcrypt';

const UserSchema=new Schema<IUserSchema>({
    _id:{
        type:String,
        required:true,
        default:uuidv4,
        trim:true,
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        index:true,
    },
    role:{
        type:String,
        enum:Object.values(Roles) as string[],
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    }
},{
    timestamps:true
}
);

UserSchema.methods.comparePassword=async function(password:string){
    return await bcrypt.compare(password,this.password);
}

export default UserSchema;