import { MdDelete, MdEdit } from "react-icons/md";
import "./styles/flight_card.css";
import type { Flight } from "../../../../../models/flight";
import { useFloatingslidePanelContext } from "../../../../../context/floating_slide_panel_context";
import FlightForm from "./flight_form";
import { deleteExistingFlight } from "../../../../../services/flight_service";
import { useLoaderContext } from "../../../../../context/loader_context";
import { useAuthContext } from "../../../../../context/auth_context";
import { Roles } from "../../../../../models/roles";



interface FlightCardProps {
  index:number;
  flight: Flight;
  setFlights: React.Dispatch<React.SetStateAction<Flight[]>>
}

const FlightCard = ({ index,flight,setFlights}: FlightCardProps) => {

  const setLoading=useLoaderContext();
  const {setChild,setOpen}=useFloatingslidePanelContext();
  const {user}=useAuthContext();

  function onEdit(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
    e.preventDefault();
    e.stopPropagation();
    setChild(<FlightForm 
      setFlights={setFlights} 
      editIdx={index}
      onCancel={()=>{
        setOpen(false);
        setChild(null);
      }} 
      initialData={flight}
    />);
    setOpen(true);
  }
  async function onDelete(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const res=await deleteExistingFlight(flight._id);
    if (res){
      setFlights((prev)=>{
        const updated=prev.filter((x) => x._id !== res._id);
        return updated;
      });
    }
    setLoading(false);
  }
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
        <div>
          <strong>Airline:</strong> {flight.airlineCode?flight.airlineCode:"--"}
        </div>
          <div>
            <strong>Gate:</strong> {flight.gate?flight.gate:"--"}
          </div>
          <div>
            <strong>Arrival:</strong>{" "}
            {flight.scheduledArr?new Date(flight.scheduledArr).toLocaleString():"--"}
          </div>
          <div>
            <strong>Departure:</strong>{" "}
            {flight.scheduledDep ?new Date(flight.scheduledDep).toLocaleString():"--"}
          </div>
      </div>

      {(user?.role===Roles.admin || user?.role===Roles.airlineStaff)
        &&
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
      }

    </div>
  );
};

export default FlightCard;
