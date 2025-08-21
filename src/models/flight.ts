export interface Flight {
    _id: string;
    flightNo: string;
    airlineCode?: string;
    origin: string;
    destination: string;
    gate?: string;
    scheduledArr?: Date;
    scheduledDep?: Date;
    status: string;
    createdBy: string;
}
