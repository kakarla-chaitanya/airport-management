import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisurl=process.env.REDIS_URL;
const redisClient=redisurl?new Redis(redisurl):new Redis();
console.log("Connected to redis");
export default redisClient;