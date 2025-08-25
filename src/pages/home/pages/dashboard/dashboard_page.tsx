import { FaPeopleGroup, FaUser } from "react-icons/fa6";
import DashboardCard from "./components/dashboard_card";
import FlightStatusChart from "./components/flight_status_chart";
import "./dashboard_page.css";
import { GiCommercialAirplane } from "react-icons/gi";
import { LuBaggageClaim } from "react-icons/lu";
import { getCSSVariable } from "../../../../utils/get_css_variable";
import { useEffect, useState } from "react";
import { useLoaderContext } from "../../../../context/loader_context";
import { useAuthContext } from "../../../../context/auth_context";
import { getDashboardDetails } from "../../../../services/dashboard-service";
import BaggageStatusPieChart from "./components/baggage_status_pie_chart";
import { BaggageStatus, createEmptyBaggageStatusCount } from "../../../../models/baggage_status";

export default function DashboardPage(){
    const setLoading=useLoaderContext();
    const {authChecked}=useAuthContext();
    
    const primaryColor=getCSSVariable("--primary-purple");

    const [dashboardData,setDashboardData]=useState<{
        totalUsers:number;
        airlineStaff:number;
        baggageStaff:number;
        endUsers:number;
        totalFlightsToday:number;
        delayedFlightsToday:number;
        cancelledFlightsToday:number;
        baggageStatusCount:Record<BaggageStatus, number> ;
    }>({
            totalUsers:0,
            airlineStaff:0,
            baggageStaff:0,
            endUsers:0,
            totalFlightsToday:0,
            delayedFlightsToday:0,
            cancelledFlightsToday:0,
            baggageStatusCount:createEmptyBaggageStatusCount(),
    });
    
    useEffect(()=>{
        if (authChecked){
            (async () => {
                setLoading(true);
                const res=await getDashboardDetails();
                if (res){
                    setDashboardData(res);
                }
                setLoading(false);
            })();
        }
    },[authChecked]);

    return <>
        <div className="home-flex">
            <div className="home-header">Dashboard</div>
            <div className="dashboard home-body">
                <div className="users">
                    <DashboardCard 
                        title="Total Users" 
                        value={dashboardData.totalUsers} 
                        icon={<FaPeopleGroup color={primaryColor}/>} 
                    />
                    <DashboardCard 
                        title="Airline Staff" 
                        value={dashboardData.airlineStaff} 
                        icon={<GiCommercialAirplane color={primaryColor}/>} 
                    />
                    <DashboardCard 
                        title="Baggage staff" 
                        value={dashboardData.baggageStaff} 
                        icon={<LuBaggageClaim  color={primaryColor}/>} 
                    />
                    <DashboardCard 
                        title="End-Users" 
                        value={dashboardData.endUsers} 
                        icon={<FaUser color={primaryColor}/>} 
                    />
                </div>
                <div className="delay">
                    <div className="delay-grid">
                    <DashboardCard 
                        title="Total Flights Today" 
                        value={dashboardData.totalFlightsToday} 
                        icon={<GiCommercialAirplane color={primaryColor}/>} 
                    />
                    <DashboardCard 
                        title="Flights Delayed Today" 
                        value={dashboardData.delayedFlightsToday} 
                        icon={<GiCommercialAirplane color="#f59e0b"/>} 
                    />
                    <DashboardCard 
                        title="Flights Cancelled Today" 
                        value={dashboardData.cancelledFlightsToday} 
                        icon={<GiCommercialAirplane color="red"/>} 
                    />
                    <DashboardCard 
                        title="In-Transit baggages" 
                        value={dashboardData.baggageStatusCount["In-transit"]} 
                        icon={<LuBaggageClaim  color={primaryColor}/>} 
                    />
                    <DashboardCard 
                        title="Lost Baggage percentage" 
                        value={
                            (() => {
                              const lost = dashboardData.baggageStatusCount[BaggageStatus.lost] || 0;
                              const total = Object.values(dashboardData.baggageStatusCount).reduce((sum, count) => sum + count, 0);
                              const percentage = total > 0 ? ((lost / total) * 100).toFixed(1) : "0.0";
                              return `${percentage}%`;
                            })()
                        } 
                        icon={<LuBaggageClaim  color="red"/>} 
                    />
                    <DashboardCard 
                        title="Loaded Baggages" 
                        value={dashboardData.baggageStatusCount.loaded}
                        icon={<LuBaggageClaim  color="blue"/>} 
                    />
                    </div>
                    <div className="baggage-pie-chart">
                        <BaggageStatusPieChart baggageRecord={dashboardData.baggageStatusCount}/>
                    </div>
                </div>
                
                <div className="charts">
                    <div className="chart-wrapper"><FlightStatusChart /></div>
                </div>
            </div>
        </div>
        
    </>;
}