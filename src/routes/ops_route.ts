import express from "express";
import validateToken from "../middleware/validate_token";
import checkEmptyBody from "../middleware/check_empty_body";
import { checkRoles } from "../middleware/check_roles";
import { Roles } from "../models/roles";
import { body } from "express-validator";
import asyncHandler from "../utils/async_handler";
import { delayFlight, getAllFlightsExceptDelayed } from "../controllers/ops_controller";
// import { producer } from "../config/kafka";
import { deleteKey } from "../utils/cache";
import { io } from "../config/socket";

const router=express.Router();

router.use(validateToken);

router.get(
    "/",
    checkRoles([Roles.admin,Roles.airlineStaff]),
    asyncHandler(async (req,res)=>{
        const flights=await getAllFlightsExceptDelayed();
        return res.status(200).send(flights);
    })
)

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

        await deleteKey("flights");

        io.emit("ops-event",`Flight ${flightNo} is delayed.\nDue to ${message}`);
        
        // await producer.send({
        //     topic:"ops",
        //     messages:[
        //     {
        //         key:flight._id,
        //         value:JSON.stringify({
        //             type:"delay-flight",
        //             message,
        //             ...flight,
        //         })
        //     }
        // ]
        // });
        return res.status(200).send("Delayed successfully");
    })
    
);

export default router;