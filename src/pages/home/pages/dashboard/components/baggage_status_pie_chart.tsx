import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BaggageStatus } from "../../../../../models/baggage_status";
import "./styles/baggage_status_pie_chart.css"; // Optional for styling



// Status colors
const COLORS: Record<BaggageStatus, string> = {
  [BaggageStatus.checkin]: "#3b82f6",
  [BaggageStatus.loaded]: "#10b981",
  [BaggageStatus.inTransit]: "#f59e0b",
  [BaggageStatus.unloaded]: "#8b5cf6",
  [BaggageStatus.atBelt]: "#0ea5e9",
  [BaggageStatus.lost]: "#ef4444",
};

type BaggageStatusPieChartProps={
    baggageRecord: Record<BaggageStatus, number>;
}


export default function BaggageStatusPieChart({baggageRecord}:BaggageStatusPieChartProps) {

    const chartData = Object.values(BaggageStatus).filter((x)=>typeof x==="string").map((status) => ({
      name: status,
      value: baggageRecord[status] ?? 0,
    }));

const totalCount = chartData.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="pie-chart-card">
      <h3 className="pie-chart-title">Baggage Status Overview</h3>
      <p className="pie-chart-subtitle">Total Baggage Count: {totalCount}</p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            isAnimationActive={true}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name as BaggageStatus]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => {
              const percent = ((value as number) / totalCount) * 100;
              return [`${value} (${percent.toFixed(0)}%)`, name];
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value) => (
              <span style={{ color: COLORS[value as BaggageStatus] }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
