import dotenv from "dotenv";
import GlobalError from "../Errors/global_error";
import jwt from "jsonwebtoken";
import { v4 as uuidv4} from "uuid";
import { createSession } from "./session_management";
dotenv.config();

const jwtSecret=process.env.JWT_SECRET;
const ttl=Number(process.env.TTL_FOR_AUTH||60*60);
export default async function generateToken(id:string,deviceId:string){
    if (!jwtSecret){
        throw new GlobalError("Missing jwt secret key");
    }
    const jti=uuidv4();
    const token=jwt.sign({
        id,
        deviceId
    },jwtSecret,{
        jwtid:jti,
        expiresIn:ttl,
    });
    await createSession(id,deviceId,jti);
    return token;
}