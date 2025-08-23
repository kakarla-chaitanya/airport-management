import redisClient from "../config/redis";
import dotenv from "dotenv";

dotenv.config();
const TTL:number=Number(process.env.TTL_FOR_CACHE||3600);

export async function getOrSetCache<T>(
    key:string,
    fetch:()=>Promise<T>,
    ttl:number=TTL,
) :Promise<{
        source:string,
        data:T
    }>{
    const cached=await redisClient.get(key);
    if (cached){ 
        return {
            source:"Cache",
            data:JSON.parse(cached),
        };
    }
    const newData=await fetch();
    await redisClient.set(key,JSON.stringify(newData),"EX",ttl);
    return {
            source:"Database",
            data:newData,
        };
}

export async function setCache<T>(key:string,value:T,ttl:number=TTL) {
    await redisClient.set(key,JSON.stringify(value),"EX",ttl);
}

export async function deleteKey(key:string) {
    await redisClient.del(key);
}