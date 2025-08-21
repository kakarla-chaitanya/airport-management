import DashboardCard from "./components/dashboard_card";
import "./dashboard_page.css";
import { MdCheckBox, MdSquare, MdAttachMoney, MdDashboard } from 'react-icons/md';

export default function DashboardPage(){
    return <>
        <div className="home-flex">
            <div className="home-header">Dashboard</div>
            <div className="dashboard home-body">
                <DashboardCard title="Orders" value={201} icon={<MdSquare />} />
                <DashboardCard title="Approved" value={36} icon={<MdCheckBox />} />
                <DashboardCard title="Month total" value={25410} icon={<MdAttachMoney />} />
                <DashboardCard title="Revenue" value={1352} icon={<MdDashboard />} />
            </div>
        </div>
        
    </>;
}