import { useEffect, useState } from "react";
import type { Flight } from "../../../../../models/flight";
import "../../../home_form.css";
import "./styles/delay_flight_card.css"; 
import CustomDropdown from "../../../../../components/custom_dropdown";
import { FlightStatus } from "../../../../../models/flight_status";
import { useAuthContext } from "../../../../../context/auth_context";
import { useLoaderContext } from "../../../../../context/loader_context";
import { delayFlight, getAllFlightsExceptDelayed } from "../../../../../services/ops_service";
import { useMessageContext } from "../../../../../context/message_context";



export default function DelayFlightCard() {

  const {authChecked}=useAuthContext();
  const setLoading=useLoaderContext();
  const {addFormErrorMessage}=useMessageContext();

  const [flights,setFlights]=useState<Flight[]>([]);

  const [selectedFlightId, setSelectedFlightId] = useState<Flight>({
    _id: "",
    flightNo: "",
    airlineCode: "",
    origin: "",
    destination: "",
    gate: "",
    scheduledArr: new Date(),
    scheduledDep: new Date(),
    status: FlightStatus.cancelled,
    createdBy: "",
  });
  const [reason, setReason] = useState("");

  useEffect(()=>{
    if (authChecked){
      (async () => {
        setLoading(true);
        const res=await getAllFlightsExceptDelayed();
        if (res){
          setFlights(res);
        }
        setLoading(false);
      })();
    }
  },[authChecked]);

  const handleSubmit =  async(e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedFlightId.flightNo.trim().length===0){
      addFormErrorMessage('Empty Flight-ID');
      return;
    }
    if (reason.trim().length===0){
      addFormErrorMessage("Empty Reason");
      return;
    }
    setLoading(true);
    const res=await delayFlight(selectedFlightId.flightNo,reason);
    if (res){
      setReason("");
      setSelectedFlightId({
        _id: "",
        flightNo: "",
        airlineCode: "",
        origin: "",
        destination: "",
        gate: "",
        scheduledArr: new Date(),
        scheduledDep: new Date(),
        status: FlightStatus.cancelled,
        createdBy: "",
      });
    }
    setLoading(false);
  };

  return (
    <form className="home-form delay-flight-card" onSubmit={handleSubmit}>
      <h2 className="delay-form-title">Delay a Flight</h2>
      {flights.length==0
      ?
        <div className="delay-no-flights">
          No Flights avalialbe
        </div>
      :
        <>
          <div className="home-form-row">
            <label htmlFor="flightNo">Flight Number *</label>
            <CustomDropdown<Flight>
              options={flights}
              value={selectedFlightId}
              toString={(flight)=> {
                if (flight.flightNo.trim().length==0){
                  return "";
                }
                return `${flight.flightNo}  ${flight.origin} -> ${flight.destination}`;
              }}
              onChange={(val) => setSelectedFlightId(val)}
              placeholder="Select Flight No"
              className="full-width"
              id="flightNo"
            />
          </div>

          <div className="home-form-row">
            <label htmlFor="reason">Reason for Delay *</label>
            <textarea
              id="reason"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="home-form-input delay-reason-textarea"
              placeholder="Explain the reason for the delay..."
              rows={4}
            />
          </div>

          <div className="home-form-actions">
            <button type="submit" className="home-form-submit-btn">
              Submit Delay
            </button>
          </div>
        </>
      }
    </form>
  );
}
