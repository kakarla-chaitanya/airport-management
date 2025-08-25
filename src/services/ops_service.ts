import { httpGet, httpPost } from "./http_service";
const baseUrl='/ops';

export async function getAllFlightsExceptDelayed() {
    const res=await httpGet(baseUrl);
    return res;
}
export async function delayFlight(flightNo:string,message:string) {
    const res=await httpPost(baseUrl+'/delay-flight',{
        flightNo,
        message,
    });
    return res;
}