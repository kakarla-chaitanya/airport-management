import express from "express";
import validateToken from "../middleware/validate_token";
import { checkRoles } from "../middleware/check_roles";
import asyncHandler from "../utils/async_handler";
import { Roles } from "../models/roles";
import { body, validationResult } from "express-validator";
import InvalidRequestBodyError from "../Errors/invalid_request_body_error";
import { BaggageStatus } from "../models/baggage_status";
import AuthenticationError from "../Errors/authentication_error";
import { addNewBaggage, deleteExistingBaggage, getAllBaggage, updateExistingBaggage } from "../controllers/baggage_controllers";
import { deleteKey, getOrSetCache } from "../utils/cache";
import IBaggageSchema from "../models/baggage/i_baggage_schema";
import { producer } from "../config/kafka";

const router=express.Router();

router.use(validateToken);

router.get(
    "/",
    asyncHandler( async(req,res)=>{
        const baggages=await getOrSetCache<IBaggageSchema[]>("baggages",async ()=>{
            return await getAllBaggage();
        });
        return res.status(200).send(baggages);
    })
);

router.post(
    "/",
    checkRoles([Roles.admin,Roles.airlineStaff,Roles.baggageStaff]),
    [
        body("tagId")
            .notEmpty().withMessage("Empty tag-id"),
        body("flightId")
            .notEmpty().withMessage("Empty flight-id"),
        body("weight")
            .optional().isFloat({min:0.1,max:100}).withMessage("Weight must be within 0.1-100 kg"),
    ],
    asyncHandler(async (req,res)=>{

        const errors=validationResult(req);
        if (!errors.isEmpty()){
            const firstError = errors.array()[0]; 
            throw new InvalidRequestBodyError(firstError?.msg,errors.array());
        }

        if ("status" in req.body){
            const {status}=req.body;
            if (!Object.values(BaggageStatus).includes(status as BaggageStatus)){
                throw new InvalidRequestBodyError(`Invalid status type. Role must be within ${BaggageStatus.toString()}.`);
            }
        }

        if (!req.user){
            throw new AuthenticationError("Invalid user");
        }

        const createdBy=req.user._id;

        const baggage=await addNewBaggage({
            ...req.body,
            createdBy,
        });

        await deleteKey("baggages");

        await producer.send({
            topic:"baggage",
            messages:[
                {
                    key:baggage._id,
                    value:JSON.stringify({
                        type:"created",
                        ...baggage
                    })
                }
            ]
        });

        return res.status(200).json(baggage);
    })
)

router.put(
    "/",
    checkRoles([Roles.admin,Roles.airlineStaff,Roles.baggageStaff]),
    asyncHandler(async (req,res)=>{

        const id= req.query.id;
        if (!id ||typeof id !== "string" || !id.trim()){
            throw new InvalidRequestBodyError("Invalid id");
        }

        if ("status" in req.body){
            const {status}=req.body;
            if (!Object.values(BaggageStatus).includes(status as BaggageStatus)){
                throw new InvalidRequestBodyError(`Invalid status type. Status must be within ${BaggageStatus.toString()}.`);
            }
        }

        const newData=req.body;
        ["tagId","createdBy","_id"].forEach(x=>delete newData[x]);

        const baggage=await updateExistingBaggage(id,{
            ...newData,
        });

        await deleteKey("baggages");

        await producer.send({
            topic:"baggage",
            messages:[
                {
                    key:baggage._id,
                    value:JSON.stringify({
                        type:"updated",
                        ...baggage
                    })
                }
            ]
        });

        return res.status(200).json(baggage);
    })
);

router.delete(
    "/",
    checkRoles([Roles.admin,Roles.airlineStaff,Roles.baggageStaff]),
    asyncHandler(async (req,res)=>{

        const id= req.query.id;
        if (!id ||typeof id !== "string" || !id.trim()){
            throw new InvalidRequestBodyError("Invalid id");
        }

        const baggage=await deleteExistingBaggage(id);

        await deleteKey("baggages");

        await producer.send({
            topic:"baggage",
            messages:[
                {
                    key:baggage._id,
                    value:JSON.stringify({
                        type:"deleted",
                        ...baggage
                    })
                }
            ]
        });

        return res.status(200).json(baggage);
    })
);

export default router;