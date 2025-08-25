import { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { FlightStatus } from "../../../../../models/flight_status";
import "./styles/flight_status_chart.css";
import CustomDropdown from "../../../../../components/custom_dropdown";
import { ScaleLoader } from "react-spinners";
import { getCSSVariable } from "../../../../../utils/get_css_variable";
import { useAuthContext } from "../../../../../context/auth_context";
import { getFlightRecord } from "../../../../../services/dashboard-service";

const statusColors: Record<FlightStatus, string> = {
  scheduled: "#6366f1",
  boarding: "#22c55e",
  departed: "#facc15",
  arrived: "#0ea5e9",
  delayed: "#fb923c",
  cancelled: "#ef4444",
};

const statusOrder: FlightStatus[] = [
  FlightStatus.scheduled,
  FlightStatus.boarding,
  FlightStatus.departed,
  FlightStatus.arrived,
  FlightStatus.delayed,
  FlightStatus.cancelled,
];

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

type ChartDataItem = {
  month: string;
} & {
  [key in FlightStatus]?: number;
};

type FlightData = Record<string, Partial<Record<FlightStatus, number>>>;

// Custom bar shape to round top corners only on the top segment
const CustomBarShape = (props: any) => {
  const {
    x,
    y,
    width,
    height,
    fill,
    payload,
    dataKey,
    topBarsPerMonth,
  } = props;

  const isTopSegment = topBarsPerMonth[payload.month] === dataKey;
  const radius = isTopSegment ? [8, 8, 0, 0] : [0, 0, 0, 0];

  return (
    <Rectangle
      {...props}
      radius={radius}
      fill={fill}
      x={x}
      y={y}
      width={width}
      height={height}
    />
  );
};

export default function FlightStatusChart() {
  const { authChecked } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const loaderColor = getCSSVariable("--loader-color");

  const [data, setData] = useState<FlightData>({});

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [statusFilter, setStatusFilter] = useState<FlightStatus | "all">("all");

  async function fetchData() {
    setLoading(true);
    const res = await getFlightRecord(year);
    if (res) {
      setData(res);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (authChecked) {
      fetchData();
    }
  }, [authChecked, year]);

  const bars = statusFilter === "all" ? statusOrder : [statusFilter];

  const chartData: ChartDataItem[] = useMemo(() => {
    return months.map((month) => ({
      month,
      ...data[month],
    }));
  }, [data]);

  const totalFlights = chartData.reduce((sum, item) => {
    return sum + bars.reduce((innerSum, status) => {
      return innerSum + (item[status] || 0);
    }, 0);
  }, 0);

  // Identify top bar for each month
  const topBarsPerMonth = useMemo(() => {
    const result: Record<string, string | null> = {};
    chartData.forEach((item) => {
      let topBar: string | null = null;
      for (let i = bars.length - 1; i >= 0; i--) {
        const status = bars[i];
        if (item[status] && item[status]! > 0) {
          topBar = status;
          break;
        }
      }
      result[item.month] = topBar;
    });
    return result;
  }, [chartData, bars]);

  const years = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => 1960 + i);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Flight Status Overview</h3>
        <div className="chart-controls">
          <CustomDropdown<number>
            options={years}
            value={year}
            toString={(x) => x.toString()}
            onChange={(val) => setYear(Number(val))}
            className="year-dropdown"
          />
          <CustomDropdown<string>
            options={["all", ...statusOrder]}
            value={statusFilter}
            toString={(x) => x}
            onChange={(val) => setStatusFilter(val as FlightStatus | "all")}
            className="status-dropdown"
          />
        </div>
      </div>

      <p className="total-flights">Total Flights: {totalFlights}</p>
      {loading ? (
        <div className="chart-loader">
          <ScaleLoader color={loaderColor} loading={loading} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            barCategoryGap={20}
            barSize={12}
            margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
          >
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={30} />
            <Tooltip
              contentStyle={{ borderRadius: 10, fontSize: 14, backgroundColor: "#f9fafb" }}
              labelStyle={{ fontWeight: "bold" }}
              cursor={{ fill: "#f3f4f6" }}
            />
            {bars.map((status) => (
              <Bar
                key={status}
                dataKey={status}
                stackId="a"
                fill={statusColors[status]}
                shape={(props: any) => (
                  <CustomBarShape
                    {...props}
                    dataKey={status}
                    topBarsPerMonth={topBarsPerMonth}
                  />
                )}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
