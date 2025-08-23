import express, { Request,Response,NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import GlobalError from "../Errors/global_error";
import authRoute from "../routes/auth_route";
import flightRoute from "../routes/flight_route";
import baggageRoute from "../routes/baggage_route";
import opsRoute from "../routes/ops_route";
import rateLimiterMiddleware from "../middleware/rate_limiter_middleware";

const app=express();

app.set("trust proxy", true);

app.use(morgan('dev'));
app.use(cors({
    origin:"*",
}));
app.use(express.json());

app.use(cookieParser());


//global middleware
app.use(rateLimiterMiddleware);

//routes
app.use("/auth",authRoute);
app.use("/flight",flightRoute);
app.use("/baggage",baggageRoute);
app.use("/ops",opsRoute);


app.use((req, res) => {
  console.log('Unhandled route:', req.method, req.originalUrl);
  res.status(404).send('Not found');
});


//error handling
app.use((err:GlobalError,req:Request,res:Response,next:NextFunction)=>{
    console.log(err);
    const errorResponse:{
        name: string;
        message: string;
        code:string;
        details?: any;
    }={
        name:err.name,
        message:err.message,
        code:err.code,
    }
    if (err.details){
        errorResponse.details=err.details;
    }
    return res.status(err.statusCode).json(errorResponse);
});

app.use((err:Error,req:Request,res:Response,next:NextFunction)=>{
    console.log(err);
    return res.status(400).send(err.message);
});

export default app;
