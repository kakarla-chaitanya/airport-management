import { useEffect, useState } from "react";
import { useFloatingslidePanelContext } from "../../../../context/floating_slide_panel_context";
import type { Flight } from "../../../../models/flight";
import FloatingActionButton from "../../components/floating_action_button";
import FlightCard from "./components/flight_card";
import FlightForm from "./components/flight_form";
import "./flight_page.css";
import { useAuthContext } from "../../../../context/auth_context";
import { useLoaderContext } from "../../../../context/loader_context";
import { getAllFlights } from "../../../../services/flight_service";
import { Roles } from "../../../../models/roles";

export default function FlightPage() {

  const {authChecked,user}=useAuthContext();
  const setLoading=useLoaderContext();
  const {setChild,setOpen}=useFloatingslidePanelContext();

  const [flights,setFlights]=useState<Flight[]>([]);

  useEffect(()=>{
    (async ()=>{
      if (authChecked){
        setLoading(true);
        const res=await getAllFlights();
        setFlights(res);
        setLoading(false);
      }
    })();
  },[authChecked]);
  

  return (
    <div className="home-flex">
      <div className="home-header">Flights</div>
      <div className="flights home-body">
        {flights.length==0
          ?
          <div className="no-flights">
            Your journey awaits, but no flights are scheduled just yet.
          </div>
          :
          flights.map((flight, i) => (
            <FlightCard
              key={i}
              index={i}
              flight={flight}
              setFlights={setFlights}
            />
          ))
        }
      </div>
      {(user?.role===Roles.admin || user?.role===Roles.airlineStaff) 
        &&
        <FloatingActionButton onClick={(e)=>{
          e.preventDefault();
          e.stopPropagation();
          setChild(<FlightForm setFlights={setFlights} onCancel={()=>{
            setOpen(false);
            setChild(null);
          }}/>);
          setOpen(true);
        }} />
      }
    </div>
  );
}
