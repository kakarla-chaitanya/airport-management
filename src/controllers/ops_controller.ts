import EntityNotFoundError from "../Errors/entity_not_found_error";
import Flight from "../models/flight/flight_model";
import { FlightStatus } from "../models/flight_status";

export async function delayFlight(flightNo:string) {
    const flight=await Flight.findByIdAndUpdate(
        {flightNo},
        {status:FlightStatus.delayed},
        {
            new:true,
            runValidators:true,
            projection:{createdAt:0,updatedAt:0,__v:0},
        }
    );
    if (!flight){
        throw new EntityNotFoundError("No flight exists with this id");
    }
    return flight;
}