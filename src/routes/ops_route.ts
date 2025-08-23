import express from "express";
import validateToken from "../middleware/validate_token";
import checkEmptyBody from "../middleware/check_empty_body";
import { checkRoles } from "../middleware/check_roles";
import { Roles } from "../models/roles";
import { body } from "express-validator";
import asyncHandler from "../utils/async_handler";
import { delayFlight } from "../controllers/ops_controller";
import { producer } from "../config/kafka";

const router=express.Router();

router.use(validateToken);

router.post(
    "/delay-flight",
    checkEmptyBody,
    checkRoles([Roles.admin,Roles.airlineStaff]),
    [
        body("flightNo")
            .notEmpty().withMessage("Empty flight-no"),
        body("message")
            .notEmpty().withMessage("Empty message"),
    ],
    asyncHandler(async(req,res)=>{
        const {flightNo,message}=req.body;
        const flight=await delayFlight(flightNo);
        await producer.send({
            topic:"ops",
            messages:[
            {
                key:flight._id,
                value:JSON.stringify({
                    type:"delay-flight",
                    message,
                    ...flight,
                })
            }
        ]
        })
    })
);

export default router;