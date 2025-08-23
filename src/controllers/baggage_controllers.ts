import DataConsistencyError from "../Errors/data_consistency_error";
import EntityNotFoundError from "../Errors/entity_not_found_error";
import Baggage from "../models/baggage/baggage_model";
import { BaggageStatus } from "../models/baggage_status";

export async function addNewBaggage(params:{
    tagId:string;
    flightId:string;
    weight?:Number;
    status?:BaggageStatus;
    createdBy:string;
    lastLocation?:string;
}) {
    const existingBaggage=await Baggage.findOne({tagId:params.tagId});
    if (existingBaggage){
        throw new DataConsistencyError("Already a Baggage is existing with this tag-id");
    }
    const newBaggage=await Baggage.create({
        ...params
    });
    return {
        ...params,
        _id:newBaggage._id,
    }
}

export async function getAllBaggage() {
    const baggages=await Baggage.find({},{createdAt:0,updatedAt:0,__v:0}).sort({createdAt:-1});
    return baggages;
}

export async function updateExistingBaggage(_id:string,params:{
    flightId:string;
    weight?:Number;
    status?:BaggageStatus;
    lastLocation?:string;
}) {
    const baggage=await Baggage.findByIdAndUpdate(
        {_id},
        params,
        {
            new:true,
            runValidators:true,
            projection:{createdAt:0,updatedAt:0,__v:0},
        },
    );
    if (!baggage){
        throw new EntityNotFoundError("No flight exists with this id");
    }
    return baggage;
}

export async function deleteExistingBaggage(_id:string) {
    const baggage=await Baggage.findOneAndDelete(
        {_id},
        {
            projection:{createdAt:0,updatedAt:0,__v:0},
        }
    );
    if (!baggage){
        throw new EntityNotFoundError("No flight exists with this id");
    }
    return baggage;
}