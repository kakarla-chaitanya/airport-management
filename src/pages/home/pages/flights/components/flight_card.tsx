import { MdDelete, MdEdit } from "react-icons/md";
import "./styles/flight_card.css";
import type { Flight } from "../../../../../models/flight";



interface FlightCardProps {
  flight: Flight;
  onEdit: () => void;
  onDelete: () => void;
}

const FlightCard = ({ flight, onEdit, onDelete}: FlightCardProps) => {
  return (
    <div className="flight-card">
      <div className="flight-card-header">
        <h3>{flight.flightNo}</h3>
        <span className={`status-badge status-${flight.status.toLowerCase()}`}>
          {flight.status}
        </span>
      </div>

      <div className="flight-card-body">
        <div>
          <strong>Origin:</strong> {flight.origin}
        </div>
        <div>
          <strong>Destination:</strong> {flight.destination}
        </div>
        {flight.airlineCode && (
          <div>
            <strong>Airline:</strong> {flight.airlineCode}
          </div>
        )}
        {flight.gate && (
          <div>
            <strong>Gate:</strong> {flight.gate}
          </div>
        )}
        {flight.scheduledArr && (
          <div>
            <strong>Arrival:</strong>{" "}
            {new Date(flight.scheduledArr).toLocaleString()}
          </div>
        )}
        {flight.scheduledDep && (
          <div>
            <strong>Departure:</strong>{" "}
            {new Date(flight.scheduledDep).toLocaleString()}
          </div>
        )}
      </div>

      <div className="flight-card-actions">
        <button className="icon-btn edit-btn" onClick={onEdit}>
          <MdEdit style={{ marginRight: "6px" }} />
          Edit
        </button>
        <button className="icon-btn delete-btn" onClick={onDelete}>
          <MdDelete style={{ marginRight: "6px" }} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
