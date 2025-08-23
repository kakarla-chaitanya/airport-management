import { Types } from "mongoose";
import { FlightStatus } from "../models/flight_status";
import IUserSchema from "../models/user/i_user_schema";
import Flight from "../models/flight/flight_model";
import DataConsistencyError from "../Errors/data_consistency_error";
import EntityNotFoundError from "../Errors/entity_not_found_error";

export async function addNewFlight(
    params:{
        flightNo:string;
        airlineCode?:string;
        origin:string;
        destination:string;
        gate?:string;
        scheduledArr?:Date;
        scheduledDep?:Date;
        status:FlightStatus;
        createdBy:Types.ObjectId|IUserSchema;
    }
) {
    const existingFlight=await Flight.findOne({flightNo:params.flightNo});
    if (existingFlight){
        throw new DataConsistencyError("Already a flight exists with same flight-no.");
    }
    const flight=await Flight.create({
        ...params,
    });
    return {
        ...params,
        _id:flight._id,
    };
}

export async function getAllFlights() {
    const flights=await Flight.find({},{createdAt:0,updatedAt:0,__v:0}).sort({createdAt:-1});
    return flights;
}

export async function updateExistingFlight(_id:string,params:{
    airlineCode?:string;
    origin:string;
    destination:string;
    gate?:string;
    scheduledArr?:Date;
    scheduledDep?:Date;
    status:FlightStatus;
}){
    const flight=await Flight.findByIdAndUpdate(
        {_id},
        params,
        {
            new:true,
            runValidators:true,
            projection:{createdAt:0,updatedAt:0,__v:0},
        },
    );
    if (!flight){
        throw new EntityNotFoundError("No flight exists with this id");
    }
    return flight;
}

export async function deleteExistingFlight(_id:string) {
    const flight=await Flight.findOneAndDelete(
        {_id},
        {
            projection:{createdAt:0,updatedAt:0,__v:0},
        }
    );
    if (!flight){
        throw new EntityNotFoundError("No flight exists with this id");
    }
    return flight;
}