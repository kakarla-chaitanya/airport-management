import { useEffect, useState } from "react";
import { useFloatingslidePanelContext } from "../../../../context/floating_slide_panel_context";
import type { Baggage } from "../../../../models/baggage";
import FloatingActionButton from "../../components/floating_action_button";
import "./baggage_page.css";
import BaggageCard from "./components/baggage_card";
import BaggageForm from "./components/baggage_form";
import { useAuthContext } from "../../../../context/auth_context";
import { useLoaderContext } from "../../../../context/loader_context";
import { getAllBaggages } from "../../../../services/baggage_service";
import { Roles } from "../../../../models/roles";
export default function BaggagePage(){

    const {authChecked,user}=useAuthContext();
    const setLoading=useLoaderContext();
    const {setChild,setOpen}=useFloatingslidePanelContext();

    const [baggages,setBaggages]=useState<Baggage[]>([]);
    useEffect(()=>{
        if (authChecked){
            (async () => {
                setLoading(true);
                const res=await getAllBaggages();
                if (res){
                    setBaggages(res);
                }
                setLoading(false);
            })();
        }
    },[authChecked]);
    return <>
        <div className="home-flex">
            <div className="home-header">Baggage</div>
            <div className="baggage home-body">
                {
                    baggages.length==0
                    ?
                    <div className="no-baggage">
                        Smooth travels ahead! There are currently no baggages to display.
                    </div>
                    :
                    baggages.map((x,i)=><BaggageCard
                        key={i}
                        index={i}
                        setBaggages={setBaggages}
                        baggage={x}
                    />)
                }
            </div>
            
            {(user?.role===Roles.admin || user?.role===Roles.airlineStaff || user?.role===Roles.baggageStaff)
                &&
                <FloatingActionButton onClick={(e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                    setChild(<BaggageForm setBaggages={setBaggages} onCancel={()=>{
                        setOpen(false);
                        setChild(null);
                    }}/>);
                    setOpen(true);
                }} />
            }
        </div>  
    </>;
}