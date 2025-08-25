import { Schema } from "mongoose";
import IFlightSchema from "./i_flight_schema";
import { FlightStatus } from "../flight_status";
import {v4 as uuidv4} from 'uuid';

const FlightSchema=new Schema<IFlightSchema>({
    _id:{
        type:String,
        required:true,
        default:uuidv4,
        trim:true
    },
    flightNo:{
        type:String,
        required:true,
        unique:true,
        index:true,
        trim:true,
    },
    airlineCode:{
        type:String,
        trim:true,
    },
    origin:{
        type:String,
        required:true,
        trim:true,
    },
    destination:{
        type:String,
        required:true,
        trim:true,
    },
    gate:{
        type:String,
        trim:true,
    },
    scheduledArr:{
        type:Date,
        trim:true,
    },
    scheduledDep:{
        type:Date,
        trim:true,
    },
    status:{
        type:String,
        enum:Object.values(FlightStatus) as string[],
        required:true,
        default:FlightStatus.scheduled,
        trim:true,
    },
    createdBy:{
        type:String,
        ref:"User",
        required:true,
        trim:true,
    }
},{
    timestamps:true,
});

export default FlightSchema;