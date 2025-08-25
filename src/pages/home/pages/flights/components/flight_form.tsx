import React, { useState } from "react";
import type { Flight } from "../../../../../models/flight";
import { FlightStatus } from "../../../../../models/flight_status";
import "../../../home_form.css";
import { useMessageContext } from "../../../../../context/message_context";
import { useLoaderContext } from "../../../../../context/loader_context";
import { addNewFlight, updateExistingFlight } from "../../../../../services/flight_service";
import CustomDropdown from "../../../../../components/custom_dropdown";


type FlightFormProps = {
  setFlights:React.Dispatch<React.SetStateAction<Flight[]>>;
  editIdx?:number;
  initialData?: Partial<Flight>;
  onCancel: () => void;
};


export default function FlightForm({ setFlights, initialData = {},onCancel,editIdx }: FlightFormProps) {

  const setLoading=useLoaderContext();
  const {addFormErrorMessage}=useMessageContext();

  const [flight, setFlight] = useState<Flight>({
    _id:"",
    flightNo: "",
    airlineCode: "",
    origin: "",
    destination: "",
    gate: "",
    scheduledArr: undefined,
    scheduledDep: undefined,
    status: FlightStatus.arrived,
    createdBy: "",
    ...initialData,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setFlight((f) => ({
      ...f,
      [name]: value,
    }));
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFlight((f) => ({
      ...f,
      [name]: value ? new Date(value) : undefined,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    if(flight.flightNo.trim().length==0){
      addFormErrorMessage("Empty Flight No");
      return;
    }
    if (flight.origin.trim().length==0){
      addFormErrorMessage("Empty Origin");
      return;
    }
    if (flight.destination.trim().length==0){
      addFormErrorMessage("Empty Destination");
      return;
    }
    if (flight.status.trim().length==0){
      addFormErrorMessage("Empty Flight Status");
      return;
    }
    setLoading(true);
    if (editIdx!==undefined){
      const res=await updateExistingFlight(flight);
      if (res){
        setFlights((prev)=>{
          const updated=[...prev];
          updated[editIdx]=res;
          return updated;
        });
        onCancel();
      }
    }else{
      const res=await addNewFlight(flight);
      if (res){
        setFlights((prev)=>[...prev,res]);
        onCancel();
      }
    }
    setLoading(false);
  }

  return (
    <form className="home-form" onSubmit={handleSubmit} noValidate>
      <div className="home-form-row">
        <label htmlFor="flightNo">Flight Number *</label>
        <input
          type="text"
          id="flightNo"
          name="flightNo"
          value={flight.flightNo}
          onChange={handleChange}
          required
          className="home-form-input"
          placeholder="Flight Number"
        />
      </div>

      <div className="home-form-row">
        <label htmlFor="airlineCode">Airline Code</label>
        <input
          type="text"
          id="airlineCode"
          name="airlineCode"
          value={flight.airlineCode || ""}
          onChange={handleChange}
          className="home-form-input"
          placeholder="e.g. AAA"
          maxLength={3}
        />
      </div>

      <div className="home-form-row">
        <label htmlFor="origin">Origin *</label>
        <input
          type="text"
          id="origin"
          name="origin"
          value={flight.origin}
          onChange={handleChange}
          required
          className="home-form-input"
          placeholder="City or Airport code"
        />
      </div>

      <div className="home-form-row">
        <label htmlFor="destination">Destination *</label>
        <input
          type="text"
          id="destination"
          name="destination"
          value={flight.destination}
          onChange={handleChange}
          required
          className="home-form-input"
          placeholder="City or Airport code"
        />
      </div>

      <div className="home-form-row">
        <label htmlFor="gate">Gate</label>
        <input
          type="text"
          id="gate"
          name="gate"
          value={flight.gate || ""}
          onChange={handleChange}
          className="home-form-input"
          placeholder="Gate number"
        />
      </div>

      <div className="home-form-row">
        <label htmlFor="scheduledArr">Scheduled Arrival</label>
        <input
          type="datetime-local"
          id="scheduledArr"
          name="scheduledArr"
          value={flight.scheduledArr ? new Date(flight.scheduledArr).toISOString().slice(0, 16) : ""}
          onChange={handleDateChange}
          className="home-form-input"
        />
      </div>

      <div className="home-form-row">
        <label htmlFor="scheduledDep">Scheduled Departure</label>
        <input
          type="datetime-local"
          id="scheduledDep"
          name="scheduledDep"
          value={flight.scheduledDep ? new Date(flight.scheduledDep).toISOString().slice(0, 16) : ""}
          onChange={handleDateChange}
          className="home-form-input"
        />
      </div>

      <div className="home-form-row">
        <label htmlFor="status">Status *</label>
        <CustomDropdown<string>
          options={Object.values(FlightStatus).filter((value) => typeof value === 'string')}
          toString={(val)=>val}
          value={flight.status}
          onChange={(value)=>{setFlight((prev)=>({...prev,status:value as FlightStatus}))}}
          placeholder="Select Status"
          className="full-width"
        />
      </div>

      <div className="home-form-actions">
        <button type="submit" className="home-form-submit-btn">
          {editIdx!==undefined ? "Update Flight" : "Add Flight"}
        </button>
        <button type="button" className="home-form-cancel-btn" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if(onCancel) onCancel();
        }}>
          Cancel
        </button>
      </div>

    </form>
  );
}
