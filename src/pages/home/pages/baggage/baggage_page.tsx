import type { Baggage } from "../../../../models/baggage";
import "./baggage_page.css";
import BaggageCard from "./components/baggage_card";
export default function BaggagePage(){
    const dummyFlight: Baggage = {
            _id: "",
            tagId:"TAG!",
            flightId: 'AI203',
            weight:10,
            status: 'On-Time',
            createdBy: 'admin',
        };
        const dummyFlight1: Baggage = {
             _id: "",
            tagId:"TAG!",
            flightId: 'AI203',
            weight:10,
            status: 'On-Time',
            createdBy: 'admin',
            lastLocation:"BEN",
        };
    return <>
        <div className="home-flex">
            <div className="home-header">Baggage</div>
            <div className="baggage home-body">
                <BaggageCard baggage={dummyFlight1} />
                <BaggageCard baggage={dummyFlight} />
                <BaggageCard baggage={dummyFlight} />
                <BaggageCard baggage={dummyFlight} />
            </div>
        </div>
        
    </>;
}