import { Schema } from "mongoose";
import IBaggageSchema from "./i_baggage_schema";
import {v4 as uuidv4} from "uuid";
import { BaggageStatus } from "../baggage_status";

const BaggageSchema=new Schema<IBaggageSchema>({
    _id:{
        type:String,
        required:true,
        default:uuidv4,
        trim:true,
    },
    tagId:{
        type:String,
        required:true,
        unique:true,
        index:true,
        trim:true,
    },
    flightId:{
        type:String,
        required:true,
        ref:"flight",
        trim:true,
    },
    weight:{
        type:Number,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        enum:Object.values(BaggageStatus) as string[],
        default:BaggageStatus.checkin,
        required:true,
        trim:true,
    },
    createdBy:{
        type:String,
        ref:"user",
        required:true,
        trim:true
    },
    lastLocation:{
        type:String,
        trim:true,
    }
},{
    timestamps:true,
});

export default BaggageSchema;