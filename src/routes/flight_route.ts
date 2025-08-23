import express from "express";
import validateToken from "../middleware/validate_token";
import { checkRoles } from "../middleware/check_roles";
import { Roles } from "../models/roles";
import asyncHandler from "../utils/async_handler";
import { body, validationResult } from "express-validator";
import InvalidRequestBodyError from "../Errors/invalid_request_body_error";
import { FlightStatus } from "../models/flight_status";
import { addNewFlight, deleteExistingFlight, getAllFlights, updateExistingFlight } from "../controllers/flight_controller";
import AuthenticationError from "../Errors/authentication_error";
import { deleteKey, getOrSetCache } from "../utils/cache";
import IFlightSchema from "../models/flight/i_flight_schema";
import { producer } from "../config/kafka";

const router=express.Router();

router.use(validateToken);

router.post("/",checkRoles([Roles.admin,Roles.airlineStaff]),[
    body("flightNo")
        .notEmpty().withMessage("Empty flight-no"),
    body("origin")
        .notEmpty().withMessage("Empty Origin"),
    body("destination")
        .notEmpty().withMessage("Empty Destination"),
    body("status")
        .optional().notEmpty().withMessage("Empty Status"),
],asyncHandler(async(req,res)=>{

    const errors=validationResult(req);
    if (!errors.isEmpty()){
        const firstError = errors.array()[0]; 
        throw new InvalidRequestBodyError(firstError?.msg,errors.array());
    }

    if ("status" in req.body){
        const {status}=req.body;
        if (!Object.values(FlightStatus).includes(status as FlightStatus)){
            throw new InvalidRequestBodyError(`Invalid status type. Status must be within ${FlightStatus.toString()}.`);
        }
    }

    const { scheduledArr, scheduledDep } = req.body;

    const arrivalDate = scheduledArr ? new Date(scheduledArr) : undefined;
    const departureDate = scheduledDep ? new Date(scheduledDep) : undefined;

    if (!req.user){
        throw new AuthenticationError("Invalid User");
    }

    const createdBy=req.user._id;
    const flight=await addNewFlight({
        ...req.body,
        createdBy,
        scheduledArr:arrivalDate,
        scheduledDep:departureDate,
    });

    await deleteKey("flights");

    await producer.send({
        topic:"flight",
        messages:[
            {
                key:flight._id,
                value:JSON.stringify({
                    type:"created",
                    ...flight
                })
            }
        ]
    });

    return res.status(200).json(flight);
}));

router.get(
    "/",
    checkRoles([Roles.admin,Roles.airlineStaff,Roles.baggageStaff]),
    asyncHandler(async (req,res)=>{
        const flights=await getOrSetCache<IFlightSchema[]>("flights",async ()=>{
            return await  getAllFlights();
        });
        return res.status(200).json(flights);
    })
);

router.put(
    "/:id",
    checkRoles([Roles.admin,Roles.airlineStaff]),
    asyncHandler(async (req,res)=>{

        const {id}=req.params;
        if (!id){
            throw new InvalidRequestBodyError("Invalid id");
        }

        if ("status" in req.body){
            const {status}=req.body;
            if (!Object.values(FlightStatus).includes(status as FlightStatus)){
                throw new InvalidRequestBodyError(`Invalid status type. Status must be within ${FlightStatus.toString()}.`);
            }
        }

        const newData=req.body;
        ["flightNo","createdBy","_id"].forEach(x=>delete newData[x]);

        const { scheduledArr, scheduledDep } = req.body;

        const arrivalDate = scheduledArr ? new Date(scheduledArr) : undefined;
        const departureDate = scheduledDep ? new Date(scheduledDep) : undefined;

        const flight=await updateExistingFlight(id,{
            ...newData,
            scheduledArr:arrivalDate,
            scheduledDep:departureDate,
        });

        await deleteKey("flights");

        await producer.send({
            topic:"flight",
            messages:[
                {
                    key:flight._id,
                    value:JSON.stringify({
                        type:"updated",
                        ...flight
                    })
                }
            ]
        });

        return res.status(200).json(flight);
    })
);

router.delete(
    "/:id",
    checkRoles([Roles.admin]),
    asyncHandler(async (req,res)=>{

        const {id}=req.params;
        if (!id){
            throw new InvalidRequestBodyError("Invalid id");
        }

        const flight=await deleteExistingFlight(id);

        await deleteKey("flights");

        await producer.send({
            topic:"flight",
            messages:[
                {
                    key:flight._id,
                    value:JSON.stringify({
                        type:"deleted",
                        ...flight
                    })
                }
            ]
        });

        return res.status(200).json(flight);
    })
);

export default router;