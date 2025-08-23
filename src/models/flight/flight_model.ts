import { model } from "mongoose";
import FlightSchema from "./flight_schema";

const Flight=model("flight",FlightSchema);
export default Flight;