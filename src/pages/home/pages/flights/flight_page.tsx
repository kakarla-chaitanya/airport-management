import type { Flight } from "../../../../models/flight";
import FlightCard from "./components/flight_card";
import "./flight_page.css";

export default function FlightPage() {
  const dummyFlight: Flight = {
    _id: "",
    flightNo: "AI203",
    origin: "DEL",
    destination: "JFK",
    airlineCode: "AI",
    gate: "B14",
    scheduledArr: new Date(),
    scheduledDep: new Date(),
    status: "On-Time",
    createdBy: "admin",
  };
  const dummyFlight1: Flight = {
    _id: "",
    flightNo: "AI203",
    origin: "DEL",
    destination: "JFK",
    airlineCode: "AI",
    status: "Delayed",
    createdBy: "whjefbc",
  };

  const flights = [dummyFlight1, dummyFlight, dummyFlight,dummyFlight];

  

  return (
    <div className="home-flex">
      <div className="home-header">Flights</div>
      <div className="flights home-body">
        {flights.map((flight, i) => (
          <FlightCard
            key={i}
            flight={flight}
            onEdit={() => console.log("Edit flight")}
            onDelete={() => console.log("Delete flight")}
          />
        ))}
      </div>
    </div>
  );
}
