import express from "express";
import validateToken from "../middleware/validate_token";
import asyncHandler from "../utils/async_handler";
import redisClient from "../config/redis";
import { getBaggageStatusCounts, getCancelledFlightsToday, getDelayedFlightsToday, getFlightStatusRecord, getTotalFlightsToday } from "../controllers/dashboard_controller";
import InvalidRequestBodyError from "../Errors/invalid_request_body_error";
import InvalidRequestError from "../Errors/invalid_request_error";

const router=express.Router();

router.use(validateToken);

router.get(
    "/",
    asyncHandler(async(req,res)=>{
        
        let airlineStaff=Number((await redisClient.get("dashboard-airline-staff"))||"0");
        let baggageStaff=Number((await redisClient.get("dashboard-baggage-staff"))||"0");
        let endUsers=Number((await redisClient.get("dashboard-end-users"))||"0");

        let totalUsers=airlineStaff+baggageStaff+endUsers+1;

        let baggageStatusCount=await getBaggageStatusCounts();

        let totalFlightsToday:number=await getTotalFlightsToday();
        let delayedFlightsToday:number=await getDelayedFlightsToday();
        let cancelledFlightsToday:number=await getCancelledFlightsToday();

        return res.status(200).json({
            totalUsers,
            airlineStaff,
            baggageStaff,
            endUsers,
            totalFlightsToday,
            delayedFlightsToday,
            cancelledFlightsToday,
            baggageStatusCount,
        });
    }),
);

router.get(
    "/flight",
    asyncHandler(async(req,res)=>{
        const yearParam = req.query.year;

        if (!yearParam || isNaN(Number(yearParam))) {
          throw new InvalidRequestError("Invalid query param - year");
        }

        const year=Number(yearParam)
        const flightsRecord=await getFlightStatusRecord(Number(year));
        return res.status(200).send(flightsRecord);
    })
);

export default router;