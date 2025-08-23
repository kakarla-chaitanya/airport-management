import redisClient from "../config/redis";

const MAX_CONNECTIONS=Number(process.env.MAX_LOGINS||"3");
const TTL=Number(process.env.TTL_FOR_AUTH||"3600");
export async function createSession(id:string,deviceId:string,jti:string,ttl:number=TTL){
    const sessionKey=`session:${id}:${deviceId}`;
    const userKey=`session:${id}`;
    const loginAt=Date.now();
    
    await redisClient.set(sessionKey,jti,"EX",ttl);

    await redisClient.zadd(userKey,loginAt,sessionKey); //store device+id in list

    const sessionCount=await redisClient.zcard(userKey);
    if (sessionCount>MAX_CONNECTIONS){
        console.log("removing top one");
        const [oldest]=await redisClient.zrange(userKey,0,0);
        if(oldest){
            await redisClient.del(oldest); //delete this session+id
            await redisClient.zrem(userKey,oldest); //remove from list of devices
            console.log("Removed",oldest);
        }
    }
}

export async function verifySession(id:string,jti:string) {
    const sessionKeys=await redisClient.zrangebyscore(`session:${id}`,0,Date.now());
    
    for (const key of sessionKeys){
        const storedJti=await redisClient.get(key);
        if (storedJti===jti){
            return true;
        }
    }

    return false;
}

export async function logoutSession(id: string, deviceId: string) {
  const sessionKey = `session:${id}:${deviceId}`;
  const userKey = `session:${id}`;

  await redisClient.del(sessionKey); // Delete the session JTI
  await redisClient.zrem(userKey, sessionKey); // Remove it from session ZSET
}
