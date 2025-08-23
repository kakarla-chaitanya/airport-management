import { Document } from "mongoose";
import { BaggageStatus } from "../baggage_status";

export default interface IBaggageSchema extends Document{
    _id:string;
    tagId:string;
    flightId:string;
    weight:Number;
    status:BaggageStatus;
    createdBy:string;
    lastLocation:string;
}