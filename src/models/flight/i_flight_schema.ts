import { Document } from "mongoose";
import { FlightStatus } from "../flight_status";

export default interface IFlightSchema extends Document{
    _id:string;
    flightNo:string;
    airlineCode:string;
    origin:string;
    destination:string;
    gate:string;
    scheduledArr:Date;
    scheduledDep:Date;
    status:FlightStatus;
    createdBy:string;
}