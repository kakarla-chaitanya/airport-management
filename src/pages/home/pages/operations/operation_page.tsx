import { useAuthContext } from "../../../../context/auth_context";
import { Roles } from "../../../../models/roles";
import DelayFlightCard from "./components/delay_flight_card";

export default function OperationPage(){
    const {user}=useAuthContext();
    return <>
        <div className="home-flex">
            <div className="home-header">Ops</div>
            <div className="home-body ops">
                {(user?.role==Roles.admin || user?.role===Roles.airlineStaff)
                &&
                <DelayFlightCard/>}
            </div>
        </div>
    </>;
}