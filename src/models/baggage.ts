import type { BaggageStatus } from "./baggage_status";

export interface Baggage{
    _id:string;
    tagId:string;
    flightId:string;
    weight:number;
    status:BaggageStatus;
    createdBy:string;
    lastLocation?:string;
}