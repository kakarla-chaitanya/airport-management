import Baggage from "../models/baggage/baggage_model";
import { BaggageStatus } from "../models/baggage_status";
import { startOfDay, endOfDay , startOfYear , endOfYear } from "date-fns";
import Flight from "../models/flight/flight_model";
import { FlightStatus } from "../models/flight_status";

export async function getBaggageStatusCounts() {
    const counts = await Baggage.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const countMap = counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    const result: Record<BaggageStatus, number> = Object.values(BaggageStatus).filter((x)=>typeof x==="string").reduce((acc, status) => {
      acc[status] = countMap[status] ?? 0;
      return acc;
    }, {} as Record<BaggageStatus, number>);
  
    return result;
}

export async function getTotalFlightsToday(): Promise<number> {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const count = await Flight.countDocuments({
    scheduledDep: { $gte: todayStart, $lte: todayEnd },
  });

  return count;
}

export async function getDelayedFlightsToday(): Promise<number> {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const count = await Flight.countDocuments({
    status: FlightStatus.delayed,
    scheduledDep: { $gte: todayStart, $lte: todayEnd },
  });

  return count;
}

export async function getCancelledFlightsToday(): Promise<number> {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const count = await Flight.countDocuments({
    status: FlightStatus.cancelled,
    scheduledDep: { $gte: todayStart, $lte: todayEnd },
  });

  return count;
}

type FlightData = Record<string, Partial<Record<FlightStatus, number>>>;

export async function getFlightStatusRecord(year: number): Promise<FlightData> {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 11, 31));

  const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
                     "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];


  const aggregation = await Flight.aggregate([
    {
      $match: {
        scheduledDep: { $gte: start, $lte: end }
      }
    },
    {
      $project: {
        month: { $month: "$scheduledDep" },
        status: 1
      }
    },
    {
      $group: {
        _id: { month: "$month", status: "$status" },
        count: { $sum: 1 }
      }
    }
  ]);

  // Prepare result
  const result: FlightData = {};
  for (let i = 0; i < 12; i++) {
    const monthName = MONTH_NAMES[i] as string;
    result[monthName] = {};
  }

  aggregation.forEach(({ _id, count }) => {
    const monthIndex = _id.month - 1; // MongoDB $month is 1–12
    const month = MONTH_NAMES[monthIndex];

    if (!month){
        return;
    }
    const status = _id.status as FlightStatus;

    if (!result[month]) result[month] = {};
    result[month]![status] = count;
  });

  return result;
}


