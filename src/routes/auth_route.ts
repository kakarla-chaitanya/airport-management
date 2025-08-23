import express from "express";
import asyncHandler from "../utils/async_handler";
import { body, validationResult } from "express-validator";
import InvalidRequestBodyError from "../Errors/invalid_request_body_error";
import { login, register } from "../controllers/auth_controllers";
import generateToken from "../utils/generate_token";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import validateToken from "../middleware/validate_token";
import { checkRoles } from "../middleware/check_roles";
import { Roles } from "../models/roles";
import InvalidRequestError from "../Errors/invalid_request_error";
import { producer } from "../config/kafka";

dotenv.config();
const router=express.Router();

router.post("/register",validateToken,checkRoles([Roles.admin]),[
    body("name")
        .notEmpty().withMessage("Empty name"),
    body("role")
        .notEmpty().withMessage("Invalid Role"),
    body("email")
        .notEmpty().withMessage('Empty email')
        .bail()
        .isEmail().withMessage("Invalid email"),
    body("password")
        .notEmpty().withMessage("Empty Password")
        .bail()
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .bail()
        .custom((value) => /[a-zA-Z]/.test(value) && /\d/.test(value))
        .withMessage("Password must contain both letters and numbers"),
],asyncHandler(async (req,res)=>{
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        const firstError = errors.array()[0]; 
        throw new InvalidRequestBodyError(firstError?.msg,errors.array());
    }

    const {name,role,email,password}=req.body;
    if (!Object.values(Roles).includes(role as Roles)){
        throw new InvalidRequestBodyError(`Invalid role type. Role must be within ${Roles.toString()}`);
    }
    const roleEnum=role as Roles;

    let hashPassword=await bcrypt.hash(password,10);
    const user=await register(name,roleEnum,email,hashPassword);

    await producer.send({
        topic:"auth",
        messages:[
            {
                key:user.email,
                value:JSON.stringify({
                    type:"register",
                    email:user.email,
                    name:user.name,
                    role:user.role,
                })
            }
        ]
    });

    return res.status(200).json(user);
}));

router.post("/register-user",[
    body("name")
        .notEmpty().withMessage("Empty name"),
    body("email")
        .notEmpty().withMessage('Empty email')
        .bail()
        .isEmail().withMessage("Invalid email"),
    body("password")
        .notEmpty().withMessage("Empty Password")
        .bail()
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .bail()
        .custom((value) => /[a-zA-Z]/.test(value) && /\d/.test(value))
        .withMessage("Password must contain both letters and numbers"),
],asyncHandler(async (req,res)=>{
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        const firstError = errors.array()[0]; 
        throw new InvalidRequestBodyError(firstError?.msg,errors.array());
    }
    const {name,email,password}=req.body;
    
    let hashPassword=await bcrypt.hash(password,10);
    const user=await register(name,Roles.user,email,hashPassword);

     await producer.send({
        topic:"auth",
        messages:[
            {
                key:user.email,
                value:JSON.stringify({
                    type:"register-user",
                    email:user.email,
                    name:user.name,
                })
            }
        ]
    });

    return res.status(200).json(user);
}));

router.get("/login",[
    body("email")
        .notEmpty().withMessage("Empty email")
        .bail()
        .isEmail().withMessage("InValid email"),
    body("password")
        .notEmpty().withMessage("Empty Password")
],asyncHandler( async (req,res)=>{
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        const firstError = errors.array()[0]; 
        throw new InvalidRequestBodyError(firstError?.msg,errors.array());
    }

    const {email,password}=req.body;
    const user=await login(email,password);

    if (typeof req.headers["x-device-id"]!=="string"){
        throw new InvalidRequestError("Missing device Id");
    }
    const token=await generateToken(user._id,req.headers["x-device-id"]);

    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path:"/",
        maxAge:Number(process.env.TTL_FOR_AUTH||60*60)*1000,
    });
    
    return res.status(200).json({
        name:user.name,
        email:user.email,
        role:user.role,
    });
}));

export default router;