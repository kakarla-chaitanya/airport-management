export interface Baggage{
    _id:string;
    tagId:string;
    flightId:string;
    weight:Number;
    status:string;
    createdBy:string;
    lastLocation?:string;
}