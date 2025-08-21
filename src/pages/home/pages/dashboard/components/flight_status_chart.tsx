import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { FlightStatus } from "../../../../../models/flight_status";
import "./styles/flight_status_chart.css";

const statusColors: Record<FlightStatus, string> = {
  scheduled: "#6366f1",
  boarding: "#22c55e",
  departed: "#facc15",
  arrived: "#0ea5e9",
  delayed: "#fb923c",
  cancelled: "#ef4444",
};

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

type ChartDataItem = {
  month: string;
} & {
  [key in FlightStatus]?: number;
};


type FlightData = Record<string, Partial<Record<FlightStatus, number>>>; // New type

// Replace this object with actual backend data
const mockData: FlightData = {
  JAN: { scheduled: 5 },
  FEB: { scheduled: 3, delayed: 1 },
  APR: { scheduled: 3, cancelled: 1 },
  MAY: { delayed: 4, cancelled: 2 },
  OCT: { boarding: 8 },
  DEC: { arrived: 2 },
};

export default function FlightStatusChart() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(2023);
  const [statusFilter, setStatusFilter] = useState<FlightStatus | "all">("all");

  const chartData: ChartDataItem[] = useMemo(() => {
    return months.map((month) => ({
      month,
      ...mockData[month],
    }));
  }, [statusFilter, year]);

  const totalFlights = chartData.reduce((sum, item) => {
  return sum + Object.keys(item).reduce((innerSum, key) => {
    return key !== "month" && typeof item[key as FlightStatus] === "number"
      ? innerSum + (item[key as FlightStatus] as number)
      : innerSum;
  }, 0);
}, 0);


  const years = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => 1960 + i);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Flight Status Overview</h3>
        <div className="chart-controls">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="custom-dropdown">
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="custom-dropdown">
            <option value="all">All</option>
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="total-flights">Total Flights: {totalFlights}</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barCategoryGap={20}>
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 10, fontSize: 14, backgroundColor: "#f9fafb" }}
            labelStyle={{ fontWeight: "bold" }}
            cursor={{ fill: "#f3f4f6" }}
          />
          {(statusFilter === "all" ? Object.keys(statusColors) : [statusFilter]).map((status) => (
            <Bar
              key={status}
              dataKey={status}
              stackId="a"
              fill={statusColors[status as FlightStatus]}
              radius={statusFilter !== "all" ? [8, 8, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
