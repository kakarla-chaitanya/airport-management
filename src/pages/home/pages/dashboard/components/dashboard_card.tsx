import './styles/dashboard_card.css';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

const DashboardCard = ({ title, value, icon }: DashboardCardProps) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <span>{title}</span>
        <div className="dashboard-card-icon">{icon}</div>
      </div>
      <div className="dashboard-card-value">{value}</div>
    </div>
  );
};

export default DashboardCard;
