import type { FlightStatus } from "./flight_status";

export interface Flight {
    _id: string;
    flightNo: string;
    airlineCode?: string;
    origin: string;
    destination: string;
    gate?: string;
    scheduledArr?: Date;
    scheduledDep?: Date;
    status: FlightStatus;
    createdBy: string;
}
