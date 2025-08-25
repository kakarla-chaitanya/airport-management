import { httpGet } from "./http_service";

const baseUrl="/dashboard";
export async function getDashboardDetails() {
    const res=await httpGet(baseUrl);
    return res;
}

export async function getFlightRecord(year:number) {
    const res=await httpGet(baseUrl+"/flight",{params:{year}});
    return res;
}